import React, { useEffect } from "react";
import LockScreen from "./LockScreen";
import { LockscreenStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  LockscreenStackParamList,
  "LockscreenController"
>;

export default function LockscreenController(props: Props) {
  useEffect(() => {}, []);

  return <LockScreen {...props} />;
}
