import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export default new (class UserServices {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User);

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.params.id);
            const response = await this.UserRepository.findOneBy({ id: userId });

            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
        }
    }
})();
