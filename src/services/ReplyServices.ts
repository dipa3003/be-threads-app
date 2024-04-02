import { Repository } from "typeorm";
import { Reply } from "../entity/Reply";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { CreateReplySchema } from "../utils/validator/ReplyValidator";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";
import { redisClient } from "../libs/redis";

export default new (class ReplyServices {
    private readonly ReplyRepository: Repository<Reply> = AppDataSource.getRepository(Reply);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const replies = await this.ReplyRepository.createQueryBuilder("reply")
                .leftJoin("reply.user", "user")
                .addSelect(["user.id", "user.username", "user.full_name", "user.email", "user.bio", "user.image"])
                .leftJoinAndSelect("reply.thread", "thread")
                .getMany();

            return res.status(200).json(replies);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all reply", error });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const reply = await this.ReplyRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"],
                select: {
                    thread: {
                        id: true,
                        content: true,
                    },
                    user: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },
            });
            return res.status(200).json(reply);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all reply for detail thread", error });
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            data.userId = res.locals.loginSession.user.id;
            let image = null;

            if (res.locals.filename) {
                data.image = res.locals.filename;
            }

            const { error, value } = CreateReplySchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });
            console.log("value validator:", value);

            if (req.file) {
                // const cloudinary_reply_img = await cloudinary.destination(value.image)
                image = await cloudinary.destination(value.image);
                await deleteTempFile();
            }

            const newReply = {
                image: image,
                content: value.content,
                created_at: new Date(),
                user: value.userId,
                thread: value.threadId,
            };

            const response = await this.ReplyRepository.insert(newReply);
            await redisClient.del("threads");

            return res.status(200).json({ message: "success create a reply", response });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all reply", error });
        }
    }
})();
