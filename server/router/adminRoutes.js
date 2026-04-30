import express from "express";
import {
  createStudent,
  createTeacher,
  deleteStudent,
  deleteTeacher,
  getAllProjects,
  getAllUsers,
  updateStudent,
  updateTeacher,
} from "../controllers/adminController.js";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for students
router.post(
  "/create-student",
  isAuthenticated,
  isAuthorized("Admin"),
  createStudent,
);

router.put(
  "/update-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateStudent,
);

router.delete(
  "/delete-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteStudent,
);

// Routes for Teachers
router.post(
  "/create-teacher",
  isAuthenticated,
  isAuthorized("Admin"),
  createTeacher,
);

router.put(
  "/update-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateTeacher,
);

router.delete(
  "/delete-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteTeacher,
);

router.get(
  "/projects",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllProjects,
);

// getting the lists of all the Users
router.get("/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);

export default router;
