import { Request, Response } from "express";
import ThreadServices from "../services/ThreadServices";
import ThreadQueue from "../queue/ThreadQueue";

export default new (class ThreadControllers {
    find(req: Request, res: Response) {
        ThreadServices.find(req, res);
    }
    findOne(req: Request, res: Response) {
        ThreadServices.findOne(req, res);
    }
    create(req: Request, res: Response) {
        // ThreadServices.create(req, res);
        ThreadQueue.create(req, res);
    }
    update(req: Request, res: Response) {
        ThreadServices.update(req, res);
    }
    delete(req: Request, res: Response) {
        ThreadServices.delete(req, res);
    }
    findUser(req: Request, res: Response) {
        ThreadServices.findByUser(req, res);
    }
})();
