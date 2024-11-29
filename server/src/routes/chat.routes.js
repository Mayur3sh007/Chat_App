import { Router } from "express";
import { saveMessage, getChatHistory } from "../controllers/chat.controllers.js";
const chatRouter = Router();


chatRouter.post("/send", saveMessage); 
chatRouter.get("/history", getChatHistory); 

export default chatRouter;
