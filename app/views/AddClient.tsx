import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ImageBackground,
    Alert,
    Button,
    SafeAreaView,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { isValid } from 'date-fns';
import {ResponseItem, MarkedDate} from '../../src/types/interfaces';

/**
 * Add client window
 * @returns 
 */
const AddClient = () =>{
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [startdate, setStartDate] = useState(new Date());
    const [enddate, setEndDate] = useState(new Date());
    const [hasOrder, setHasOrder] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [show, setShow] = useState(false);
    const [displayStartDate, setStartDisplayDate] = useState('');
    const [displayEndDate, setEndDisplayDate] = useState('');
    const [error, setError] = useState<Error | null>(null);

    /**
     * POST request to insert client data into dbms
     * @params (email)  string
     * @params (firstName)  string
     * @params (lastName)   string
     * Post framework (fetch)
     */
    const addClient = async() => {
        if(email === '' && firstName === '' && lastName === '')
        {
            Alert.alert('Email, First name, and Last name are required');
        }else {
            try {
                await fetch('http://10.0.2.2:4000/api/addclient', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, firstName,lastName, startdate, enddate, hasOrder }),
                }).then((res) => res.json())
                .then((json) => {
                    if (json.success === true) {
                        Alert.alert(json.message);
                        setIsEnabled(false);
                        clearFields();
                    } else {
                        Alert.alert(json.message);
                    }
                })
                .catch((err) => {
                    console.error('Error   ',err);
                });
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
        }
    };
    /**
     * Populates setHasOrder DropDownPicker
    */
    const [items, setItems] = useState([
        {label: 'Select', value: '0'},
        {label: 'No', value: '1'},
        {label: 'Yes', value: '2'},
    ]);

    /**
     * Navigates to MeetingScheduler component 
     */
    const addMeetingDate = async() => {
        try {
            navigation.navigate('MeetingScheduler',{email, firstName, lastName,})
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
     * Shows and hides start date datetimepicker
     */
    const showStartDatepicker = () => {
        try {
            setShow(true);
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
     * Shows and hides end date datetimepicker
     */
    const showEndDatepicker = () => {
        try {
            setShow(true);
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
     * Handles start date change event
     * @param event 
     * @param selectedDate 
     */
    const onStartChange = (event, selectedDate) => {
        try {
            const currentDate = selectedDate || startdate;

            setShow(false);
            setStartDate(currentDate);

            const formattedDate = currentDate.toLocaleDateString();
            setStartDisplayDate(formattedDate);

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
     * Handles end date change event
     * @param event 
     * @param selectedDate 
     */
    const onEndChange = (event, selectedDate) => {
        try {
            setShow(false);
            setEndDate(selectedDate);

            const formattedDate = selectedDate.toLocaleDateString();
            setEndDisplayDate(formattedDate);
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
     * Handles hasOrder change event
     * @param event 
     * @param selectedDate 
     */
    const handleChangeValue = (value) => {
        try {
            if(value > 0)
            {
                setHasOrder(value);
            }
            else {
                Alert.alert('Please select a valid option. ');
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
     * Performs input field sanitation functionality
     */
    const clearFields = () => {
        setEmail('');
        setFirstName('');
        setLastName('');
        setStartDate(new Date());
        setEndDate(new Date());
        setHasOrder(null);
    };

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <SafeAreaView style={{height: 800}}>
                    <View style={styles.container}>
                        <Text style={styles.heading}>Add Client</Text>

                        <View style={styles.controlView}>
                            <Text style={styles.labels}>Email</Text>
                            <TextInput style={styles.inputs} onChangeText={setEmail} value={email} />

                            <Text style={styles.labels}>First Name</Text>
                            <TextInput style={styles.inputs} onChangeText={setFirstName} value={firstName} />

                            <Text style={styles.labels}>Last Name</Text>
                            <TextInput style={styles.inputs} onChangeText={setLastName} value={lastName} />

                            <Text style={styles.labels}>Start Date</Text>
                            <TextInput
                            style={styles.inputs}
                            placeholder="Select date"
                            value={displayStartDate}
                            // onFocus={showDatepicker}
                            onPressIn={showStartDatepicker}
                            />
                            {show && (
                                <DateTimePicker
                                    value={startdate}
                                    mode="date"
                                    display="default"
                                    onChange={onStartChange}
                                />
                            )}

                            <Text style={styles.labels}>End Date</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Select date"
                                value={displayEndDate}
                                onPressIn={showEndDatepicker}
                            />
                            {show && (
                                <DateTimePicker
                                    value={enddate}
                                    mode="date"
                                    display="default"
                                    onChange={onEndChange}
                                />
                            )}

                            <Text style={styles.labels}>Has Order</Text>
                            <DropDownPicker
                                open={open}
                                value={hasOrder}
                                items={items}
                                setOpen={setOpen}
                                setValue={setHasOrder}
                                setItems={setItems}
                                style={styles.inputs}
                                onChangeValue={handleChangeValue}
                            />

                            <Button onPress={addClient}  disabled={isEnabled} title="Add Client" />
                            <Button onPress={addMeetingDate} title="Add Meeting Date" />
                        </View>
                    </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: '45%',
        paddingTop: '5%',
        height:800,
    },
    controlView:{
        flex: 6,
        width:'100%',
        paddingTop: 40,
        paddingRight:10,
        paddingLeft: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputs:{
        width: '95%',
        marginTop: 15,
        borderWidth: 1,
        height: 45,
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    buttons:{
        color: '#000000',
        paddingTop: 20,
        margin: 10,
        fontSize: 20,
        fontWeight: '900',
        backgroundColor: 'rgba(0, 0, 0,0.1)',
        width: 205,
        height: 80,
        textAlign: 'center',
        borderWidth: 2, // Border width
        borderColor: '#ADD8E6', // Border color
        borderRadius: 10, // Border radius (optional)

    },
    labels:{
        paddingBottom: 5,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    touchStyle1:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: 200,
        height: 100,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '20%',
    },
    checkbox: {
        alignSelf: 'center',
    },
    label: {
        margin: 8,
    },
});


export default AddClient;
