import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { CreateLoginSchema, CreateRegisterSchema } from "../utils/validator/AuthValidator";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";
import { redisClient } from "../libs/redis";

export default new (class AuthServices {
    private readonly AuthRepository: Repository<User> = AppDataSource.getRepository(User);

    async register(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            data.image = res.locals.filename;

            const checkUser = await this.AuthRepository.existsBy({ username: data.username });
            if (checkUser) return res.status(400).json({ message: `${data.username} has already register` });

            const { value, error } = CreateRegisterSchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });

            const encryptedPassword = await bcrypt.hash(value.password, 10);
            const cloudinaryPicture = await cloudinary.destination(value.image);
            await deleteTempFile();

            const user = {
                username: value.username,
                full_name: value.full_name,
                email: value.email,
                password: encryptedPassword,
                bio: value.bio,
                image: cloudinaryPicture,
            };
            await this.AuthRepository.insert(user);

            return res.status(201).json({ message: `Welcome ${user.username}` });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Oops...Something error while register" });
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;

            const { value, error } = CreateLoginSchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });

            const isLogin = await this.AuthRepository.findOneBy({ username: value.username });
            if (!isLogin) return res.status(400).json({ message: "Incorrect username, try again...", response: isLogin });

            const checkPassword = await bcrypt.compare(value.password, isLogin.password);
            if (!checkPassword) return res.status(400).json({ message: "Incorrect password, try again..." });

            const user = this.AuthRepository.create({
                username: isLogin.username,
                full_name: isLogin.full_name,
                id: isLogin.id,
            });

            const token = jwt.sign({ user }, process.env.SECRET_KEY_JWT, { expiresIn: "2h" });
            await redisClient.del("threads");

            return res.status(200).json({ message: "success login", user, token });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Oops...Something error while login" });
        }
    }

    async check(req: Request, res: Response): Promise<Response> {
        try {
            const userLogin = res.locals.loginSession.user.id;
            const user = await this.AuthRepository.findOneBy({ id: userLogin });

            return res.status(200).json({ message: "success check user", user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Oops...Something error while check auth" });
        }
    }
})();
