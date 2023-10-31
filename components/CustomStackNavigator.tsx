import * as React from "react";
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouterOptions,
  StackNavigationState,
  StackRouter,
  NavigationState,
  RouterConfigOptions,
} from "@react-navigation/native";
import { NativeStackView } from "@react-navigation/native-stack";

function customStackRouter(
  options: StackRouterOptions,
  blockFocusChange?: boolean
) {
  const router = StackRouter(options);
  const superGetStateForAction = router.getStateForAction;

  const getStateForRouteFocus = (
    state: StackNavigationState<{}>,
    key: string
  ) => {
    return blockFocusChange
      ? state
      : { ...router }.getStateForRouteFocus(state, key);
  };
  const getStateForAction = (
    state: NavigationState,
    action: any,
    options: RouterConfigOptions
  ): {} | null => {
    if (action.payload?.bypassFocusChangeBlock) {
      return router.getStateForAction(state, action, options);
    }
    const newState = blockFocusChange
      ? state
      : router.getStateForAction(state, action, options);
    return newState;
  };
  return {
    ...router,
    getStateForRouteFocus,
    getStateForAction,
  };
}

function CustomStackNavigator({
  initialRouteName,
  children,
  screenOptions,
  blockFocusChange,
  ...rest
}) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder(
      (stackOptions) => customStackRouter(stackOptions, blockFocusChange),
      {
        initialRouteName,
        children,
        screenOptions,
      }
    );

  return (
    <NavigationContent>
      <NativeStackView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory(CustomStackNavigator);
