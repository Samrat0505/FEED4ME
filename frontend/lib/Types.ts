export type User = {
  _id: string;
  age: string;
  email: string | null;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  mobile: string;
  name: string;
  role: role;
  crops: [];
  customers: [];
  inventory: [];
};

// change user type according to role

export type role = "customer" | "farmer" | "storage";

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
  roomId : string;
  name: string;
  lastMessage : string | null;
  participant : string;
}