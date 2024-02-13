import { Equal, Repository } from "typeorm";
import { Like } from "../entity/Like";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { threadId } from "worker_threads";

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
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            const userId = res.locals.loginSession.user.id;
            console.log("data", data);

            const isLiked = await this.LikeRepository.findOne({
                where: {
                    user: userId,
                    thread: Equal(data.threadId),
                },
            });
            console.log("isLiked:", isLiked);

            if (isLiked) {
                const unLiked = await this.LikeRepository.delete(isLiked.id);
                return res.status(200).json({ message: "success unlike a thread", unLiked });
            }

            // const isLiked = await this.LikeRepository.findOneBy({ thread: Equal(22), user: Equal(5) });
            // console.log("isLiked:", isLiked);

            const dataLike = {
                created_at: new Date(),
                user: userId,
                thread: data.threadId,
            };

            const response = await this.LikeRepository.insert(dataLike);
            return res.status(200).json({ message: "success like a thread ", response });
        } catch (error) {
            console.log(error);
        }
    }
    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const userId = res.locals.loginSession.user.id;
            console.log("userId:", userId);

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

            return res.status(200).json({ message: "success delete like" });
        } catch (error) {
            console.log(error);
        }
    }
})();
