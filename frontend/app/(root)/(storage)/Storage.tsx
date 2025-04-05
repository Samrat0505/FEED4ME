import { View } from "react-native";
import { useGlobalContext } from "~/Context/ContextProvider";
import FarmerView from "~/components/Storage/Farmer/FarmerView";
import StorageManagerView from "~/components/Storage/Storage manager/StorageManagerView";
const Storage = () => {
  const { user } = useGlobalContext();

  if (user.user.role === "storage") return <StorageManagerView />;

  if (user.user.role === "farmer") return <FarmerView />;

  return <View />;
};

export default Storage;
