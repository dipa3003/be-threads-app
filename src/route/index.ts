import * as express from "express";
import ThreadControllers from "../controllers/ThreadControllers";
import AuthControllers from "../controllers/AuthControllers";
import Auth from "../middlewares/Auth";
import UploadFile from "../middlewares/UploadFile";
import LikeControllers from "../controllers/LikeControllers";
import UserControllers from "../controllers/UserControllers";
import ReplyControllers from "../controllers/ReplyControllers";
import FollowControllers from "../controllers/FollowControllers";

const multer = require("multer")();
const router = express.Router();

router.get("/threads", ThreadControllers.find);
router.get("/threads/:id", ThreadControllers.findOne);
router.post("/threads/add", Auth.Authentication, UploadFile.upload("image"), ThreadControllers.create);
router.patch("/threads/:id", Auth.Authentication, multer.any(), ThreadControllers.update);
router.delete("/threads/:id", Auth.Authentication, ThreadControllers.delete);

router.get("/likes", LikeControllers.find);
router.post("/likes/add", Auth.Authentication, multer.any(), LikeControllers.create);
router.delete("/likes/:id", Auth.Authentication, LikeControllers.delete);

router.get("/reply", ReplyControllers.find);
router.post("/reply/add", Auth.Authentication, UploadFile.upload("image"), ReplyControllers.create);

router.post("/follow", FollowControllers.create);

router.get("/user/:id", UserControllers.findOne);

router.post("/register", multer.any(), AuthControllers.register);
router.post("/login", multer.any(), AuthControllers.login);
router.get("/check", Auth.Authentication, AuthControllers.check);

export default router;
