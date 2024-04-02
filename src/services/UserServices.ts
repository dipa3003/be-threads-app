import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";
import * as bcrypt from "bcrypt";
import { CreateUpdateUserSchema } from "../utils/validator/UserValidator";

export default new (class UserServices {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.UserRepository.createQueryBuilder("user")
                .select(["user.id", "user.username", "user.full_name", "user.email", "user.bio", "user.image"])
                .leftJoinAndSelect("user.following", "follower")
                .leftJoinAndSelect("user.follower", "following")
                .loadRelationCountAndMap("user.following_count", "user.following")
                .loadRelationCountAndMap("user.follower_count", "user.follower")
                .take(5)
                .orderBy("user.id", "DESC")
                .getMany();

            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all user", error });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.params.id);

            const user = await this.UserRepository.createQueryBuilder("user")
                .select(["user.id", "user.username", "user.full_name", "user.email", "user.bio", "user.image"])
                .leftJoinAndSelect("user.follower", "following")
                .leftJoinAndSelect("user.following", "follower")
                .leftJoinAndSelect("follower.follower", "followerUser")
                .loadRelationCountAndMap("user.following_count", "user.following")
                .loadRelationCountAndMap("user.follower_count", "user.follower")
                .where("user.id= :id", { id: userId })
                .getOne();

            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const userId = res.locals.loginSession.user.id;
            const data = req.body;
            data.image = res.locals.filename;

            // const checkUser = await this.UserRepository.existsBy({ id: userId });
            // if (checkUser) return res.status(400).json({ message: `${data.username} has already register` });

            const { value, error } = CreateUpdateUserSchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });

            console.log("value update user:", value);

            //find old data for input field in fe
            const old_data_user = await this.UserRepository.findOneBy({ id: userId });

            if (data.full_name != "") {
                old_data_user.full_name = value.full_name;
            }
            if (data.username != "") {
                old_data_user.username = value.username;
            }
            if (data.email != "") {
                old_data_user.email = value.email;
            }
            if (data.password != "") {
                // const encryptedPassword = await bcrypt.hash(value.password, 10);
                old_data_user.password = value.password;
            }
            if (data.bio != "") {
                old_data_user.bio = value.bio;
            }
            if (data.image != "") {
                const cloudinaryPicture = await cloudinary.destination(value.image);
                await deleteTempFile();
                old_data_user.image = cloudinaryPicture;
            }

            const response = await this.UserRepository.save(old_data_user);

            return res.status(201).json({ response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Oops...Something error while update user" });
        }
    }
})();
