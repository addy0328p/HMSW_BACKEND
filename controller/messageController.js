// Middlewares aur models ko import kar rahe hain
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";  // Async errors handle karne ke liye middleware
import ErrorHandler from "../middlewares/error.js";  // Custom error handler ko import kar rahe hain
import { Message } from "../models/messageSchema.js";  // Message model ko import kar rahe hain

// sendMessage function jo message bhejne ke liye hai
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  // Request body se necessary data extract kar rahe hain
  const { firstName, lastName, email, phone, message } = req.body;

  // Agar koi required field missing ho, toh error throw kar rahe hain
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));  // 400 Bad Request error
  }

  // Message ko database me create kar rahe hain
  await Message.create({ firstName, lastName, email, phone, message });

  // Agar message successfully send ho gaya, toh success response bhej rahe hain
  res.status(200).json({
    success: true,
    message: "Message Sent!",  // Success message
  });
});

// getAllMessages function jo sabhi messages fetch karne ke liye hai
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  // Database se saare messages fetch kar rahe hain
  const messages = await Message.find();

  // Messages ko successfully fetch karne ke baad response bhej rahe hain
  res.status(200).json({
    success: true,
    messages,  // All the messages are returned in the response
  });
});
