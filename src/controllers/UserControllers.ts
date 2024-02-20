import { Request, Response } from "express";
import UserServices from "../services/UserServices";

export default new (class UserControllers {
    find(req: Request, res: Response) {
        UserServices.find(req, res);
    }
    findOne(req: Request, res: Response) {
        UserServices.findOne(req, res);
    }
})();
