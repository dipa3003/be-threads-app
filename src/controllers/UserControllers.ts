import { Request, Response } from "express";
import UserServices from "../services/UserServices";

export default new (class UserControllers {
    findOne(req: Request, res: Response) {
        UserServices.findOne(req, res);
    }
})();
