import React, { useState } from 'react';
import { Text, View , StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
    TextInput,
    Alert,
    Keyboard,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const SchedulerScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [userEmail, setUserEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>('');
    const [date, setDate] = useState(new Date());


    const isValidClient = async () => {
        try {
            await fetch('http://10.0.2.2:4000/api/isvalidclientemail', {
                method: 'POST',
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }),
            }).then((res) => res.json())
            .then((json) => {
                const data = json.data;
                if(json.success  === true){
                    Alert.alert(json.message);
                    //('This email does not exist as a client. Please contact your health coach to create an account for you.');
                }
                else {
                    Alert.alert(json.message);

                    // Alert.alert('This email does not exist as a client. Please contact your health coach to create an account for you.');
                }
            })
            .catch((err) => {
                console.error('Error   ',err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const onChange = (event, selDate) => {
        try {
            if(selDate)
            {
                const currentDate = selDate;
                setDate(currentDate);
            }
        } catch (error) {
            console.error('Error   ',err);
        }
    };

    const showMode = (currentMode) => {
        try {
            DateTimePickerAndroid.open({
                value: date,
                onChange,
                mode: currentMode,
                is24Hour: false,
            });
        } catch (error) {
            console.error('Error   ',err);
        }
    };

    const showDatepicker = () => {
        try {
            showMode('date');
        } catch (error) {
            console.error('Error   ',err);
        }
    };

    const showTimepicker = () => {
        try {
            showMode('time');
        } catch (error) {
            console.error('Error   ',err);
        }
    };

    const validateEmail = () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userEmail)) {
              setEmailError('Please enter a valid email address.');
            } else {
              setEmailError('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEmailChange = (email) => {
        try {
            setUserEmail(email);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOnBlur = () => {
        try {
            validateEmail();
            isValidClient();
        } catch (error) {
            console.error(error);
        }
    };

    const addAppintment = () => {
        try {
            navigation.navigate('Appointment',{email: userEmail});
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.container}>
                        <Text style={styles.bigBlue}>Add Appointment</Text>

                        <View style={styles.inpView}>
                            <Text style={styles.labels}>Enter Email</Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={handleEmailChange}
                                onBlur={handleOnBlur}
                                value={userEmail}
                                keyboardType="email-address"
                                placeholder="Enter Email."
                            />
                            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.touchStyle2} onPress={() => addAppintment()}>
                            <Text style={styles.rmvButton}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft:10,
        marginRight: 10,
        height:400,
    },
    pageComm: {
        color: 'blue',
        // fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 20,
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
        borderBottomColor: 'lightblue',
        borderBottomWidth: 2,
    },
    labels:{
        paddingBottom: 2,
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputs:{
        width: '80%',
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        height: 45,
        fontSize: 16,
        color: '#000000',
    },
    inputDesc:{
        width: '80%',
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        height: 150,
        fontSize: 16,
        color: '#000000',
        justifyContent: 'flex-start',
        textAlignVertical: 'top',
        padding:10,
    },
    inpView:{
        margin:20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    submitButton:{
        marginTop: 5,
        marginBottom: 5,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
        // justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    testText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    selects:{
        width: '80%',
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        height: 60,
        fontSize: 16,
        color: '#000000',
        marginLeft:2,
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    calSection:{
        flex: 1,
        height: 500,
        marginTop: 50,
        marginBottom: 300,
    },
    meetingItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    detailText:{
        fontSize: 20,
    },
    rmvButton:{
        height:45,
        width: 100,
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        padding:5,
        marginTop: -30,
        marginLeft: 10,
    },
    touchStyle2:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: '80%',
        height: 25,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10,
        marginTop: -10,
        alignItems: 'flex-end',
    },
});

export default SchedulerScreen;


