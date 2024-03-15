import { AppDataSource } from "../data-source";
import cloudinary from "../libs/cloudinary";
import * as amqp from "amqplib";
import "dotenv/config";
import ThreadWorker from "./ThreadWorker";

export default new (class WorkerHub {
    constructor() {
        AppDataSource.initialize()
            .then(async () => {
                cloudinary.upload();

                const connection = await amqp.connect(process.env.URL_CONNECTION);

                // ThreadWorker
                ThreadWorker.create(process.env.QUEUE_NAME, connection);
            })
            .catch();
    }
})();
