import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default new (class Auth {
    Authentication(req: Request, res: Response, next: NextFunction) {
        try {
            const Authorization = req.headers.authorization;
            if (!Authorization || !Authorization.startsWith("Bearer")) {
                return res.status(401).json({ message: "Unauthorized user" });
            }

            const token = Authorization.split(" ")[1];

            try {
                const jwtPayload = jwt.verify(token, "jwtsecretkey");
                res.locals.loginSession = jwtPayload;
                next();
            } catch (error) {
                return res.status(401).json({ message: "Token verification failed" });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Token verification failed!" });
        }
    }
})();
