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
