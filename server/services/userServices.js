import { User } from "../models/user.js";

// creating a user by Admin only
export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error(`Error Creating User ${error.message}`);
  }
};

// updating a user profile by Admin only
export const updateUser = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
  } catch (error) {
    throw new Error(`Error Updating User ${error.message}`);
  }
};

// getting the User Details using its id
export const getUserById = async (id) => {
  return await User.findById(id).select(
    "-password -resetPasswordToken -resetPasswordExpire",
  );
};

// getting all the users including bith Teachers and Students that are created or made or entered by the Admin.
export const getAllUsers = async () => {
    // Here Admin is not included in the lists of all the users fetched as the Admin is using the function by the same.
  const query = {role : {$ne: "Admin"}};
  const users = await User.find(query).select(
    "-password -resetPasswordToken -resetPasswordExpire",
  ).sort({createdAt: -1});

  const total = await User.countDocuments(query);

  return { users };
};



// // Deleting a user by Admin only
export const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User Not Found.");
  }
  return await user.deleteOne();
};
