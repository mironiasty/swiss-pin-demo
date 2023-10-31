import {
  CommonActions,
  NavigationContainerRef,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import { getStateFromPath } from "@react-navigation/native";

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

export function storeDeeplink(link: string | undefined) {
  storedDeeplink = link;
}

function handleStoredDeeplink() {
  if (storedDeeplink) {
    Linking.openURL(storedDeeplink);
    storedDeeplink = undefined;
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

export async function storeInitialDeeplink() {
  // be aware that below function won't work with debugger enabled
  const initUrl = await Linking.getInitialURL();
  storeDeeplink(initUrl || undefined);
}

export function customGetStateFromPath(path, options) {
  const state = getStateFromPath(path, options);
  const newState = { ...state };
  if (isColdStart) {
    storeInitialDeeplink();

    if (state && state.routes.length > 1) {
      newState.routes = state.routes.slice(0, 1);
      return newState;
    }
  }

  return state;
}
