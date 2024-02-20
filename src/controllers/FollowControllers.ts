import { Request, Response } from "express";
import FollowServices from "../services/FollowServices";

export default new (class FollowControllers {
    create(req: Request, res: Response) {
        FollowServices.create(req, res);
    }
})();
