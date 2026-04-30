import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js";

// creating student by the Admin
export const createStudent = asyncHandler(async (req, res, next) => {
  const { name, email, password, department } = req.body;
  if (!name || !email || !password || !department) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  const user = await userServices.createUser({
    name,
    email,
    password,
    department: department || null,
    role: "Student",
  });
  res.status(201).json({
    success: true,
    message: "Student created Successfully.",
    data: { user },
  });
});

// Updating student by the Admin
export const updateStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.role; //prevent role update of any student from student to admin or the teacher

  const user = await userServices.updateUser(id, updateData);
  if (!user) {
    return next(new ErrorHandler("Student not Found.", 404));
  }
  res.status(200).json({
    success: true,
    message: "Student Updated Successfully.",
    data: { user },
  });
});

// Deleting student details from the database by the Admin
export const deleteStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userServices.getUserById(id);

  if (!user) {
    return next(new ErrorHandler("Student Not Found", 400));
  }
  if (user.role !== "Student") {
    return next(new ErrorHandler("User is not a student", 400));
  }

  await userServices.deleteUser(id);
  res.status(200).json({
    success: true,
    message: "Student Deleted Successfully.",
  });
});

// creating Teacher by the Admin
export const createTeacher = asyncHandler(async (req, res, next) => {
  const { name, email, password, department, maxStudents, expertise } =
    req.body;
  if (
    !name ||
    !email ||
    !password ||
    !department ||
    !maxStudents ||
    !expertise
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  const user = await userServices.createUser({
    name,
    email,
    password,
    department: department || null,
    maxStudents,
    expertise: Array.isArray(expertise)
      ? expertise
      : typeof expertise === "string" && expertise.trim() !== ""
        ? expertise.split(",").map((s) => s.trim())
        : [],
    role: "Teacher",
  });
  res.status(201).json({
    success: true,
    message: "Teacher created Successfully.",
    data: { user },
  });
});


// Updating Teacher by the Admin
export const updateTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.role; //prevent role update of any student from student to admin or the teacher

  const user = await userServices.updateUser(id, updateData);
  if (!user) {
    return next(new ErrorHandler("Teacher not Found.", 400));
  }
  res.status(200).json({
    success: true,
    message: "Teacher Updated Successfully.",
    data: { user },
  });
});


// Deleting Teacher details from the database by the Admin
export const deleteTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userServices.getUserById(id);

  if (!user) {
    return next(new ErrorHandler("Teacher Not Found", 400));
  }
  if (user.role !== "Teacher") {
    return next(new ErrorHandler("User is not a Teacher", 400));
  }

  await userServices.deleteUser(id);
  res.status(200).json({
    success: true,
    message: "Teacher Deleted Successfully.",
  });
});


// getting all the users except the Admin one only
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { users } = await userServices.getAllUsers();
  res.status(200).json({
    success: true,
    message: "Users fetched Successfully",
    data: { users },
  });
});


// getting all the projects lists
export const getAllProjects = asyncHandler(async (req, res, next) => {
  const projects = await projectServices.getAllProjects();
  res.json({
    success: true,
    message: "Project fetched successfully",
    data: { projects },
  })
});

// to assign the supervisor to the student's projects
export const assignSupervisor = asyncHandler(async (req, res, next) => { });

// to get all the dashboard statistics from the admin page
export const getDashboardStats = asyncHandler(async (req, res, next) => { });