import axios from "axios";
import { ToastAndroid } from "react-native";
import { role, User, IncomingMessage, Chat } from "./Types";
// const BASE_URL = "https://feed4me-server.onrender.com/api";
const BASE_URL = "http://15.206.166.59:3000/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error: any, defaultMessage: string): void => {
  const errorMessage = error.response?.data?.error || defaultMessage;
  ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
};

export type Inventory = {
  _id: string;
  name: string;
  crop: string;
  totalQuantity: number;
  reservedQuantity: number;
  pricePerUnit: number;
  owner: string;
  takenBy: { farmer: string; quantity: number; _id: string }[];
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  };
};

export type AddInventoryRequest = {
  name: string;
  totalQuantity: number;
  price: number;
  crop: string;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [latitude, longitude]
    };
  };
};

type InventoryResponse = {
  status: string;
  data: Inventory | Inventory[];
};

interface Crop {
  name: string;
  MRP: number;
  stock: number;
}



// 🔹 User Authentication Functions
export const registerUser = async (
  role: string,
  userData: {
    age: string;
    password: string;
    email: string | null;
    location: {
      address: string;
      coordinates: {
        type: "Point";
        coordinates: [number, number];
      };
    };
    mobile: string;
    name: string;
  }
): Promise<void | null> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/${role}/register/initiate`,
      userData
    );
    ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to register user.");
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
    console.log(response.data);

    ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
    return { user: response.data.data, token: response.data.token };
  } catch (error) {
    handleError(error, "Failed to verify OTP.");
    return null;
  }
};

export const loginUser = async (
  role: role,
  identifier: string,
  password: string
): Promise<{ data: User; token: string; status: string } | null> => {
  try {
    const response = await axios.post<{
      data: User;
      token: string;
      status: string;
    }>(`${BASE_URL}/auth/${role}/login`, { identifier, password });
    ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
    return response.data;
  } catch (error) {
    handleError(error, "Login failed.");
    return null;
  }
};

export const deleteUser = async (
  role: string,
  token: string
): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/auth/${role}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Failed to delete user.");
  }
};

// 🔹 Farmer Management Functions
export const getAllFarmers = async (): Promise<User[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch all farmers.");
    return null;
  }
};

export const getFarmer = async (parameter: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer/${parameter}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch farmer data.");
    return null;
  }
};

export const getFarmerProfile = async (token: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    handleError(error, "Failed to fetch profile.");
    return null;
  }
};

export const updateFarmer = async (
  token: string,
  updateData: Partial<User>
): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/farmer`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Failed to update farmer data.");
  }
};

// 🔹 Crop Management Functions
export const addCrop = async (token: string, cropData: Crop): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/crops`, cropData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Failed to add new crop.");
  }
};

// 🔹 Inventory Management Functions

export const addNewInventory = async (
  data: AddInventoryRequest,
  token: string
): Promise<Inventory | null> => {
  try {
    const formattedData = {
      ...data,
      location: {
        address: data.location.address,
        coordinates: {
          type: "Point",
          coordinates: [
            data.location.coordinates.coordinates[0], // Latitude
            data.location.coordinates.coordinates[1], // Longitude
          ],
        },
      },
    };

    const response = await axios.post<InventoryResponse>(
      `${BASE_URL}/inventory`,
      formattedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.data as Inventory;
  } catch (error) {
    handleError(error, "Failed to add inventory.");
    return null;
  }
};

export const getMyInventories = async (
  token: string
): Promise<Inventory[] | null> => {
  try {
    const response = await axios.get<InventoryResponse>(
      `${BASE_URL}/inventory`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data as Inventory[];
  } catch (error) {
    handleError(error, "Failed to fetch inventories.");
    return null;
  }
};

export const getInventoriesNearby = async (
  token: string,
  lat: number | null,
  long: number | null
): Promise<Inventory[] | null> => {
  try {
    const response = await axios.get<InventoryResponse>(
      `${BASE_URL}/inventory/nearby?lat=${lat}&lng=${long}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data as Inventory[];
  } catch (error) {
    handleError(error, "Failed to fetch nearby inventories.");
    return null;
  }
};
export const getStorageDetailsByID = async (
  id: string,
  token: string
): Promise<Inventory | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/inventory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data as Inventory;
  } catch (error) {
    handleError(error, "Failed to fetch nearby inventories.");
    return null;
  }
};

export const purchaseInventory = async (
  token: string,
  inventoryId: string,
  quantity: number
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/inventory/purchase`,
      {
        inventoryId: inventoryId,
        quantity: quantity,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
    return response.data.invoice as Inventory[];
  } catch (error) {
    handleError(error, "Failed to purchase inventories.");
    return null;
  }
};

// 🔹 Chat Management Functions

export const getMyMessages = async (
  roomId: string
) => {
  try{
    const response = await axios.get(`${BASE_URL}/message/${roomId}`);
    return response.data.data as IncomingMessage[];
  }catch (error){
    handleError(error, "Failed to fetch messages.");
    return null;
  }
}

export const getChatList = async (
  userId : string
) => {
  try{
    const response = await axios.get(`${BASE_URL}/message/chats/${userId}`)
    return response.data.data as Chat[];
  }catch(error){
    handleError(error, "Failed to fetch messages.");
    return null;
  }
}