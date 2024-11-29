import { Router } from "express";
import {uploadOnServer} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserData, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)


//Secured routes
userRouter.route("/logout").post(verifyJWT,logoutUser);
userRouter.route("/getuser").get(verifyJWT, getUserData);

export default userRouter;