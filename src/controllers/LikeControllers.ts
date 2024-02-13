import { Request, Response } from "express";
import LikeServices from "../services/LikeServices";

export default new (class LikeControllers {
    find(req: Request, res: Response) {
        LikeServices.find(req, res);
    }
    create(req: Request, res: Response) {
        LikeServices.create(req, res);
    }
    delete(req: Request, res: Response) {
        LikeServices.delete(req, res);
    }
})();
