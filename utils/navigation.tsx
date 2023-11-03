import type {
    NavigationContainerRef,
    NavigatorScreenParams,
    PathConfigMap,
} from '@react-navigation/native';
import { CommonActions, getStateFromPath } from '@react-navigation/native';
import * as Linking from 'expo-linking';

let isColdStart = true;
let topLevelNavigator: NavigationContainerRef<{}> | undefined;
let lastNavigateAction: CommonActions.Action | undefined;
let storedDeeplink: string | undefined;

const BACKGROUND_LOCK_TIME = 3_000;

interface Options<ParamList extends {}> {
    screens: PathConfigMap<ParamList>;
    initialRouteName?: string;
}

export type RootStackParamList = {
    MainStack: NavigatorScreenParams<MainStackParamList>;
    LockscreenModal: NavigatorScreenParams<LockscreenStackParamList>;
};
export type MainStackParamList = {
    Home: undefined;
    Profile: undefined;
    Settings: undefined;
};

export type LockscreenStackParamList = {
    Lockscreen: undefined;
};

function handleStoredDeeplink() {
    if (storedDeeplink) {
        Linking.openURL(storedDeeplink);
        storedDeeplink = undefined;
    }
}

export function storeDeeplink(link: string | undefined) {
    storedDeeplink = link;
}

export function setTopLevelNavigator(
    navigator: NavigationContainerRef<{}> | undefined,
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
            name: 'LockscreenModal',
            key: 'LockscreenModal',
        }),
    );
}

export function dismissLockscreen() {
    if (isColdStart) {
        isColdStart = false;
        topLevelNavigator?.dispatch({
            type: 'REPLACE',
            source: 'LockscreenModal',
            payload: {
                name: 'MainStack',
                params: { screen: 'Home' },
                bypassFocusChangeBlock: true,
            },
        });
    } else {
        topLevelNavigator?.dispatch({
            type: 'GO_BACK',
            source: 'LockscreenModal',
            payload: { bypassFocusChangeBlock: true },
        });
    }
    if (storedDeeplink) {
        setTimeout(handleStoredDeeplink, 250);
    }
}

export async function storeInitialDeeplink() {
    // be aware that below function won't work with debugger enabled
    // as deeplinks in expo does not work well with expo debug
    const initUrl = await Linking.getInitialURL();
    storeDeeplink(initUrl || undefined);
}

export function customGetStateFromPath(path: string, options?: Options<{}>) {
    const state = getStateFromPath(path, options);
    if (isColdStart) {
        storeInitialDeeplink();

        if (state?.routes && state.routes.length > 1) {
            const newState = { ...state };
            newState.routes = state.routes.slice(0, 1);
            return newState;
        }
    }

    return state;
}

export function shouldShowLockscreen(backgroundTime: number | null) {
    const time = performance.now();

    return (
        isColdStart ||
        (backgroundTime && time - backgroundTime > BACKGROUND_LOCK_TIME)
    );
}
