import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Async errors ko handle karne ke liye wrapper
import { User } from "../models/userSchema.js"; // Mongoose user model import
import ErrorHandler from "../middlewares/error.js"; // Custom error handler middleware
import { generateToken } from "../utils/jwtToken.js"; // JWT token generate karne wala function
import cloudinary from "cloudinary"; // Image upload ke liye cloudinary module

// Patient Registration Controller
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, aadhaar, dob, gender, password } = req.body; // Request body se user input le rahe hai

  // Sabhi required fields check kar rahe hai
  if (!firstName || !lastName || !email || !phone || !aadhaar || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400)); // Agar koi field missing ho to error throw karo
  }

  // Check kar rahe hai ki email se koi user already registered to nahi hai
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  // Naya patient user create kar rahe hai
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    password,
    role: "Patient", // Role fixed "Patient"
  });

  generateToken(user, "User Registered!", 200, res); // Token generate karke response send kar rahe hai
});

// Login Controller
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body; // Request se login details le rahe hai

  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Password and confirmPassword match hona chahiye
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password Do Not Match!", 400));
  }

  const user = await User.findOne({ email }).select("+password"); // User dhoond rahe hai aur password select kar rahe hai
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  // Password compare kar rahe hai
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  // Role match karna zaroori hai
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }

  generateToken(user, "Login Successfully!", 201, res); // Login successful toh token bhej rahe hai
});

// Admin Registration Controller
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, aadhaar, dob, gender, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !aadhaar || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  // Naya admin create kar rahe hai
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

// Doctor Registration Controller
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // Avatar check kar rahe hai
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }

  const { docAvatar } = req.files; // Doctor image
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  // Format validate kar rahe hai
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }

  const { firstName, lastName, email, phone, aadhaar, dob, gender, password, doctorDepartment } = req.body;

  // Sabhi required fields validate kar rahe hai
  if (!firstName || !lastName || !email || !phone || !aadhaar || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Doctor With This Email Already Exists!", 400));
  }

  // Cloudinary pe image upload kar rahe hai
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
    return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
  }

  // Naya doctor user create kar rahe hai
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

// Get All Doctors List
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" }); // Role filter laga ke doctors dhoond rahe hai
  res.status(200).json({
    success: true,
    doctors,
  });
});

// Get Current Logged-in User Details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user; // Middleware se user mila hai
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout Admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", { // Cookie ko expire kar rahe hai
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None"
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout Patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", { // Patient token expire kar rahe hai
      httpOnly: true,
      expires: new Date(Date.now()),
       secure: true,
      sameSite: "None"
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
