import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Follow } from "../entity/Follow";
import { Request, Response } from "express";

export default new (class FollowServices {
    private readonly FollowRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

    async follow(req: Request, res: Response): Promise<Response> {
        try {
            const id_to_follow = req.params.id;
            console.log("id_from_query:", id_to_follow);

            const userId = res.locals.loginSession.user.id;

            const checkUser = await this.FollowRepository.createQueryBuilder("follow").where("follow.following = :followingId", { followingId: userId }).andWhere("follow.follower = :followerId", { followerId: id_to_follow }).getOne();

            if (checkUser) return res.status(400).json({ message: "user has been followed", data: checkUser });

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
})();
