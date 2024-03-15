import { Request, Response } from "express";
import { CreateThreadSchema } from "../utils/validator/ThreadValidator";
import RabbitMQConfig from "../libs/rabbitmq";

export default new (class ThreadQueue {
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            data.userId = res.locals.loginSession.user.id;
            console.log("user login:", data.userId);
            data.image = res.locals.filename;

            const { error, value } = CreateThreadSchema.validate(data);
            if (error) return res.status(400).json({ message: error.message });

            const payload = {
                content: value.content,
                image: value.image,
                user: value.userId,
                created_at: new Date(),
            };

            const errorQueue = await RabbitMQConfig.sendToMessage(process.env.QUEUE_NAME, payload);
            if (errorQueue) return res.status(500).json({ message: errorQueue });

            return res.status(201).json({ message: "Thread is Queued", data: payload });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
})();
