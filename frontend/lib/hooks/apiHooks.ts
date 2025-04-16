import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToastAndroid } from "react-native";
import {
  AddInventoryRequest,
  Chat,
  Crop,
  Donation,
  IncomingMessage,
  Inventory,
  InventoryResponse,
  NGO,
  NGOType,
  role,
  User,
  UserResponse,
} from "../Types";
const BASE_URL = "http://15.206.166.59:3000/api";

const handleError = (error: any, defaultMessage: string): void => {
  const errorMessage = error.response?.data?.error || defaultMessage;
  console.log(error);

  ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
};

export const useRegisterUserMutation = () => {
  return useMutation({
    mutationFn: async ({
      role,
      userData,
    }: {
      role: role;
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
        location: {
          address: string;
          coordinates: {
            type: "Point";
            coordinates: [number, number];
          };
        };
      };
    }) => {
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
        registration_number: userData.mobile,
        website: userData.ngo_website,
      };

      const response = await axios.post(
        `${BASE_URL}/auth/${role}/register/initiate`,
        role === "ngo" ? registerNgo : registerUser
      );

      return response.data;
    },
    onSuccess: (data) => {
      ToastAndroid.show(data.status, ToastAndroid.SHORT);
    },
    onError: (error) => {
      handleError(error, "Failed to register user.");
      return null;
    },
  });
};

export const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: async ({
      role,
      identifier,
      otp,
    }: {
      role: string;
      identifier: string;
      otp: string;
    }) => {
      const response = await axios.post(
        `${BASE_URL}/auth/${role}/register/verify`,
        {
          identifier,
          otp,
        }
      );
      return {
        user: response.data.data,
        token: response.data.token,
        status: response.data.status,
      };
    },
    onSuccess: (data) => {
      ToastAndroid.show(data.status, ToastAndroid.SHORT);
    },
    onError: (error) => {
      handleError(error, "Failed to verify OTP.");
    },
  });
};

export const useLoginUserMutation = () => {
  return useMutation({
    mutationFn: async ({
      role,
      identifier,
      password,
    }: {
      role: role;
      identifier: string;
      password: string;
    }) => {
      const response = await axios.post<{
        data: User;
        token: string;
        status: string;
      }>(`${BASE_URL}/auth/${role}/login`, {
        identifier,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      ToastAndroid.show(data.status, ToastAndroid.SHORT);
    },
    onError: (error) => {
      handleError(error, "Login failed.");
    },
  });
};

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: async ({ role, token }: { role: string; token: string }) => {
      await axios.delete(`${BASE_URL}/auth/${role}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onError: (error) => {
      handleError(error, "Failed to delete user.");
    },
  });
};

export const useAllFarmersQuery = () => {
  return useQuery<User[] | null>({
    queryKey: ["farmers"],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/farmer`);
      return response.data;
    },
    // onError: (error) => {
    //   handleError(error, "Failed to fetch all farmers.");
    // },
  });
};

export const useFarmerQuery = (parameter: string) => {
  return useQuery<User | null>({
    queryKey: ["farmer", parameter],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/farmer/${parameter}`);
      return response.data;
    },
    enabled: !!parameter,
    // onError: (error) => {
    //   handleError(error, "Failed to fetch farmer data.");
    // },
  });
};

export const useFarmerProfileQuery = (token: string) => {
  return useQuery<User | null>({
    queryKey: ["farmerProfile"],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/farmer/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token,
    // onError: (error) => {
    //   handleError(error, "Failed to fetch profile.");
    // },
  });
};

export const useUpdateFarmerMutation = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: Partial<User>) => {
      await axios.put(`${BASE_URL}/farmer`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      ToastAndroid.show("Farmer profile updated", ToastAndroid.SHORT);
      queryClient.invalidateQueries({ queryKey: ["farmerProfile"] });
    },
    onError: (error) => {
      handleError(error, "Failed to update farmer data.");
    },
  });
};

export const useAddInventoryMutation = (token: string, ownerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddInventoryRequest): Promise<Inventory> => {
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
    },
    onSuccess: () => {
      ToastAndroid.show("Inventory added successfully", ToastAndroid.SHORT);
      queryClient.invalidateQueries({ queryKey: ["myInventories", ownerId] });
    },
    onError: (error) => {
      handleError(error, "Failed to add inventory.");
    },
  });
};

export const useMyInventoriesQuery = (token: string, ownerId: string) => {
  return useQuery<Inventory[] | null>({
    queryKey: ["myInventories", ownerId],
    queryFn: async () => {
      const response = await axios.get<InventoryResponse>(
        `${BASE_URL}/inventory?ownerId=${ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data as Inventory[];
    },
    enabled: !!token && !!ownerId,
    // onError: (error) => {
    //   handleError(error, 'Failed to fetch inventories.');
    // },
  });
};

export const useNearbyInventoriesQuery = (
  token: string,
  lat: number | null,
  long: number | null
) => {
  return useQuery<Inventory[] | null>({
    queryKey: ["inventoriesNearby", lat, long],
    queryFn: async () => {
      const response = await axios.get<InventoryResponse>(
        `${BASE_URL}/inventory/nearby?lat=${lat}&lng=${long}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data as Inventory[];
    },
    enabled: !!token && lat !== null && long !== null,
    // onError: (error) => {
    //   handleError(error, 'Failed to fetch nearby inventories.');
    // },
  });
};

export const useInventoryByIdQuery = (id: string, token: string) => {
  return useQuery<Inventory | null>({
    queryKey: ["inventory", id],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!id && !!token,
    // onError: (error) => {
    //   handleError(error, 'Failed to fetch inventory details.');
    // },
  });
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

export const usePurchaseInventoryMutation = (token: string) => {
  return useMutation({
    mutationFn: async ({
      inventoryId,
      quantity,
    }: {
      inventoryId: string;
      quantity: number;
    }): Promise<Inventory[]> => {
      const { data } = await axios.post(
        `${BASE_URL}/inventory/purchase`,
        { inventoryId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastAndroid.show(data.status, ToastAndroid.SHORT);
      return data.invoice;
    },
    onError: (error) => {
      handleError(error, "Failed to purchase inventories.");
    },
  });
};

export const useNgoNearbyListQuery = (longitude: number, latitude: number) => {
  return useQuery<NGO[]>({
    queryKey: ["ngoList", longitude, latitude],
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE_URL}/ngo?longitude=${longitude}&latitude=${latitude}`
      );
      return data.data ?? [];
    },
    enabled: longitude !== null && latitude !== null,
    // onError: (error) => {
    //   handleError(error, "Failed to fetch NGO list.");
    // },
  });
};

export const useSubmitFoodWastageMutation = (token: string) => {
  return useMutation({
    mutationFn: async (foodWastageData: Donation) => {
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

      const response = await axios.post(`${BASE_URL}/ngo/donate`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
    },
    onError: (error) => {
      handleError(error, "Failed to report waste.");
    },
  });
};

export const useAddCropMutation = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cropData: Crop) => {
      const response = await axios.post(
        `${BASE_URL}/crops`,
        {
          name: cropData.name,
          MRP: cropData.MRP,
          stock: cropData.stock,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      ToastAndroid.show(response.data.status, ToastAndroid.SHORT);
    },
    onError: (error) => {
      handleError(error, "Failed to add new crop.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
  });
};

export const useGetWasteReportToNgoQuery = (token: string) => {
  return useQuery({
    queryKey: ["wasteReport", token],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/ngo/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data?.data ?? [];
    },
    enabled: !!token, // Only fetch when token is available
    // onError: (error) => {
    //   handleError(error, "Failed to fetch waste report to NGO.");
    // },
  });
};

export const useGetDailyNewsQuery = () => {
  return useQuery({
    queryKey: ["dailyNews"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/farmer/news`);
      return data?.data ?? [];
    },
    // onError: (error) => {
    //   handleError(error, "Failed to fetch daily news.");
    // },
  });
};

export const usegetMyReportedWaste = (donerId: string) => {
  return useQuery({
    queryKey: ["MyReportedWaste"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE_URL}/donations/list?donorId=${donerId}`
      );
      return data?.data ?? [];
    },
    // onError: (error) => {
    //   handleError(error, "Failed to fetch daily news.");
    // },
  });
};
