import { Request, Response } from "express";
import ReplyServices from "../services/ReplyServices";

export default new (class ReplyControllers {
    find(req: Request, res: Response) {
        ReplyServices.find(req, res);
    }
    findOne(req: Request, res: Response) {
        ReplyServices.findOne(req, res);
    }
    create(req: Request, res: Response) {
        ReplyServices.create(req, res);
    }
})();
