import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User schema define kar rahe hain - structure of user document in MongoDB
const userSchema = new mongoose.Schema({
  // First name field
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  // Last name field
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  // Email field with proper format validation
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  // Phone number field (India: 10 digits)
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  // Aadhaar number field (India's unique ID - 12 digit validation with regex)
  aadhaar: {
    type: String,
    required: [true, "Aadhaar Number Is Required!"],
    minLength: [12, "Aadhaar Number Must Be Exactly 12 Digits!"],
    maxLength: [12, "Aadhaar Number Must Be Exactly 12 Digits!"],
    match: [/^\d{12}$/, "Aadhaar Number Must Contain Only 12 Digits!"], // Only 12 digits allowed
  },
  // Date of Birth field
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  // Gender field with allowed values
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female"],
  },
  // Password field (min 8 characters, not selected by default)
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false, // Password ko default fetch se hata dete hain for security
  },
  // User role field (must be one of the given options)
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  // Doctor-specific field (optional)
  doctorDepartment: {
    type: String,
  },
  // Doctor avatar - public_id and URL for Cloudinary image
  docAvatar: {
    public_id: String,
    url: String,
  },
});

// Before saving user - agar password change hua hai toh usse hash karna
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); // Password hashing with bcrypt
});

// Compare password method - for login validation
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT token generate karne ka method
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES, // Token expiry set from .env
  });
};

// Final model export
export const User = mongoose.model("User", userSchema);
