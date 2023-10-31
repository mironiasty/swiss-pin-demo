import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import LockScreen from "../screens/LockScreen";
import HomeScreen from "../screens/HomeScreen";
import InfoScreen from "../screens/InfoScreen";
import {
  customGetStateFromPath,
  setTopLevelNavigator,
} from "../utils/navigation";
import CustomStackNavigator from "./CustomStackNavigator";

const MainStackNavigator = CustomStackNavigator<MainStackParamList>();
const LockscreenStackNavigator =
  CustomStackNavigator<LockscreenStackParamList>();

export type MainStackParamList = {
  Home: undefined;
  Info: undefined;
  LockscreenModal: undefined;
};

export type LockscreenStackParamList = {
  Lockscreen: undefined;
};

const LockscreenStack = () => {
  return (
    <LockscreenStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
      blockFocusChange
    >
      <LockscreenStackNavigator.Screen
        name={"Lockscreen"}
        component={LockScreen}
      />
    </LockscreenStackNavigator.Navigator>
  );
};

const MainStack = () => {
  return (
    <MainStackNavigator.Navigator initialRouteName="LockscreenModal">
      <MainStackNavigator.Screen name="Home" component={HomeScreen} />
      <MainStackNavigator.Screen name="Info" component={InfoScreen} />
      <MainStackNavigator.Screen
        name={"LockscreenModal"}
        component={LockscreenStack}
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </MainStackNavigator.Navigator>
  );
};

const prefix = Linking.createURL("/");

const linking: LinkingOptions<MainStackParamList> = {
  prefixes: [prefix],
  config: {
    initialRouteName: "LockscreenModal",
    screens: {
      Home: "home",
      Info: "info",
    },
  },
  getStateFromPath: customGetStateFromPath,
};

export default function AppContainer() {
  return (
    <NavigationContainer
      linking={linking}
      ref={(navigatorRef) => setTopLevelNavigator(navigatorRef ?? undefined)}
    >
      {MainStack()}
    </NavigationContainer>
  );
}
