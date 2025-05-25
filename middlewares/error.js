// Custom ErrorHandler class define kar rahe hain jo default JS Error class ko extend karta hai
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message); // Parent Error class ka constructor call karte hain
      this.statusCode = statusCode; // Custom status code set karte hain
    }
  }
  
  // Ye middleware saare errors ko catch karta hai aur unka proper response client ko bhejta hai
  export const errorMiddleware = (err, req, res, next) => {
    // Agar error ka message ya status code nahi hai to default set kar rahe hain
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Agar MongoDB me duplicate value insert karne ki koshish ho (jaise same email), to error handle kar rahe hain
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
    }
  
    // Agar JWT token invalid ho (matlab kisi ne galat token bheja ho)
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, Try again!`;
      err = new ErrorHandler(message, 400);
    }
  
    // Agar JWT token expire ho gaya ho (valid time ke baad use ho raha ho)
    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired, Try again!`;
      err = new ErrorHandler(message, 400);
    }
  
    // Agar MongoDB me invalid ObjectId diya gaya ho (jaise kisi document ko fetch karte waqt)
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    }
  
    // Agar Mongoose validation errors ho (jaise required field chhoot gaya ho), to sabko collect kar rahe hain
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message) // Har validation error ka message nikal rahe hain
          .join(" ") // Sab messages ko ek string me jod rahe hain
      : err.message; // Agar validation error nahi hai to default message use karenge
  
    // Final error response client ko bhej rahe hain
    return res.status(err.statusCode).json({
      success: false, // success false indicate karta hai ki error aaya hai
      message: errorMessage, // error ka final message bheja jaata hai
    });
  };
  
  // ErrorHandler class ko export kar rahe hain taaki controllers me use kiya ja sake
  export default ErrorHandler;
  