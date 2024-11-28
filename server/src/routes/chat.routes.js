import { Router } from "express";
import { saveMessage, getChatHistory } from "../controllers/chat.controllers.js";
import { uploadOnServer } from "../middlewares/multer.middleware.js";
const chatRouter = Router();


chatRouter.post("/send", uploadOnServer.single("media"), saveMessage); 
chatRouter.get("/history", getChatHistory); 

export default chatRouter;
