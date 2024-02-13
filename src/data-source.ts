import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "3003",
    database: "be_threads",
    synchronize: true,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
