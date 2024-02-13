import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Thread } from "../entity/Thread";
import { Request, Response } from "express";
import { CreateThreadSchema } from "../utils/validator/ThreadValidator";

export default new (class ThreadServices {
    private readonly ThreadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);

    async find(req: Request, res: Response): Promise<Response> {
        try {
            const threads = await this.ThreadRepository.find({
                relations: {
                    user: true,
                },
            });
            return res.status(200).json({ message: "success", threads: threads });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "Error while find all threads", error });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const data = await this.ThreadRepository.findOne({
                where: {
                    id: id,
                },
                relations: {
                    user: true,
                },
            });

            return res.status(200).json({ message: "success", data });
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

            console.log("image session:", data.image);
            const { error, value } = CreateThreadSchema.validate(data);
            console.log("value validator:", value);

            const newData = {
                content: value.content,
                user: value.userId,
                image: value.image,
                created_at: new Date(),
            };

            const response = await this.ThreadRepository.insert(newData);

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
            const response = await this.ThreadRepository.delete(id);
            return res.status(200).json({ message: "success", response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while delete a threads", error });
        }
    }
})();
