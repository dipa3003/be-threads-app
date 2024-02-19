import { Repository } from "typeorm";
import { Reply } from "../entity/Reply";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { CreateReplySchema } from "../utils/validator/ReplyValidator";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";

export default new (class ReplyServices {
    private readonly ReplyRepository: Repository<Reply> = AppDataSource.getRepository(Reply);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const replies = await this.ReplyRepository.createQueryBuilder("reply").leftJoinAndSelect("reply.user", "user").leftJoinAndSelect("reply.thread", "thread").getMany();

            return res.status(200).json({ message: "success find all reply", replies });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all reply", error });
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            data.userId = res.locals.loginSession.user.id;
            data.image = res.locals.filename;

            const { error, value } = CreateReplySchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });
            console.log("value validator:", value);

            const cloudinary_reply_img = await cloudinary.destination(value.image);
            await deleteTempFile();

            const newReply = {
                image: cloudinary_reply_img,
                content: value.content,
                created_at: new Date(),
                user: value.userId,
                thread: value.threadId,
            };

            const response = await this.ReplyRepository.insert(newReply);

            return res.status(200).json({ message: "success create a reply", response });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all reply", error });
        }
    }
})();
