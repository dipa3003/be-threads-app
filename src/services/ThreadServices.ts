import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Thread } from "../entity/Thread";
import { Request, Response } from "express";
import { CreateThreadSchema } from "../utils/validator/ThreadValidator";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";
import LikeServices from "./LikeServices";
import { redisClient } from "../libs/redis";

export default new (class ThreadServices {
    private readonly ThreadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.params.id);
            let data = await redisClient.get("threads");

            if (!data) {
                const threads = await this.ThreadRepository.createQueryBuilder("thread")
                    .leftJoin("thread.user", "user")
                    .addSelect(["user.id", "user.username", "user.full_name", "user.email", "user.bio", "user.image"])
                    .leftJoinAndSelect("thread.likes", "likes")
                    .leftJoinAndSelect("thread.replies", "replies")
                    .orderBy("thread.id", "DESC")
                    .getMany();

                const response = threads.map(async (thread) => await LikeServices.isLikedUser(userId, thread.id));
                const likedByUser = await Promise.all(response);

                let dataThreads = [];
                for (let i = 0; i < threads.length; i++) {
                    dataThreads.push({
                        id: threads[i].id,
                        content: threads[i].content,
                        created_at: threads[i].created_at,
                        image: threads[i].image,
                        user: threads[i].user,
                        likes_count: threads[i].likes.length,
                        replies_count: threads[i].replies.length,
                        isLiked: likedByUser[i],
                    });
                }

                const dataFromDB = JSON.stringify(dataThreads);

                data = JSON.stringify(dataThreads);
                await redisClient.setEx("threads", 3600, dataFromDB);
                // return res.status(200).json(dataThreads);
            }

            return res.status(200).json(JSON.parse(data));
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all threads", error });
        }
    }

    async findByUser(req: Request, res: Response): Promise<Response> {
        try {
            // const id = res.locals.loginSession.user.id;
            const id = Number(req.params.id);
            console.log("id user:", id);
            // let data = await redisClient.get("threadsByUser");

            const threadsByUser = await this.ThreadRepository.createQueryBuilder("thread")
                .leftJoin("thread.user", "user")
                .addSelect(["user.id", "user.username", "user.full_name", "user.email", "user.bio", "user.image"])
                .leftJoinAndSelect("thread.likes", "likes")
                .leftJoinAndSelect("thread.replies", "replies")
                .leftJoin("replies.user", "userreplies")
                .addSelect(["userreplies.id", "userreplies.username", "userreplies.full_name"])
                .loadRelationCountAndMap("thread.likes_count", "thread.likes")
                .loadRelationCountAndMap("thread.replies_count", "thread.replies")
                .orderBy("thread.id", "DESC")
                .where("user.id = :id", { id })
                // .where("thread.user = :id", { id })
                .getMany();

            const response = threadsByUser.map(async (thread) => await LikeServices.isLikedUser(id, thread.id));
            const likedByUser = await Promise.all(response);

            let dataThreads = [];
            for (let i = 0; i < threadsByUser.length; i++) {
                dataThreads.push({
                    id: threadsByUser[i].id,
                    content: threadsByUser[i].content,
                    created_at: threadsByUser[i].created_at,
                    image: threadsByUser[i].image,
                    user: threadsByUser[i].user,
                    likes_count: threadsByUser[i].likes.length,
                    replies_count: threadsByUser[i].replies.length,
                    isLiked: likedByUser[i],
                });
            }

            // const dataFromDB = JSON.stringify(dataThreads);
            // data = dataFromDB;
            // await redisClient.setEx("threadsByUser", 3600, dataFromDB);

            return res.status(200).json(dataThreads);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while find threads by user login", error });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);

            const thread = await this.ThreadRepository.createQueryBuilder("thread")
                .leftJoin("thread.user", "user")
                .addSelect(["user.id", "user.username", "user.full_name", "user.email", "user.bio", "user.image"])
                .leftJoinAndSelect("thread.likes", "likes")
                .leftJoinAndSelect("thread.replies", "replies")
                .leftJoin("replies.user", "userreplies")
                .addSelect(["userreplies.id", "userreplies.username", "userreplies.full_name", "userreplies.image"])
                .loadRelationCountAndMap("thread.likes_count", "thread.likes")
                .loadRelationCountAndMap("thread.replies_count", "thread.replies")
                .where("thread.id = :id", { id })
                .getOne();

            return res.status(200).json(thread);
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
            let content = null;
            let image = null;

            const { error, value } = CreateThreadSchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });

            if (data.content) {
                content = value.content;
            }
            if (data.image) {
                const cloudinaryImg = await cloudinary.destination(value.image);
                await deleteTempFile();
                image = cloudinaryImg;
            }

            const newData = {
                content: content,
                user: value.userId,
                image: image,
                created_at: new Date(),
            };

            const response = await this.ThreadRepository.insert(newData);
            await redisClient.del("threads");

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
            await redisClient.del("threads");

            return res.status(200).json({ message: "success", response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while delete a threads", error });
        }
    }
})();
