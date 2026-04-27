import express from "express";
import {
    getAvailableSupervisors,
    getStudentProject,
    submitProposal,
    uploadFiles
} from "../controllers/studentController.js";
import multer from "multer";
import {
    isAuthenticated,
    isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
    upload,
    handleUploadError
} from "../middlewares/upload.js";

const router = express.Router();

// Routes for students
router.post(
    "/project",
    isAuthenticated,
    isAuthorized("Student"),
    getStudentProject
);

router.post(
    "/project-proposal",
    isAuthenticated,
    isAuthorized("Student"),
    submitProposal
);

router.post(
    "/upload/:projectId",
    isAuthenticated,
    isAuthorized("Student"),
    upload.array("files", 10),
    handleUploadError,
    uploadFiles,
);

// Routes for Teachers
router.get(
    "/fetch-supervisors",
    isAuthenticated,
    isAuthorized("Student"),
    getAvailableSupervisors,
);


export default router;
