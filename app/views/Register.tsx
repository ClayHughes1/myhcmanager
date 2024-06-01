import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const RegisterScreen = () => {
    const navigation = useNavigation();

    const cancelRegister = ()=>{
        Alert.alert('Login cancelled');
        navigation.navigate('Home');
    };

    const createAccount = ()=>{
        navigation.navigate('Register');
    };


    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnfPassword, setcnfPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Register</Text>

            <Text style={styles.labels}>Enter Email</Text>
            <TextInput style={styles.inputs} onChangeText={setUserEmail} value={userEmail} />

            <Text style={styles.labels}>Enter Password</Text>
            <TextInput style={styles.inputs} onChangeText={setPassword} value={password} secureTextEntry={true} />

            <Text style={styles.labels}>Enter Password</Text>
            <TextInput style={styles.inputs} onChangeText={setcnfPassword} value={cnfPassword} secureTextEntry={true} />


            <TouchableHighlight onPress={cancelRegister} underlayColor="#000000">
                <Text style = {styles.buttons}>Cancel</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={createAccount} underlayColor="#000000">
                <Text style = {styles.buttons}>Create Account</Text>
            </TouchableHighlight>

        </View>
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
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputs:{
        width: '80%',
        marginTop: 15,
        borderWidth: 1,
        height: 45,
        fontSize: 16,
        color: '#000000',
    },
    buttons:{
        padding: 15,
        margin: 5,
        fontSize: 16,
        backgroundColor:'#DDDDDD',
        width: 150,
        height: 50,
        textAlign: 'center',
    },
    labels:{
        marginTop: 10,
        padding: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
