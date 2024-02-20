import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Thread } from "../entity/Thread";
import { Request, Response } from "express";
import { CreateThreadSchema } from "../utils/validator/ThreadValidator";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";

export default new (class ThreadServices {
    private readonly ThreadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const threads = await this.ThreadRepository.createQueryBuilder("thread")
                .leftJoinAndSelect("thread.user", "users")
                .leftJoinAndSelect("thread.likes", "likes")
                .leftJoinAndSelect("thread.replies", "replies")
                .loadRelationCountAndMap("thread.likes_count", "thread.likes")
                .loadRelationCountAndMap("thread.replies_count", "thread.replies")
                .orderBy("thread.id", "DESC")
                .getMany();

            return res.status(200).json(threads);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all threads", error });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);

            const data = await this.ThreadRepository.createQueryBuilder("thread")
                .leftJoinAndSelect("thread.user", "user")
                .leftJoinAndSelect("thread.likes", "likes")
                .leftJoinAndSelect("thread.replies", "replies")
                .loadRelationCountAndMap("thread.likes_count", "thread.likes")
                .loadRelationCountAndMap("thread.replies_count", "thread.replies")
                .where("thread.id = :id", { id })
                .getOne();

            return res.status(200).json({ message: "success", data });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find a threads", error });
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            data.userId = res.locals.loginSession.user.id;
            data.image = res.locals.filename;

            const { error, value } = CreateThreadSchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });

            const cloudinaryImg = await cloudinary.destination(value.image);
            await deleteTempFile();

            const newData = {
                content: value.content,
                user: value.userId,
                image: cloudinaryImg,
                created_at: new Date(),
            };

            const response = await this.ThreadRepository.insert(newData);

            return res.status(201).json({ message: "success", response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while create a threads", error });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            data.userId = res.locals.loginSession.user.id;
            console.log("id thread", id);

            const checkThread = await this.ThreadRepository.existsBy({ id: id });
            if (!checkThread) return res.status(404).json({ message: "Thread not found" });

            const { value, error } = CreateThreadSchema.validate(data);
            if (error) return res.status(400).json({ error: error.message });
            console.log("value validate:", value);

            const updateThread = {
                content: value.content,
                image: value.image,
                user: value.userId,
                created_at: new Date(),
            };

            return res.status(200).json({ message: "success update threads", updateThread });
        } catch (error) {
            console.log(error);
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const findThread = await this.ThreadRepository.findOneBy({ id });
            await cloudinary.delete(findThread.image);

            const response = await this.ThreadRepository.delete(id);

            return res.status(200).json({ message: "success", response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while delete a threads", error });
        }
    }
})();
