// User model ko import kar rahe hain jisme user ki schema aur methods defined hain
import { User } from "../models/userSchema.js";

// Async route handlers ke errors ko pakadne ke liye custom middleware
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// Custom error class jo status code ke sath error message throw karta hai
import ErrorHandler from "./error.js";

// JWT library import kar rahe hain, token verify karne ke liye
import jwt from "jsonwebtoken";

// ==========================
// ✅ Admin Authentication
// ==========================

export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    // Request ke cookies me se 'adminToken' nikal rahe hain
    const token = req.cookies.adminToken;

    // Agar token nahi mila to user authenticated nahi hai
    if (!token) {
      return next(
        new ErrorHandler("Dashboard User is not authenticated!", 400)
      );
    }

    // JWT token ko verify kar rahe hain
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // JWT se mili user ID ke basis par database se user details nikaal rahe hain
    req.user = await User.findById(decoded.id);

    // Agar user ka role "Admin" nahi hai to access deny kar dena
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }

    // Sab kuch theek hai to next middleware ko call karo
    next();
  }
);

// ==========================
// 🧑‍⚕️ Patient Authentication
// ==========================

export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    // Request ke cookies me se 'patientToken' nikal rahe hain
    const token = req.cookies.patientToken;

    // Agar token nahi mila to user authenticated nahi hai
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }

    // JWT token verify kar rahe hain
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Token se mili ID ke through database se user fetch kar rahe hain
    req.user = await User.findById(decoded.id);

    // Agar user ka role "Patient" nahi hai to unauthorized error dena
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }

    // Sab theek hai to request ko aage badhane do
    next();
  }
);

// ==========================
// 🔐 Role-based Authorization
// ==========================

export const isAuthorized = (...roles) => {
  // Ye middleware roles array lega, aur check karega ki current user ka role allowed roles me hai ya nahi
  return (req, res, next) => {
    // Agar user ka role allowed list me nahi hai to error throw karo
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }

    // Role allowed hai to next middleware/controller pe jao
    next();
  };
};
