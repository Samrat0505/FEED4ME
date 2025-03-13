import axios from "axios";
import { ToastAndroid } from "react-native";

const BASE_URL = "https://feed4me-server.onrender.com/api";
// const BASE_URL = "http://localhost:3000/api";

export interface User {
  name: string;
  mobile: number | null;
  email: string;
  password: string;
  age: number;
  location: string;
}

interface LoginResponse {
  status: string;
  data: {
    _id: string;
    name: string;
    age: string;
    location: string;
    password: string;
    mobile: string;
    date: string;
    __v: number;
  };
  token: string;
}

interface Crop {
  name: string;
  MRP: number;
  stock: number;
}

export const registerUser = async (
  role: string,
  userData: User
): Promise<void | null> => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/${role}/register/initiate`,
      userData
    );
    return data;
  } catch (error: any) {
    ToastAndroid.show(error.response?.data.error, ToastAndroid.SHORT);
    return null;
  }
};

export const verifyOTP = async (
  role: string,
  identifier: string,
  otp: string
): Promise<{ user: User; token: string } | null> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/${role}/register/verify`,
      { identifier, otp }
    );
    return { user: response.data.user, token: response.data.token };
  } catch (error: any) {
    ToastAndroid.show(error.response?.data.error, ToastAndroid.SHORT);
    return null;
  }
};

export const loginUser = async (
  role: string,
  identifier: string,
  password: string
) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/auth/${role}/login`,
      { identifier, password }
    );
    return response.data;
  } catch (error: any) {
    ToastAndroid.show(error.response?.data.error, ToastAndroid.SHORT);
    return null;
  }
};

// 4️⃣ Delete a User
const deleteUser = async (role: string, token: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/auth/${role}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
};

// 5️⃣ Get All Farmers
const getAllFarmers = async (): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer`);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
};

// 6️⃣ Get Farmer by ID, Name, Email, or Mobile
const getFarmer = async (parameter: string): Promise<void | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer/${parameter}`);
    return response.data;
  } catch (error: any) {
    ToastAndroid.show(error.response?.data.error, ToastAndroid.SHORT);
    return null;
  }
};

// 7️⃣ Get Farmer Profile
export const getFarmerProfile = async (token: string): Promise<void | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

// 8️⃣ Update Farmer Information
const updateFarmer = async (
  token: string,
  updateData: Partial<User>
): Promise<void> => {
  try {
    const response = await axios.put(`${BASE_URL}/farmer`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
};

// 9️⃣ Add New Crop
const addCrop = async (token: string, cropData: Crop): Promise<void> => {
  try {
    const response = await axios.post(`${BASE_URL}/crops`, cropData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
};

// Example Usage
// (async () => {
//   try {
//     // 1. Register a user (example with farmer role)
//     await registerUser("farmer", {
//       name: "Rohan",
//       mobile: 894383834,
//       email: "something@example.com",
//       password: "admin@123",
//       age: 31,
//       location: "Roorkee",
//     });

//     // 2. Verify OTP
//     await verifyOTP("farmer", "894383834", "16261");

//     // 3. Login and get the token
//     const token = await loginUser("farmer", "89438383439", "admin@123");
//     if (!token) throw new Error("Login failed!");

//     // 4. Get all farmers
//     await getAllFarmers();

//     // 5. Get farmer by ID
//     await getFarmer("8943838343");

//     // 6. Get profile
//     await getFarmerProfile(token);

//     // 7. Update farmer details
//     await updateFarmer(token, {
//       name: "Radhe Shyam",
//       age: 64,
//       location: "Ramnagar",
//     });

//     // 8. Add a crop
//     await addCrop(token, { name: "Genhu", MRP: 100, stock: 400 });

//     // 9. Delete user (optional)
//     // await deleteUser("farmer", token);
//   } catch (error) {
//     console.error("Error in execution:", error);
//   }
// })();
