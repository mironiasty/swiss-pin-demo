import type {
    StackRouterOptions,
    RouterConfigOptions,
    StackNavigationState,
    ParamListBase,
    StackActionHelpers,
} from '@react-navigation/native';
import {
    useNavigationBuilder,
    createNavigatorFactory,
    StackRouter,
} from '@react-navigation/native';
import { NativeStackView } from '@react-navigation/native-stack';
import type {
    NativeStackNavigationEventMap,
    NativeStackNavigationOptions,
    NativeStackNavigatorProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';

function customStackRouter(
    options: StackRouterOptions,
    blockFocusChange?: boolean,
) {
    const router = StackRouter(options);
    const superGetStateForAction = router.getStateForAction;

    /* 
        For Lockscreen modal we want to prevent navigation state change for any action that has not originated from unlock event,
        this allows us to freeze the navigation stack without affecting navigation for app after unlocking.

        Any action that is allowed to change navigation state should have bypassFocusChangeBlock property set to true.
    */
    const getStateForAction = (
        state: StackNavigationState<{}>,
        action: any,
        options: RouterConfigOptions,
    ) => {
        if (action.payload?.bypassFocusChangeBlock) {
            return superGetStateForAction(state, action, options);
        }
        const newState = blockFocusChange
            ? state
            : superGetStateForAction(state, action, options);
        return newState;
    };
    return {
        ...router,
        getStateForAction,
    };
}

// Default stack navigator with a custom router
function CustomStackNavigator({
    initialRouteName,
    children,
    screenOptions,
    blockFocusChange,
    ...rest
}: NativeStackNavigatorProps & { blockFocusChange?: boolean }) {
    const { state, descriptors, navigation, NavigationContent } =
        useNavigationBuilder<
            StackNavigationState<ParamListBase>,
            StackRouterOptions,
            StackActionHelpers<ParamListBase>,
            NativeStackNavigationOptions,
            NativeStackNavigationEventMap
        >(stackOptions => customStackRouter(stackOptions, blockFocusChange), {
            initialRouteName,
            children,
            screenOptions,
        });

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
