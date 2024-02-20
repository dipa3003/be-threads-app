import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export default new (class UserServices {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.UserRepository.createQueryBuilder("user")
                .leftJoinAndSelect("user.follower", "follower")
                .leftJoinAndSelect("user.following", "following")
                .loadRelationCountAndMap("user.following_count", "user.following")
                .loadRelationCountAndMap("user.follower_count", "user.follower")
                .getMany();

            return res.status(200).json({ message: "success find all users", users });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all user", error });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.params.id);

            const user = await this.UserRepository.createQueryBuilder("user")
                .leftJoinAndSelect("user.follower", "follower")
                .leftJoinAndSelect("user.following", "following")
                .loadRelationCountAndMap("user.following_count", "user.following")
                .loadRelationCountAndMap("user.follower_count", "user.follower")
                .where("user.id= :id", { id: userId })
                .getOne();

            // const response = await this.UserRepository.findOneBy({ id: userId });

            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    }
})();
