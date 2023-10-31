import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  LockscreenStackParamList,
  dismissLockscreen,
  storeDeeplink,
} from "../utils/navigation";

type Props = NativeStackScreenProps<LockscreenStackParamList, "Lockscreen">;

export default function LockScreen({ navigation }: Props) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      const { source } = e.data.action;
      if (source !== "LockscreenModal") {
        e.preventDefault();
      }
    });
    const eventSubscription = Linking.addEventListener("url", (e) => {
      storeDeeplink(e.url);
    });
    return () => {
      unsubscribe();
      eventSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Click button below to unlock</Text>

      <TouchableOpacity
        style={styles.navigationButton}
        onPress={dismissLockscreen}
      >
        <Text>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationButton: {
    backgroundColor: "white",
    margin: 30,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
