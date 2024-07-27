import React, { useState } from 'react';
import { Text, View , StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { DateTimePickerAndroid, DateTimePickerEvent  } from '@react-native-community/datetimepicker';
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
    const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');
    const [error, setError] = useState<Error | null>(null);

    /**
     * Function to validate client record exists
     * @param email string
     */
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

    /**
     * Event hanlder for 
     * @param event 
     * @param selDate 
     */
    const onChange = (event: DateTimePickerEvent, selDate?: Date) => {
        try {
            if(selDate)
            {
                const currentDate = selDate || date;
                setDate(currentDate);
            }
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Event handler responsible for the display mode for the datepicker 
     * determined by the device platform
     * @param currentMode 
     */
    const showMode = (currentMode: 'date' | 'time')  => {
        try {
            DateTimePickerAndroid.open({
                value: date,
                onChange,
                mode: currentMode,
                is24Hour: false,
            });
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }      
        } 
    };

    /**
     * Function to declare the DatePicker show mode
    */
    const showDatepicker = () => {
        try {
            showMode('date');
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Function to determine the show mode for the TimePicker
    */
    const showTimepicker = () => {
        try {
            showMode('time');
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Function to validate the email format is in correct format
    */
    const validateEmail = () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userEmail)) {
              setEmailError('Please enter a valid email address.');
            } else {
              setEmailError('');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Event to handle Email text input change event
     * @param email 
    */
    const handleEmailChange = (email: string) => {
        try {
            setUserEmail(email);
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Event handler for Email input onBlur event
    */
    const handleOnBlur = () => {
        try {
            validateEmail();
            isValidClient();
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Handles navigation to Appintment screen 
    */
    const addAppointment = () => {
        try {
            if(userEmail !== ''){
                navigation.navigate('Appointment',{email: userEmail});
            }
            else {
                Alert.alert('Email is required. ');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }  
        }
    };

    /**
     * Handles navigation to MyAppointment component to display list of appointments
    */
    const viewMyAppointments = () => {
        try {
            if(userEmail !== ''){
                navigation.navigate('MyAppointments',{email: userEmail});
            }
            else {
                Alert.alert('Email is required. ');
            }
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
                        <Text style={styles.bigBlue}>Appointment Portal</Text>

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
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.touchStyle} onPress={() => addAppointment()}>
                            <Text style={styles.rmvButton}>Add</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.touchStyle} onPress={() => viewMyAppointments()}>
                            <Text style={styles.rmvButton}>View</Text>
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
        width: 150,
        fontSize: 28,
        fontWeight:'600',
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        textAlign: 'center',
        // padding:5,
        // marginTop: -5,
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
    touchStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        //'#007BFF',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5, // Add some space between buttons
        marginTop: -1000,

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default SchedulerScreen;


