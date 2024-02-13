import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import router from "./route";

AppDataSource.initialize()
    .then(async () => {
        const app = express();
        const PORT = 5000;

        app.use(cors());
        app.use(express.json());
        app.use("/api", router);

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log(error));
