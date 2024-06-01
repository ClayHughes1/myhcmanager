import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Alert,
    ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const Login = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [email, setEmail] = useState('');
    const [password, setUserPassword] = useState('');

    const cancelLogin = ()=>{
        // Alert.alert('Login cancelled');
        navigation.navigate('Home');
    };

    // const loginUser = async() =>{
    //     // Alert.alert('loggin in user');

    //     if ( !userName ){
    //         Alert.alert('Please enter a username');
    //     }
    //     else if ( !password ){
    //         Alert.alert('Please enter a password');
    //     }
    //     else {
    //          const value =  await AsyncStorage.getItem('userLoggedIn').catch((err) => {
    //             Alert.alert('Is user logged in');

    //             console.log(err);
    //          });
    //          Alert.alert('value   \n${value}');

    //          if(value !== null)
    //          {
    //             Alert.alert('value is not null');

    //             navigation.navigate('AdminPortal');
    //          }
    //          else {
    //             AsyncStorage.getItem(userName).then((res) =>{
    //                 if(res !== null)
    //                 {
    //                     Alert.alert('user name is not null');

    //                     if(res !== password) {
    //                         Alert.alert('Password incorrect');
    //                     }
    //                     else {
    //                         AsyncStorage.setItem('userLoggedIn',userName).then((_resp) => {
    //                             // if(_resp !== null){
    //                                 Alert.alert(`${userName} Logged in`);
    //                                 navigation.navigate('Home');
    //                             // }
    //                         });
    //                     }
    //                 }
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         }
    //         // Alert.alert('end of else ');

    //     }
    // };

    // const loginUser = ()=>{
    //     if ( !userEmail ){
    //         Alert.alert('Please enter a username');
    //     }
    //     else if ( !userPassword ){
    //         Alert.alert('Please enter a password');
    //     }
    //     else {
    //         AsyncStorage.getItem('userLoggedIn', (err, result) => {
    //             if(err) {
    //                 console.log(err);
    //             }
    //             if (result !== 'none'){
    //                 Alert.alert('Someone already logged on');
    //                 navigation.navigate('Admin');
    //             }
    //             else{
    //                 AsyncStorage.getItem(userEmail, (err, result) => {
    //                     if(err) {
    //                         console.log(err);
    //                     }
    //                     if(result !== null){
    //                         if(result !== userPassword) {
    //                             Alert.alert('Password incorrect')
    //                         }
    //                         else {
    //                             AsyncStorage.setItem('userLoggedIn',userEmail, (err, result) => {
    //                                 if(err) {
    //                                     console.log(err);
    //                                 }
    //                                 Alert.alert(`${userEmail} Logged in`);
    //                                 navigation.navigate('Home');
    //                             });
    //                         }
    //                     }
    //                     else{
    //                         Alert.alert(`No account for ${userEmail}`);
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // };


    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Alert.alert('Error', 'Email and password are required');
                return;
            }
            const response = await fetch('http://10.0.2.2:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                navigation.navigate('Admin');
            } else {
                Alert.alert('Login Failed', data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while trying to log in');
        }
    };

    return (
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>

            <Text style={styles.labels}>Enter Username</Text>
            <TextInput style={styles.inputs} onChangeText={setEmail} value={email} />

            <Text style={styles.labels}>Enter Password</Text>
            <TextInput style={styles.inputs} onChangeText={setUserPassword} value={password} secureTextEntry={true} />

            <TouchableHighlight style={styles.touchBack} onPress={handleLogin} underlayColor="#ADD8E6">
                <Text style = {styles.buttons}>Login</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.touchBack} onPress={cancelLogin} underlayColor="#000000">
                <Text style = {styles.buttons}>Cancel</Text>
            </TouchableHighlight>

        </View>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: '45%',
        paddingTop: '5%',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputs:{
        width: '80%',
        marginTop: 15,
        borderWidth: 1,
        height: 45,
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
    },
    buttons:{
        padding: 15,
        margin: 5,
        fontSize: 24,
        backgroundColor:'lightblue',
        //'#DDDDDD',
        width: 150,
        height: 70,
        textAlign: 'center',
    },
    labels:{
        paddingBottom: 0,
        fontSize: 16,
        fontWeight: 'bold',
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    touchBack:{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginBottom: 15,
        height: 80,
    },
});

export default Login;
