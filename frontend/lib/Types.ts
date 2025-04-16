export type User = {
  _id: string;
  age: string;
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
  role: role;
  crops: { name: string; MRP: string; stock: string; _id: string }[];
  customers: [];
  inventory: [];
};

export type role = "customer" | "farmer" | "storage" | "ngo";

export type IncomingMessage = {
  _id: string;
  roomId: string;
  senderId: string;
  recieverId: string;
  message: string;
  status: string;
  timestamp?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "other";
};

export type Chat = {
  roomId: string;
  name: string;
  lastMessage: string | null;
  participant: string;
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

export type WasteReport = {
  _id: string;
  __v: number;
  donor_details: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: {
      address: string;
      coordinates: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
  };
  ngo_details: {
    id: string;
    name: string;
  };
  collectionPoint: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  foodType: string;
  quantity: string;
  wasteType: string;
  preparedOn: string; // Date string
  availableOn?: string; // Optional, can be a date range string
  status: string;
  imageUrl?: string;
};

export type PurchaseCrop = {
  _id: string;
  name: string;
  MRP: number;
  stock: number;
  farmerID: string;
};

export type PurchaseHistory = {
  amount: number;
  crop: {
    _id: string;
    name: string;
    MRP: number;
    stock: number;
    farmerID: string;
    __v: number;
  };
  customer: {
    _id: string;
    name: string;
    age: string;
    email: string;
    password: string;
    location: any; // Replace with specific type if known
    __v: number;
  };
};
