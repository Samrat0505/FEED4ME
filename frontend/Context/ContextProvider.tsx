import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "~/lib/Types";

const AppContext = createContext<any>({});

export default function ContextProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<
    { user: User; token: string } | null | undefined
  >(undefined);
  // const inApp = useSegments();

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");
      setUser(user ? JSON.parse(user) : null);
    })();
  }, []);

  useEffect(() => {
    if (user === undefined) {
      router.replace("/");
    } else if (user === null) {
      router.replace("/MainScreen");
    } else {
      // inApp[0] !== "(root)" &&
      router.replace("/(root)/Dashboard");
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => useContext(AppContext);
