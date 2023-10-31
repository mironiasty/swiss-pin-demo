import { AppState } from "react-native";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store, { setBackgroundTime, clearBackgroundTime } from "./utils/store";
import AppContainer from "./components/AppContainer";
import { openLockscreen } from "./utils/navigation";

const BACKGROUND_LOCK_TIME = 500;

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        console.log("ACTIVE");
        const time = Date.now();
        const { backgroundTime } = store.getState();
        if (backgroundTime && time - backgroundTime > BACKGROUND_LOCK_TIME) {
          console.warn("SHOULD SHOW LOCKSCREEN");
          openLockscreen();
        }
        store.dispatch(clearBackgroundTime());
      } else if (nextAppState === "background") {
        console.log("BACKGROUND");
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
