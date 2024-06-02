import React, {useEffect, useState } from 'react';
import { Text, View , StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
// import { MyCalendar } from '../components/MyCalendar.tsx';
// import  { Calendar ,CalendarProvider } from 'react-native-calendars';
// CalendarList
// import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
    TextInput,
    Pressable,
    Alert,
    // ScrollView,
    Keyboard,
    ImageBackground,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar } from 'react-native-calendars';


const SchedulerScreen = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userDesc, setUserDesc] = useState('');
    const [emailError, setEmailError] = useState('');
    const [descError, setDescError] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('2024-05-01');
    const [markedDates, setMarkedDates] = useState({});
    const [dayDate, setDayDate] = useState<any>(null);
    const [dateData, setDateData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dayDate, setDayDate] = useState<any>(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await fetch('http://10.0.2.2:4000/api/getavailability', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ monthOp }),
                }).then((res) => res.json())
                .then((json) => {
                    const data = json.data;
                    // setListData(data);
                    return data;
                })
                .catch((err) => {
                    console.log('Error   ',err);
                });

                const dates = response.map(item => item.Date);
                // Create an object with the dates as keys and marking them
                if(dates){
                    const marked = {};
                    dates.forEach(date => {
                        marked[date] = { marked: true, dotColor: 'blue' };
                    });
                    setMarkedDates(marked);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchAvailability();
    };

    const fetchAvailabilityByDate = async (dayDate) => {
        try {
            await fetch('http://10.0.2.2:4000/api/getavailabilitybydate', {
                method: 'POST',
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dayDate }),
            }).then((res) => res.json())
            .then((json) => {
                const data = json.data;
                if(data !== undefined){
                    setDateData(data);
                    return data;
                }else {
                    Alert.alert('No records were found for this date. ');
                }
            })
            .catch((err) => {
                console.log('Error   ',err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const onChange = (event, selDate) => {
        const currentDate = selDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: currentMode,
          is24Hour: false,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError('Please enter a valid email address.');
        } else {
          setEmailError('');
        }
    };

    const validateDesc = (desc) => {
        if (desc.length < 10) {
          setDescError('Description must be at least 10 characters long.');
        } else {
          setDescError('');
        }
    };

    const handleEmailChange = (email) => {
        setUserEmail(email);
        validateEmail(email);
    };

    const handleDescChange = (desc) => {
        setUserDesc(desc);
        validateDesc(desc);
    };

    const handleSubmit = () => {
        validateEmail(userEmail);
        validateDesc(userDesc);
        if (!emailError && !descError) {
            // Proceed with form submission
            console.log('Form submitted successfully');
            addMeetEvent();
        }
    };

    const addMeetEvent = async() => {
        console.log('adding event............   \n');
        if(userEmail === '' )
        {
            Alert.alert('Email, date, and time are required.');
        }else {
            console.log('email  ',userEmail);

            try {
                const response = await fetch('http://10.0.2.2:4000/api/addclientmeetevent', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userEmail, date, time, userDesc}),
                }).catch((err) => {
                    console.log('Error   ',err);
                });

                const data = await response.json();
                console.log('DATA .............  \n',data);
                if(data.eventId === 0){
                    Alert.alert('There is already a meeting for that date.');
                    setUserEmail('');
                    setUserDesc('');
                    setDate(new Date());
                    setTime(new Date());
                }
                else {
                    if (data.success) {
                        Alert.alert('Meeting successful created');
                    } else {
                        Alert.alert('An error was encountered. Please try again.', data.message);
                    }
                    setUserEmail('');
                    setUserDesc('');
                    setDate(new Date());
                    setTime(new Date());
                }
            } catch (error) {
                console.error(error);
                console.log(error);
                Alert.alert('Error', 'An error occurred while trying to log in');
            }
        }
    };

    const onDateChange = (selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const [meetDesc, setMeetDesc] = useState([
        {label: 'Select', value: '0'},
        {label: 'Check-In', value: '1'},
        {label: 'Initial Evaluation', value: '2'},
        {label: 'Order Prep', value: '3'},

    ]);

    const onDayPress = async(day) => {
        try {
            setDayDate(day.dateString);
            setDateData([]);

            if (loading) {
                return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
            }

            fetchAvailabilityByDate(day.dateString);
        } catch (error) {
            console.log('ERROR    \n',error);
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
                    value={userEmail}
                    placeholder="Enter Email."
                />
                {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

                <Text style={styles.labels}>Select Meeting Type</Text>
                <DropDownPicker
                    open={open}
                    value={userDesc}
                    items={meetDesc}
                    setOpen={setOpen}
                    setValue={setUserDesc}
                    setItems={setMeetDesc}
                    style={styles.selects}
                />

                {/* <TextInput
                    style={styles.inputDesc}
                    onChangeText={handleDescChange}
                    value={userDesc}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Enter brief description for the event."
                /> */}
                {/* {descError ? <Text style={styles.error}>{descError}</Text> : null} */}

            </View>

            <View style={styles.calSection}>
                <Calendar
                    current={selectedDate}
                    key={selectedDate}
                    markedDates={markedDates}
                    markingType={'dot'}
                    onDayPress={onDayPress}
                />
            </View>

            <Text style={styles.pageComm}>Select a date amd time for your meeting.</Text>

            <Button onPress={showDatepicker} title="Date" />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <Button onPress={showTimepicker} title="Time" />
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            <Pressable
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed
                            ? '#005fda'
                            : '#1e90ff',
                    },
                    styles.button,
                ]}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Schedule</Text>
            </Pressable>

            {/* <Button style={styles.submitButton} onPress={handleSubmit} title="Schedule" /> */}

            {/* <Text style={styles.testText}>selected: {date.toLocaleString()}</Text> */}
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
});

export default SchedulerScreen;


