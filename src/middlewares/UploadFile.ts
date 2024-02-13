import { NextFunction, Request, Response } from "express";
import * as multer from "multer";

export default new (class UploadFile {
    upload(fieldName: string) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "src/uploads");
            },
            filename: (req, file, cb) => {
                cb(null, `${file.fieldname} - ${Date.now()}.png`);
            },
        });

        const uploadFile = multer({ storage });

        return (req: Request, res: Response, next: NextFunction) => {
            uploadFile.single(fieldName)(req, res, (error: any) => {
                if (error) return res.status(400).json({ message: "Error while process handle upload image file", error });
                res.locals.filename = req.file.filename;
                next();
            });
        };
    }
})();
