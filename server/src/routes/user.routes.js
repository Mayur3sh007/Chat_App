import { Router } from "express";
import {uploadOnServer} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserData, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.route("/register").post(
  uploadOnServer.single("avatar"),
  registerUser
)
userRouter.route("/login").post(loginUser)


//Secured routes
userRouter.route("/logout").get(verifyJWT,logoutUser);
userRouter.route("/getuser").get(verifyJWT, getUserData);

export default userRouter;