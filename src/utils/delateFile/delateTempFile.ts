import { readdir, unlink } from "node:fs/promises";
import path = require("node:path");

export default async function deleteTempFile() {
    try {
        const dirPath = "src/uploads";
        const files = await readdir(dirPath);

        for (const file of files) {
            await unlink(path.join(dirPath, file));
        }
    } catch (error) {
        console.log(error);
    }
}
