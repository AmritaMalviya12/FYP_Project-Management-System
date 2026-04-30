import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
// import { createDeadline } from "./deadlineSlice";

// creating the student
export const createStudent = createAsyncThunk(
  "createStudent",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/admin/create-student`, data);
      toast.success(res.data.message || "Student created Successfully.");
      return res.data.data.user;
    } catch (error) { //backend error

      toast.error(error.response?.data?.message || "Failed to create Student");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

// updating the student
export const updateStudent = createAsyncThunk(
  "updateStudent",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/update-student/${id}`, data);
      toast.success(res.data.message || "Student updated Successfully.");
      return res.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update Student");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

// Deleting the Student
export const deleteStudent = createAsyncThunk(
  "deleteStudent",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/delete-student/${id}`);
      toast.success(res.data.message || "Student Deleted Successfully.");
      return id; //purpose to return id -- jisase hum ise createSlice me receive kr sake
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Delete Student");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

// Get All Users
export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/admin/users`);
      // toast.success(res.data.message || "Student Deleted Successfully.")
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Fetch Projects");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);




// creating the Teacher
export const createTeacher = createAsyncThunk(
  "createTeacher",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/admin/create-teacher`, data);
      
      toast.success(res.data.message || "Teacher created Successfully.");
      return res.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create teacher");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

// updating the Teacher
export const updateTeacher = createAsyncThunk(
  "updateTeacher",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/update-teacher/${id}`, data);
      toast.success(res.data.message || "Teacher updated Successfully.");
      return res.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update teacher");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

// Deleting the Teacher
export const deleteTeacher = createAsyncThunk(
  "deleteTeacher",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/delete-teacher/${id}`);
      toast.success(res.data.message || "Teacher Deleted Successfully.");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Delete teacher");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getAllProjects = createAsyncThunk(
  "getAllProjects",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/admin/projects`);
      // toast.success(res.data.message || "Student Deleted Successfully.")
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Fetch Users");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    // students: [],
    // teachers: [],
    projects: [],
    users: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.fulfilled, (state, action) => {
        if (state.users) state.users.unshift(action.payload); 
      })
      .addCase(updateStudent.fulfilled, (state, action) => { // state -- old data, action(event + data) -- updated data 
        if (state.users) {
          state.users = state.users.map((u) => {
            u._id === action.payload._id ? { ...u, ...action.payload } : u; // action.payload --- updateStudent se return updated user data hai
          });
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.filter((u) => {
            u._id !== action.payload._id;
          });
        }
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload.projects;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        if (state.users) state.users.unshift(action.payload);
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.map((u) => {
            u._id === action.payload._id ? { ...u, ...action.payload } : u;
          });
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.filter((u) => {
            u._id !== action.payload._id;
          });
        }
      })
  },
});

export default adminSlice.reducer;
