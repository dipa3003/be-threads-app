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

router.get("/threads/:id", multer.any(), ThreadControllers.find);
router.get("/thread/:id", ThreadControllers.findOne); //id thread
router.get("/threadsByUser/:id", ThreadControllers.findUser);
router.post("/threads/add", Auth.Authentication, UploadFile.upload("image"), ThreadControllers.create);
router.patch("/threads/:id", Auth.Authentication, multer.any(), ThreadControllers.update);
router.delete("/threads/:id", Auth.Authentication, ThreadControllers.delete);

router.get("/likes", LikeControllers.find);
router.post("/likes/add", Auth.Authentication, multer.any(), LikeControllers.create);
router.delete("/likes/:id", Auth.Authentication, LikeControllers.delete);

router.get("/reply", ReplyControllers.find);
router.get("/reply/:id", ReplyControllers.findOne);
router.post("/reply/add", Auth.Authentication, UploadFile.upload("image"), ReplyControllers.create);

router.post("/follow/:id", Auth.Authentication, multer.any(), FollowControllers.follow);
router.get("/follow", multer.any(), FollowControllers.getFollow);

router.get("/users", UserControllers.find);
router.get("/users/:id", UserControllers.findOne);
router.get("/suggestUser", Auth.Authentication, UserControllers.findSuggestUser);
router.patch("/users", Auth.Authentication, UploadFile.upload("image"), UserControllers.update);

router.post("/register", UploadFile.upload("image"), AuthControllers.register);
router.post("/login", multer.any(), AuthControllers.login);
router.get("/check", Auth.Authentication, AuthControllers.check);

export default router;
