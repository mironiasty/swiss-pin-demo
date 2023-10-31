import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import * as Linking from "expo-linking";

let isColdStart = true;
let topLevelNavigator: NavigationContainerRef<{}> | undefined;
let lastNavigateAction: CommonActions.Action | undefined;
let storedDeeplink: string | undefined;

export function setTopLevelNavigator(
  navigator: NavigationContainerRef<{}> | undefined
) {
  topLevelNavigator = navigator;
  if (topLevelNavigator && lastNavigateAction) {
    topLevelNavigator.dispatch(lastNavigateAction);
    lastNavigateAction = undefined;
  }
}

export function storeDeeplink(link: string) {
  storedDeeplink = link;
}

function handleStoredDeeplink() {
  Linking.openURL(storedDeeplink);
  storedDeeplink = undefined;
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
  if (isColdStart) {
    isColdStart = false;
    topLevelNavigator?.dispatch({
      type: "REPLACE",
      source: "LockscreenModal",
      payload: { name: "Home", params: {}, bypassFocusChangeBlock: true },
    });
  } else {
    topLevelNavigator?.dispatch({
      type: "GO_BACK",
      source: "LockscreenModal",
      payload: { bypassFocusChangeBlock: true },
    });
  }
  if (storedDeeplink) {
    setTimeout(handleStoredDeeplink, 250);
  }
}
