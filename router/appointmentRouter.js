import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// Route to book a new appointment (only accessible by authenticated patient)
router.post("/post", isPatientAuthenticated, postAppointment);

// Route to get all appointments (only accessible by authenticated admin)
router.get("/getall", isAdminAuthenticated, getAllAppointments);

// Route to update appointment status (only accessible by authenticated admin)
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);

// Route to delete an appointment (only accessible by authenticated admin)
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;
