import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// Register a new patient
router.post("/patient/register", patientRegister);

// Login for all user roles
router.post("/login", login);

// Add a new admin (only accessible by authenticated admin)
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// Add a new doctor (only accessible by authenticated admin)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// Get list of all registered doctors (open route)
router.get("/doctors", getAllDoctors);

// Get current patient details (requires patient auth)
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

// Get current admin details (requires admin auth)
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Logout patient (requires patient auth)
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// Logout admin (requires admin auth)
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;
