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
