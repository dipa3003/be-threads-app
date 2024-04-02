import { Repository } from "typeorm";
import { Like } from "../entity/Like";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { redisClient } from "../libs/redis";

export default new (class LikeServices {
    private readonly LikeRepository: Repository<Like> = AppDataSource.getRepository(Like);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const response = await this.LikeRepository.find({
                relations: ["user", "thread"],
            });
            return res.status(200).json({ message: "success find like", response });
        } catch (error) {
            console.log(error);
        }
    }

    async isLikedUser(userId: number, threadId: number) {
        const isLiked = await this.LikeRepository.createQueryBuilder("like").where("like.user= :user", { user: userId }).andWhere("like.thread= :thread", { thread: threadId }).getOne();

        return !!isLiked;
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body; //threadId
            const userId = res.locals.loginSession.user.id;

            const isLiked = await this.LikeRepository.createQueryBuilder("like").where("like.user = :userId", { userId }).andWhere("like.thread = :threadId", { threadId: data.threadId }).getOne();

            if (isLiked) {
                const unLiked = await this.LikeRepository.delete(isLiked.id);
                if (unLiked) {
                    await redisClient.del("threads");
                }
                return res.status(200).json({ message: "success unlike a thread", unLiked });
            }

            const dataLike = {
                created_at: new Date(),
                user: userId,
                thread: data.threadId,
            };

            const response = await this.LikeRepository.insert(dataLike);
            await redisClient.del("threads");

            return res.status(200).json({ message: "success like a thread ", response });
        } catch (error) {
            console.log(error);
        }
    }
    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const userId = res.locals.loginSession.user.id;

            const liked = await this.LikeRepository.findOne({
                where: {
                    id: id,
                    user: userId,
                },
                relations: {
                    user: true,
                    thread: true,
                },
            });
            console.log("liked:", liked);

            if (!liked) return res.status(404).json({ message: "Like not found" });

            const response = await this.LikeRepository.delete(liked.id);

            return res.status(200).json({ message: "success delete like", response });
        } catch (error) {
            console.log(error);
        }
    }
})();
