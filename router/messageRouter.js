// Express aur controller functions ko import kar rahe hain
import express from "express";  // Express framework ko import kar rahe hain
import {
  getAllMessages,  // Saare messages fetch karne ke liye controller function
  sendMessage,  // Naya message bhejne ke liye controller function
} from "../controller/messageController.js";  // Message controller ko import kar rahe hain
import { isAdminAuthenticated } from "../middlewares/auth.js";  // Admin authentication middleware ko import kar rahe hain

// Router ko initialize kar rahe hain
const router = express.Router();

// "/send" route par POST request ke liye sendMessage function ko call kar rahe hain
router.post("/send", sendMessage);

// "/getall" route par GET request ke liye, pehle admin authentication ko check karenge, phir getAllMessages function ko call karenge
router.get("/getall", isAdminAuthenticated, getAllMessages);

// Router ko export kar rahe hain taaki app.js ya main file me use kiya ja sake
export default router;
