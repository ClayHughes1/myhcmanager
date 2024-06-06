import React, {useEffect, useState } from 'react';
import { Text, View , StyleSheet, Button, TouchableWithoutFeedback, ScrollView } from 'react-native';
// import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
    // TextInput,
    // Pressable,
    Alert,
    Keyboard,
    ImageBackground,
    // ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar } from 'react-native-calendars';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RNCalendarEvents, { AuthorizationStatus } from 'react-native-calendar-events';

// Define the state type to include possible values
type PermissionStatus = AuthorizationStatus | null;

const AppointmentScreen = ({route}) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { email } = route.params;
    const [userEmail, setUserEmail] = useState('');
    const [userDesc, setUserDesc] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('2024-05-01');
    const [markedDates, setMarkedDates] = useState({});
    const [dateData, setDateData] = useState([]);
    const [showCalander, setShowCalander] = useState<boolean>(true);
    const [showText, setShowText] = useState<boolean>(false);
    const [appTypeValue, setAppTypeValue] = useState<string>('');
    const [eventTitle, setEventTitle] = useState('Meeting with Liz(Health Coach)');
    const [eventStartDate, setEventStartDate] = useState('');
    // const [eventEndDate, setEventEndDate] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [status, setStatus] = useState<PermissionStatus>(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState<string | undefined>('');
    const [calendars, setCalendars] = useState<Calendar[]>([]);

    useEffect(() => {
        setUserEmail(email);
        const fetchAvailability = async () => {
            try {
                // setMonthOp(1);
                const response = await fetch('http://10.0.2.2:4000/api/getavailability', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then((res) => res.json())
                .then((json) => {
                    const data = json.data;
                    // setListData(data);
                    return data;
                })
                .catch((err) => {
                    console.error('Error   ',err);
                });

                const dates = response.map(item => item.Date);
                // Create an object with the dates as keys and marking them
                if(dates){
                    const marked = {};
                    dates.forEach(dateVal => {
                        marked[dateVal] = { marked: true, dotColor: 'blue' };
                    });
                    setMarkedDates(marked);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchAvailability();

        (async () => {
            const permissionStatus = await RNCalendarEvents.requestPermissions();
            setStatus(permissionStatus);

            if (status === 'authorized') {
                const availableCalendars = await RNCalendarEvents.findCalendars();
                console.log('available \n',availableCalendars);
                console.log('length  \n',availableCalendars.length);

                setCalendars(availableCalendars);

                // Optionally, you can select the first calendar or filter for a specific calendar
                if (availableCalendars.length > 0) {
                    for(let i = 0; i < availableCalendars.length;i++)
                    {
                        if(availableCalendars[i].allowsModifications === true)
                        {
                            setSelectedCalendarId(availableCalendars[i].id.toString()); // Select the first calendar ID
                        }
                    }
                }
            }
        })();
    },[email]);

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
                console.error('Error   ',err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const createAppintment = async(email, date, time, description, id) => {
        if(email === '' )
        {
            Alert.alert('Email, date, and time are required.');
        }else {
            try {
                await fetch('http://10.0.2.2:4000/api/addclientmeeteventdate', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, date, time, description, id}),
                }).then((res) => res.json())
                .then((json) => {
                    clearList();
                    if(json.suceess === true)
                    {
                        fetchAvailabilityByDate(date);
                        setShowCalander(true);
                        setIsEnabled(true);
                        Alert.alert(json.message);
                    }
                    else {
                        Alert.alert(json.message);
                    }
                })
                .catch((err) => {
                    console.error('Error   ',err);
                });
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'An error occurred while trying to log in', error);
            }
        }
    };

    const [meetDesc, setMeetDesc] = useState([
        {label: 'Select', value: '0'},
        {label: 'Check-In', value: '1'},
        {label: 'Initial Evaluation', value: '2'},
        {label: 'Order Prep', value: '3'},
    ]);

    const convertToStandardTime = (militaryTime) => {
        try {
            // Splitting the military time into hours and minutes
            const [hours, minutes] = militaryTime.split(':');

            // Converting hours to a number
            let hour = parseInt(hours, 10);

            // Determining AM or PM
            const period = (hour < 12) ? 'AM' : 'PM';

            // Converting from military time to standard time
            hour = (hour > 12) ? hour - 12 : hour;
            hour = (hour === 0) ? 12 : hour; // Handle midnight

            // Formatting the result
            const standardTime = `${hour}:${minutes} ${period}`;

            return standardTime;

        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const onDayPress = async(day) => {
        try {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1; // Months are zero-based in JavaScript
            let date = today.getDate();

            // Format the date as a string (optional)
            let formattedDate = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;

            if(day.dateString === today || day.dateString > formattedDate)
            {
                console.log('FOLKS WE HAVE A MATCH...................        ');
                setSelectedDate(day.dateString);
                setShowCalander(false);
                setShowText(true);
                setDateData([]);
                fetchAvailabilityByDate(day.dateString);
            }else {
                Alert.alert('Please select a date either today or in the future. ');
            }

        } catch (error) {
            console.error('ERROR    \n',error);
        }
    };

     const setDateAndTime = (item) => {
        if(appTypeValue === ''){
            Alert.alert('Please select an Meeting Type. ');
        }
        else {
            setEventStartDate(`${item.Date}T${item.Time}`);
            const selectedItem = meetDesc.find(item => item.value === appTypeValue);
            createAppintment(userEmail, item.Date, item.Time, selectedItem.label,item.Id);
        }
    };

    const clearList = () => {
        try {
            setDateData([]);
            setShowCalander(true);
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const handleChangeValue = (value) => {
        try {
            setAppTypeValue(value);
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const goHome = () => {
        try {
            navigation.navigate('Home');
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const handleAddEvent = async () => {
        try {
            console.log(appTypeValue);
            if(appTypeValue === ''){
                Alert.alert('Please select an Meeting Type. ');
            }
            const eventStart = new Date(eventStartDate).toISOString();
            const eventEnd = new Date(new Date(eventStart).getTime() + 60 * 60 * 1000).toISOString();

            if (status === 'authorized') {
                const eventId = await RNCalendarEvents.saveEvent(eventTitle, {
                     startDate: eventStart,
                     endDate: eventEnd,
                     notes: 'This appointment is with Liz and involves your ${appTypeValue}.',
                     calendarId: selectedCalendarId,
                 });

                 if (eventId) {
                    Alert.alert('Event added successfully!', `Event ID: ${eventId}`);
                 }
            } else {
                Alert.alert('Permission denied', 'Calendar permission is required to add an event.');
            }
        } catch (error) {
            console.log('Error adding event to calendar:', error);

          console.error('Error adding event to calendar:', error);
          Alert.alert('Error', 'There was an error adding the event to your calendar.');
        }
    };


    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.container}>
                        <Text style={styles.bigBlue}>Add Appointment</Text>
                            <View>
                                <Text style={styles.labels}>Select Meeting Type</Text>
                                <DropDownPicker
                                    open={open}
                                    value={userDesc}
                                    items={meetDesc}
                                    setOpen={setOpen}
                                    setValue={setUserDesc}
                                    setItems={setMeetDesc}
                                    style={styles.selects}
                                    onChangeValue={handleChangeValue}
                                />
                            </View>

                            {showCalander && (
                                <View style={styles.calSection}>
                                    <Calendar
                                        current={selectedDate}
                                        key={selectedDate}
                                        markedDates={markedDates}
                                        markingType={'dot'}
                                        onDayPress={onDayPress}
                                    />
                                </View>
                            )}

                            {showText && (
                                <Text style={styles.pageComm}>Available times for the selected date</Text>
                            )}

                            <FlatList
                                data={dateData}
                                renderItem={({ item }) => (
                                <View style={styles.meetingItem}>
                                    <Text style={styles.detailText}>Date: {item.Date}</Text>
                                    <Text style={styles.detailText}>Time: {convertToStandardTime(item.Time)}</Text>
                                    <TouchableOpacity style={styles.touchStyle2} onPress={() => setDateAndTime(item)}>
                                        <Text style={styles.rmvButton}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <Button onPress={clearList} title="Clear List" />
                            <Button onPress={goHome} title="Done" />


                            {/* <Button onPress={handleAddEvent} disabled={!isEnabled}  title="Add Event to Calendar" /> */}
                            {/* disabled={isEnabled} */}
                    </View>
                    <View style={styles.calendarblock}>
                                <TouchableOpacity style={styles.touchStyle2} onPress={() => handleAddEvent()} >
                                    <Text style={styles.rmvButton}>Add Event to Calendar</Text>
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
        height:50,
        width: '100%',
        fontSize: 20,
        // backgroundColor: 'navyblue',
        textAlign: 'center',
        padding:12,
        marginLeft: 5,
        color: '#fff',
    },
    touchStyle2:{
        backgroundColor: '#2a6592',
        width: '100%',
        height: 60,
        marginLeft: 6,
        marginBottom: 10,
        alignItems: 'center',
    },
    calendarblock:{
        width: '96%',
        height: 60,
        marginLeft: 2,
        marginBottom: 20,
        marginTop: 10,
        alignItems: 'flex-start',
    },
});

export default AppointmentScreen;
