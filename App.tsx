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
        const time = Date.now();
        const { backgroundTime } = store.getState();
        if (backgroundTime && time - backgroundTime > BACKGROUND_LOCK_TIME) {
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
