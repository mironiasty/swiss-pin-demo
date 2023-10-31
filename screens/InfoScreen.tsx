import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";
import { MainStackParamList } from "../components/AppContainer";

type Props = NativeStackScreenProps<MainStackParamList, "Info">;

export default function InfoScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Info Screen</Text>
    </View>
  );
}
