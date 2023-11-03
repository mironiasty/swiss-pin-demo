import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
} from 'react-native';
import type { LockscreenStackParamList } from '../utils/navigation';
import { dismissLockscreen, storeDeeplink } from '../utils/navigation';

type Props = NativeStackScreenProps<LockscreenStackParamList, 'Lockscreen'>;

export default function LockScreen({ navigation }: Props) {
    useEffect(() => {
        // Prevent navigating back from lockscreen with gesture or hardware back button
        const unsubscribe = navigation.addListener('beforeRemove', e => {
            const { source } = e.data.action;
            if (source !== 'LockscreenModal') {
                e.preventDefault();
            }
        });
        // Navigator will prevent changing to other screens while lockscreen is active, but we want to store deeplink to handle them after unlock
        const eventSubscription = Linking.addEventListener('url', e => {
            storeDeeplink(e.url);
        });
        return () => {
            unsubscribe();
            eventSubscription.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text>Lock Screen</Text>
            <TouchableOpacity
                style={styles.navigationButton}
                onPress={dismissLockscreen}>
                <Text>Click button to unlock</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationButton: {
        backgroundColor: 'white',
        margin: 30,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
