import { Request, Response } from "express";
import FollowServices from "../services/FollowServices";

export default new (class FollowControllers {
    follow(req: Request, res: Response) {
        FollowServices.follow(req, res);
    }
    getFollow(req: Request, res: Response) {
        FollowServices.getFollow(req, res);
    }
})();
