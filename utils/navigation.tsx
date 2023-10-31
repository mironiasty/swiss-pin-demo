import {
  CommonActions,
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import * as Linking from "expo-linking";

let topLevelNavigator: NavigationContainerRef | undefined;
let lastNavigateAction: CommonActions.Action | undefined;

export function setTopLevelNavigator(
  navigator: NavigationContainerRef | undefined
) {
  topLevelNavigator = navigator;
  if (topLevelNavigator && lastNavigateAction) {
    topLevelNavigator.dispatch(lastNavigateAction);
    lastNavigateAction = undefined;
  }
}

export function openLockscreen() {
  topLevelNavigator?.dispatch(
    CommonActions.navigate({
      name: "LockscreenModal",
      key: "LockscreenModal",
    })
  );
}

export function dismissLockscreen() {
  console.warn("dismissLockscreen");
  //   topLevelNavigator?.goBack();
  topLevelNavigator?.dispatch({
    type: "GO_BACK",
    source: "LockscreenModal",
    //   target: "MainStack",
  });
}
