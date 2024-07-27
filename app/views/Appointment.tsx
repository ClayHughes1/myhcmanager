import React, {useEffect, useState,useCallback  } from 'react';
import { Text, View , StyleSheet, Button, TouchableWithoutFeedback, ScrollView } from 'react-native';
import {
    Alert,
    Keyboard,
    ImageBackground,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar } from 'react-native-calendars';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RNCalendarEvents, { AuthorizationStatus } from 'react-native-calendar-events';
import { RouteProp } from '@react-navigation/native';


const AppointmentScreen = ({route}) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { email } = route.params;
    const [userEmail, setUserEmail] = useState(email);
    const [userDesc, setUserDesc] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('2024-05-01');
    const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
    const [dateData, setDateData] = useState<ResponseItem[]>([]);
    const [showCalendar, setShowCalendar] = useState<boolean>(true);
    const [showText, setShowText] = useState<boolean>(false);
    const [appTypeValue, setAppTypeValue] = useState<string>('');
    const [eventTitle, setEventTitle] = useState('Meeting with Liz(Health Coach)');
    const [eventStartDate, setEventStartDate] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [status, setStatus] = useState<PermissionStatus>(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState<string | undefined>('');
    const [calendars, setCalendars] = useState<any[]>([]); // Adjust based on actual type from 'react-native-calendar-events'
    const [showCalander, setShowCalander] = useState<boolean>(true);

    const fetchAvailability = useCallback(async () => {
        try {
          const response = await fetch('http://10.0.2.2:4000/api/getavailability', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }).then(res => res.json());
    
          const data = response.data;
          const dates = data.map((item: ResponseItem) => item.Date);
          if (dates) {
            const marked = dates.reduce((acc: Record<string, MarkedDate>, dateVal: string) => {
              acc[dateVal] = { marked: true, dotColor: 'blue' };
              return acc;
            }, {});
            setMarkedDates(marked);
          }
        } catch (error) {
          console.error('Error fetching availability', error);
        }
      }, []);
    
      const requestPermissions = useCallback(async () => {
        const permissionStatus = await RNCalendarEvents.requestPermissions();
        setStatus(permissionStatus);
    
        if (permissionStatus === 'authorized') {
          const availableCalendars = await RNCalendarEvents.findCalendars();
          setCalendars(availableCalendars);
    
          const modifiableCalendar = availableCalendars.find(cal => cal.allowsModifications);
          if (modifiableCalendar) {
            setSelectedCalendarId(modifiableCalendar.id.toString());
          }
        }
      }, [status]);
    
      useEffect(() => {
        fetchAvailability();
        requestPermissions();
      }, [email, fetchAvailability, requestPermissions]);

    interface ResponseItem {
        Date: string; // Use the appropriate type (e.g., Date if it's a Date object)
        Time: Date
        // Add other properties if needed
    }

    interface MarkedDate {
        marked: boolean;
        dotColor: string;
    }

    const fetchAvailabilityByDate = async (dayDate: Date) => {
        try {
          const response = await fetch('http://10.0.2.2:4000/api/getavailabilitybydate', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dayDate }),
          }).then(res => res.json());
    
          const data = response.data;
          if (data) {
            setDateData(data);
          } else {
            Alert.alert('No records were found for this date.');
          }
        } catch (error) {
          console.error('Error fetching availability by date', error);
        }
      };

    /**
     * Performs functionality to insert appointment data using fetch and ajax POST request
     * @param email 
     * @param date 
     * @param time 
     * @param description 
     * @param id 
     */
    const createAppintment = async(email: string, date: Date, time: string, description: string, id: number) => {
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
                Alert.alert('Error', 'An error occurred while trying to create this appointment');
            }
        }
    };

    /**
     * Populates meet description dropdownpicker
     */
    const [meetDesc, setMeetDesc] = useState([
        {label: 'Select', value: '0'},
        {label: 'Check-In', value: '1'},
        {label: 'Initial Evaluation', value: '2'},
        {label: 'Order Prep', value: '3'},
    ]);

    /**
     * Converts military time to standard time for display purposes
     * @param militaryTime 
     * @returns 
     */
    const convertToStandardTime = (militaryTime: string) => {
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

    /**
     * Hanldes day press event and calls this function fetchAvailabilityByDate
     * @param day 
     */
    const onDayPress = async(day: any) => {
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

    /**
     * Validates meet type has been selected
     * If appointment type has been selcted it creates the appointment
     * @param item 
     */
     const setDateAndTime = (item: any) => {
        if(appTypeValue === ''){
            Alert.alert('Please select an Meeting Type. ');
        }
        else {
            setEventStartDate(`${item.Date}T${item.Time}`);
            const selectedItem = meetDesc.find(item => item.value === appTypeValue);
            createAppintment(userEmail, item.Date, item.Time, selectedItem.label,item.Id);
        }
    };

    /**
     * Function to clear the date data from the Date object
     * and show the calendar object following user selecting a data for appointment
     */
    const clearList = () => {
        try {
            setDateData([]);
            setShowCalander(true);
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    /**
     * Handles App Type value change
     * @param value 
     */
    const handleChangeValue = (value: any) => {
        try {
            setAppTypeValue(value);
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    /**
     * Navigates to the Home component
     */
    const goHome = () => {
        try {
            navigation.navigate('Home');
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    /**
     * Hanldes Add Event event
     * Calls RNCalendarEvents.saveEvent
     */
    const handleAddEvent = async () => {
        try {
            if(appTypeValue === ''){
                Alert.alert('Please select an Meeting Type. ');
            }
            const eventStart = new Date(eventStartDate).toISOString();
            const eventEnd = new Date(new Date(eventStart).getTime() + 60 * 60 * 1000).toISOString();

            if (status === 'authorized') {
                const eventId = await RNCalendarEvents.saveEvent(eventTitle, {
                     startDate: eventStart,
                     endDate: eventEnd,
                     notes: 'This appointment is with ${username} and involves your ${appTypeValue}.',
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
                                    <Text style={styles.detailText}>Time: {convertToStandardTime(item.Time.toLocaleTimeString())}</Text>
                                    <TouchableOpacity style={styles.touchStyle2} onPress={() => setDateAndTime(item)}>
                                        <Text style={styles.rmvButton}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <Button onPress={clearList} title="Clear List" />
                            <Button onPress={goHome} title="Done" />
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
