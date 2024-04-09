import * as amqp from "amqplib";
import cloudinary from "../libs/cloudinary";
import deleteTempFile from "../utils/delateFile/delateTempFile";
import { AppDataSource } from "../data-source";
import { Thread } from "../entity/Thread";
import { Repository } from "typeorm";
import { redisClient } from "../libs/redis";

export default new (class ThreadWorker {
    private readonly ThreadWorker: Repository<Thread> = AppDataSource.getRepository(Thread);
    async create(queueName: string, connection: amqp.Connection) {
        try {
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName);

            await channel.consume(queueName, async (message) => {
                if (message != null) {
                    try {
                        const data = JSON.parse(message.content.toString());
                        console.log(data);
                        let content = null;

                        if (data.content) {
                            content = data.content;
                        }

                        const cloudinaryImg = await cloudinary.destination(data.image);
                        await deleteTempFile();
                        // await redisClient.del("threads");

                        const obj = this.ThreadWorker.create({
                            content: content,
                            image: cloudinaryImg,
                            user: data.user,
                            created_at: data.created_at,
                        });

                        console.log("new thread:", obj);

                        await this.ThreadWorker.insert(obj);
                        console.log("Thread is created!");
                        channel.ack(message);
                    } catch (error) {
                        console.log(error);
                        return error;
                    }
                }
            });
        } catch (error) {
            console.log({ message: error });
            return error;
        }
    }
})();
