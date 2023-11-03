import type { LinkingOptions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import LockScreen from '../screens/LockScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type {
    LockscreenStackParamList,
    MainStackParamList,
    RootStackParamList,
} from '../utils/navigation';
import {
    customGetStateFromPath,
    setTopLevelNavigator,
} from '../utils/navigation';
import CustomStackNavigator from './CustomStackNavigator';

const RootStackNavigator = CustomStackNavigator<RootStackParamList>();
const MainStackNavigator = createNativeStackNavigator<MainStackParamList>();
const LockscreenStackNavigator =
    CustomStackNavigator<LockscreenStackParamList>();

// Lockscreen is kept on a separate stack to allow for custom navigation state handling without affecting the main stack
const LockscreenStack = () => {
    return (
        <LockscreenStackNavigator.Navigator
            screenOptions={{ headerShown: false }}
            blockFocusChange>
            <LockscreenStackNavigator.Screen
                name="Lockscreen"
                component={LockScreen}
            />
        </LockscreenStackNavigator.Navigator>
    );
};

const MainStack = () => {
    return (
        <MainStackNavigator.Navigator initialRouteName="Home">
            <MainStackNavigator.Screen name="Home" component={HomeScreen} />
            <MainStackNavigator.Screen
                name="Profile"
                component={ProfileScreen}
            />
            <MainStackNavigator.Screen
                name="Settings"
                component={SettingsScreen}
            />
        </MainStackNavigator.Navigator>
    );
};

const RootStack = () => {
    return (
        <RootStackNavigator.Navigator initialRouteName="LockscreenModal">
            <RootStackNavigator.Screen
                name="MainStack"
                component={MainStack}
                options={{ headerShown: false }}
            />
            <RootStackNavigator.Screen
                name="LockscreenModal"
                component={LockscreenStack}
                options={{
                    headerShown: false,
                    animation: 'fade',
                }}
            />
        </RootStackNavigator.Navigator>
    );
};

const prefix = Linking.createURL('/');

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [prefix],
    config: {
        initialRouteName: 'LockscreenModal',
        screens: {
            MainStack: {
                path: '',
                screens: {
                    Home: 'home',
                    Profile: 'profile',
                    Settings: 'settings',
                },
            },
            LockscreenModal: 'lockscreen',
        },
    },
    getStateFromPath: customGetStateFromPath,
};

export default function AppContainer() {
    return (
        <NavigationContainer
            linking={linking}
            ref={navigatorRef =>
                setTopLevelNavigator(navigatorRef ?? undefined)
            }>
            <RootStack />
        </NavigationContainer>
    );
}
