import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const submitProjectProposal = createAsyncThunk("/student/submitProjectProposal",
  async (data, thunkAPI) => {
    console.log("pahele", data)
    try {
      const res = await axiosInstance.post("/student/project-proposal", data)
      console.log(" baad", res.data.data)
      toast.success("Project proposal submitted successfully")
      return res.data.data?.project || res.data.data || res.data;
    } catch (error) {
      console.log("ERROR 👉", error.response);
      toast.error(error.response?.data?.message || "Failed to submit project proposal")
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)
const studentSlice = createSlice({
  name: "student",
  initialState: {
    project: null,
    files: [],
    supervisors: [],
    dashboardStats: [],
    supervisor: null,
    deadlines: [],
    feedback: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => { },
});

export default studentSlice.reducer;
