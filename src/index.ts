import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import router from "./route";
import cloudinary from "./libs/cloudinary";
import "dotenv/config";
import { redisClient } from "./libs/redis";

AppDataSource.initialize()
    .then(async () => {
        const app = express();
        const PORT = process.env.PORT;

        app.use(cors());
        app.use(express.json());
        app.use("/api", router);
        cloudinary.upload();

        redisClient.on("error", (err) => console.log("Redis Client Error", err));

        app.listen(PORT, async () => {
            await redisClient.connect();
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
