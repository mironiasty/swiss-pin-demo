import React, { useEffect } from "react";
import LockScreen from "./LockScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Linking } from "react-native";
import { storeDeeplink } from "../utils/navigation";
import { LockscreenStackParamList } from "../components/AppContainer";

type Props = NativeStackScreenProps<LockscreenStackParamList, "Lockscreen">;

export default function LockscreenController(props: Props) {
  useEffect(() => {
    const eventSubscription = Linking.addEventListener("url", (e) => {
      storeDeeplink(e.url);
    });

    return eventSubscription.remove;
  }, []);

  return <LockScreen {...props} />;
}
