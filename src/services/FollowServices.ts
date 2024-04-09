import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Follow } from "../entity/Follow";
import { Request, Response } from "express";

export default new (class FollowServices {
    private readonly FollowRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

    async follow(req: Request, res: Response): Promise<Response> {
        try {
            const id_to_follow = req.params.id;
            const userId = res.locals.loginSession.user.id;

            const checkUser = await this.FollowRepository.createQueryBuilder("follow").where("follow.follower = :followingId", { followingId: id_to_follow }).andWhere("follow.following = :followerId", { followerId: userId }).getOne();

            if (checkUser) {
                const response = await this.FollowRepository.delete({ id: checkUser.id });

                return res.status(200).json({ message: "success Unfollow", response });
            }

            if (id_to_follow == userId) return res.status(400).json({ message: "Can not follow your account, try another user" });

            const response = await this.FollowRepository.createQueryBuilder("follow")
                .insert()
                .values({ follower: () => id_to_follow, following: () => userId, created_at: new Date() })
                .execute();

            return res.status(200).json({ message: "success follow a user", id_to_follow, userId, response });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while follow a user", error });
        }
    }

    async getFollow(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.query.userId;

            const follower = await this.FollowRepository.createQueryBuilder("follow").leftJoinAndSelect("follow.following", "follower").where("follow.follower= :id", { id: userId }).getMany();

            const following = await this.FollowRepository.createQueryBuilder("follow").leftJoinAndSelect("follow.follower", "following").where("follow.following= :id", { id: userId }).getMany();

            return res.status(200).json({ follower, following });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while getFollow users", error });
        }
    }
})();
