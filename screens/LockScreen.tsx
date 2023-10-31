import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LockscreenStackParamList } from "../App";
import { dismissLockscreen } from "../utils/navigation";

type Props = NativeStackScreenProps<LockscreenStackParamList, "Lockscreen">;

export default function LockScreen({ navigation }: Props) {
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
