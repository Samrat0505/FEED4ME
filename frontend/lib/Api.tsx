import axios from "axios";
import { ToastAndroid } from "react-native";
import { role, User, IncomingMessage, Chat, WasteReport } from "./Types";
const BASE_URL = "http://15.206.166.59:3000/api";

const handleError = (error: any, defaultMessage: string): void => {
  const errorMessage = error.response?.data?.error || defaultMessage;
  console.log(error);

  ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
};

export type Inventory = {
  _id: string;
  name: string;
  crop: string;
  description: string;
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

export type UserResponse = {
  name: string;
  mobile: string;
  password: string;
  age: string;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [latitude, longitude]
    };
  };
};
export type NGOType = {
  email: string; // official email of NGO
  password: string;
  contact_person: string; // name of the person in contact
  phone: string; // phone number of the contact person (not NGO)
  name: string; // name of the NGO
  registration_number: string; // official registration number of the NGO
  focus_area: string; // e.g., food, poverty, women empowerment etc.
  establishment: string; // date string in "DD/MM/YYYY" format
  location: {
    address: string;
    coordinates: {
      coordinates: [number, number]; // [latitude, longitude]
    };
  };
  website: string;
};

export type Crop = {
  _id?: string;
  name: string;
  MRP: string;
  stock: string;
};

export type Donation = {
  donor: string;
  ngo: string;
  donorModel: "Farmers" | "Storage";
  wasteType: "human" | "cattle";
  foodType: string;
  quantity: string;
  preparedOn: string;
  availableOn: string;
  // collectionPoint: {
  //   address: string;
  //   coordinates: {
  //     type: "Point";
  //     coordinates: [number, number]; // [latitude, longitude]
  //   };
  // };
  collectionPoint: string;
  image: {
    uri: string;
    name: string;
    type: string;
  } | null;
};

export type AddInventoryRequest = {
  name: string;
  totalQuantity: number;
  price: number;
  description: string;
  crop: string;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [latitude, longitude]
    };
  };
};

export type NewsFeed = {
  _id: string;
  __v: number;
  authorName: string;
  content: string;
  createdAt: string; // ISO timestamp
  imageUrl: string;
  language: string; // e.g., 'en' | 'hi'
  tags: string[]; // e.g., ['training', 'alert']
  title: string;
};

export type InventoryResponse = {
  status: string;
  data: Inventory | Inventory[];
};

export type NGO = {
  _id: string;
  name: string;
  registration_number: string;
  email: string;
  password: string;
  focusAreas: string;
  establishment: string;
  status: string;
  location: {
    coordinates: {
      coordinates: [number, number];
      type: "Point";
    };
    address: string;
  };
  contactPerson: string;
  contactPerson_phone: string;
  website: string;
};

export const registerUser = async (
  role: role,
  userData: {
    name: string;
    email: string;
    contact_person: string;
    contact_person_mobile: string;
    focus_area: string;
    ngo_website: string;
    mobile: string;
    password: string;
    age: string;
    establishment: string;
    ngo_RegNo: string;
    location: {
      address: string;
      coordinates: {
        type: "Point";
        coordinates: [number, number];
      };
    };
  }
): Promise<void | null> => {
  try {
    const registerUser: UserResponse = {
      mobile: userData.mobile,
      name: userData.name,
      password: userData.password,
      age: userData.age,
      location: userData.location,
    };

    const registerNgo: NGOType = {
      name: userData.name,
      contact_person: userData.contact_person,
      phone: userData.contact_person_mobile,
      email: userData.email,
      establishment: userData.establishment,
      focus_area: userData.focus_area,
      location: userData.location,
      password: userData.password,
      website: userData.ngo_website,
      registration_number: userData.ngo_RegNo,
    };

    const response = await axios.post(
      `${BASE_URL}/auth/${role}/register/initiate`,
      role === "ngo" ? registerNgo : registerUser
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

export const addNewInventory = async (
  data: AddInventoryRequest,
  token: string,
  ownerId: string
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
      `${BASE_URL}/inventory?ownerId=${ownerId}`,
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
  token: string,
  ownerId: string
): Promise<Inventory[] | null> => {
  try {
    const response = await axios.get<InventoryResponse>(
      `${BASE_URL}/inventory?ownerId=${ownerId}`,
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

export const getMyMessages = async (roomId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/message/${roomId}`);
    return response.data.data as IncomingMessage[];
  } catch (error) {
    handleError(error, "Failed to fetch messages.");
    return null;
  }
};

export const getChatList = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/message/chats/${userId}`);
    return response.data.data as Chat[];
  } catch (error) {
    handleError(error, "Failed to fetch messages.");
    return null;
  }
};

export const getNgoList = async (
  longitude: number,
  latitude: number
): Promise<NGO[] | []> => {
  const { data } = await axios.get(
    `${BASE_URL}/ngo?longitude=${longitude}&latitude=${latitude}`
  );
  return data.data ? data.data : [];
};

export const submitFoodWastageReport = async (
  token: string,
  foodWastageData: Donation
) => {
  const formdata = new FormData();
  formdata.append("availableOn", foodWastageData.availableOn);
  formdata.append("collectionPoint", foodWastageData.collectionPoint);
  formdata.append("donor", foodWastageData.donor);
  formdata.append("donorModel", foodWastageData.donorModel);
  formdata.append("foodType", foodWastageData.foodType);
  if (foodWastageData.image) {
    formdata.append("image", {
      uri: foodWastageData.image.uri,
      name: foodWastageData.image.name,
      type: foodWastageData.image.type,
    } as any);
  }
  formdata.append("ngo", foodWastageData.ngo);
  formdata.append("preparedOn", foodWastageData.preparedOn);
  formdata.append("quantity", foodWastageData.quantity);
  formdata.append("wasteType", foodWastageData.wasteType);
  console.log(formdata);

  try {
    const response = await axios.post(`${BASE_URL}/ngo/donate`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
  } catch (error) {
    handleError(error, "Failed to Report waste.");
    return null;
  }
};

export const addNewCrop = async (token: string, cropData: Crop) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/crops`,
      { name: cropData.name, MRP: cropData.MRP, stock: cropData.stock },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
  } catch (error) {
    handleError(error, "Failed to add new Crop.");
    console.log(error);

    return null;
  }
};

export const getWasteReportToNgo = async (token: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/ngo/donations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data ? data?.data : [];
  } catch (error) {
    return [];
  }
};

export const getDailyNews = async (): Promise<NewsFeed[] | []> => {
  const { data } = await axios.get(`${BASE_URL}/farmer/news`);
  return data.data ? data.data : [];
};

export const getMyReportedWaste = async (
  donerId: string
): Promise<WasteReport[]> => {
  const { data } = await axios.get(
    `${BASE_URL}/donations/list?donorId=${donerId}`
  );
  return data.data ? data.data : [];
};

export const handleStatusUpdate = async (
  token: string,
  donationId: string,
  selectedStatus: string
) => {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/ngo/update`,
      {
        donationId: donationId,
        status: selectedStatus,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    ToastAndroid.show("Status updated!", ToastAndroid.SHORT);
    return data.status;
  } catch (error) {
    ToastAndroid.show("Failed to update status", ToastAndroid.SHORT);
    return null;
  }
};

export const getCropsForCustomer = async (token: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/crops/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  } catch (error) {
    ToastAndroid.show("Failed to update status", ToastAndroid.SHORT);
    return null;
  }
};

export const purchaseCropsForCustomer = async (
  token: string,
  sellerId: string,
  buyerId: string,
  cropId: string,
  amount: number
) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/customer/crop/buy`,
      {
        sellerId,
        buyerId,
        cropId,
        amount,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    ToastAndroid.show("Sucessfully purchased crop", ToastAndroid.SHORT);
    return data.data;
  } catch (error) {
    ToastAndroid.show("Failed to purchase crop", ToastAndroid.SHORT);
    return null;
  }
};

export const getFarmerCustomers = async (token: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/farmer/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  } catch (error) {
    ToastAndroid.show("Failed to get customers", ToastAndroid.SHORT);
    return null;
  }
};
