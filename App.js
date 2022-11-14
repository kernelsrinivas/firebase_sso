/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {Alert, Button, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const statusbarHeight = Platform.OS === 'ios' ? 47 : StatusBar.currentHeight;

const App = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState({});

    function onAuthStateChanged(user) {
        user && setUser(user);
        console.log('user', user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        GoogleSignin.configure();
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    async function onGoogleButtonPress() {
        try {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const {idToken} = await GoogleSignin.signIn();
            console.log('idToken', idToken);
            if (idToken) {
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                console.log('googleCredential', googleCredential);
                return auth().signInWithCredential(googleCredential);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function signout () {
      try {
        await auth().signOut();
        setUser({});
      } catch (error){
        console.log(error);
      }
    }

    return (
        <View style={{flex: 1}}>
            <View style={{height: statusbarHeight, backgroundColor: 'blue'}}>
                <StatusBar barStyle={'light-content'} />
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Firebase Auth</Text>
                {(initializing || !user.email) && <Button title="Google Sign-in" onPress={onGoogleButtonPress}></Button>}
                <Text>{user.email ? `you signed with ${user.email} ` : ''}</Text>
                {user.email && (
                    <TouchableOpacity
                        onPress={signout}>
                        <Text style={{color:'blue', marginTop:10}}>Signout</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
