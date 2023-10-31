import React, { useEffect } from "react";
import { AppState } from "react-native";
import { Provider } from "react-redux";
import AppContainer from "./components/AppContainer";
import { openLockscreen, shouldShowLockscreen } from "./utils/navigation";
import store, { setBackgroundTime, clearBackgroundTime } from "./utils/store";

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        const { backgroundTime } = store.getState();
        if (shouldShowLockscreen(backgroundTime)) {
          openLockscreen();
        }
        store.dispatch(clearBackgroundTime());
      } else if (nextAppState === "background") {
        store.dispatch(setBackgroundTime());
      }
    });
    return subscription.remove;
  }, []);

  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
