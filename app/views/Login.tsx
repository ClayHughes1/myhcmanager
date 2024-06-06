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
            }).then((res) => res.json())
            .then((json) => {
                // const data =  json;
                if (json.success) {
                    navigation.navigate('Admin');
                } else {
                    Alert.alert('Login Failed', json.message);
                }
            }).catch((err) => {
                console.error('Error   ',err);
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while trying to log in');
        }
    };

    const cancelLogin = ()=>{
        navigation.navigate('Home');
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
