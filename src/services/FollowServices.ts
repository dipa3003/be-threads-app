import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Follow } from "../entity/Follow";
import { Request, Response } from "express";

export default new (class FollowServices {
    private readonly FollowServices: Repository<Follow> = AppDataSource.getRepository(Follow);

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            return res.status(200).json({ message: "success follow a user", id });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while follow a user", error });
        }
    }
})();
