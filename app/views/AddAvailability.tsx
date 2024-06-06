import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
    Alert,
    FlatList,
    Button,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';


const AddAvailability = () => {
    // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    // const [meetings, setMeetings] = useState({});
    let [monthOp, setMonthOp] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const [dateData, setDateData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('2024-05-01');
    const [isVisible, setIsVisible] = useState(false);
    const [addDate, setAddDate] = useState('');
    let [hours, setHours] = useState('');
    let [minutes, setMinutes] = useState('');
    const [isAm, setIsAm] = useState('AM');
    const [isDisabled, setIsDisabled] = useState(true); // Example condition
    const [dayDate, setDayDate] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchAvailability = async () => {
        try {
            if(monthOp > 0)
            {
                const response = await fetch('http://10.0.2.2:4000/api/getavailabilitybymonth', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ monthOp }),
                }).then((res) => res.json())
                .then((json) => {
                    const data = json.data;
                    return data;
                })
                .catch((err) => {
                    console.error('Error   ',err);
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
            }
        } catch (error) {
            console.error(error);
        }
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
                console.error('Error   ',err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const removeDateOps = async (Id) => {
        try {
            if(Id > 0)
            {
                await fetch('http://10.0.2.2:4000/api/deleteavailability', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Id }),
                })
                .then((res) => res.json())
                .then((json) => {
                    if(json.Id)
                    {
                        setDateData([]);
                        fetchAvailability();
                    }
                })
                .catch((err) => {
                    console.error('Error   ',err);
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const insertAvailability = async (date, time) => {
        try {
            await fetch('http://10.0.2.2:4000/api/addavailability', {
                method: 'POST',
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date,time }),
            })
            .then((res) => res.json())
            .then((json) => {
                if(json.Id)
                {
                    setDateData([]);
                    fetchAvailability();
                    setIsVisible(false);
                    setAddDate('');
                    setHours('');
                    setMinutes('');
                }
            })
            .catch((err) => {
                console.error('Error   ',err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handlChange = async () => {
        try {

            if(monthOp < 10)
            {
                monthOp = '0' + monthOp;
            }

            const currentYear = new Date().getFullYear();
            const newDate = `${currentYear}-${monthOp}-01`;
            setSelectedDate(newDate);
            setDateData([]);
            fetchAvailability();
        } catch (error) {
            console.error(error);
            Alert.alert('Something has changed.' + error);
        }
    };

    const onDayPress = async(day) => {
        try {
            setDayDate(day.dateString);
            setDateData([]);

            if (loading) {
                return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
            }

            fetchAvailabilityByDate(day.dateString);
        } catch (error) {
            console.error('ERROR    \n',error);
        }
    };

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

    const clearList = () => {
        try {
            setDateData([]);
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const removeDate = (dateId) => {
        try {
            removeDateOps(dateId);
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const addDateTime = () => {
        try {
            if(addDate === '')
            {
                Alert.alert('No daate has been selected, please select a date fomr the calander.');
                setIsVisible(false);
                return;
            }else {
                setIsVisible(!isVisible);
            }
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const commitNewAvailabiity = () => {
        try {
            if (validateTime(hours, minutes)) {
                // Adjust hours based on the modifier
                let hour = parseInt(hours, 10);
                let isAmInt = parseInt(isAm, 10);
                if(isAmInt === 0){
                    Alert.alert('Please select either AM or PM to confirm time of day.');
                }
                else {
                    if (isAmInt === 2) {
                        hour += 12;
                    } else if (isAmInt === 1) {
                        hour = hour;
                    }
                }

                let newTime = `${hour}:${minutes}`;
                insertAvailability(addDate, newTime);
            } else {
                Alert.alert('Invalid Time', 'Please enter a valid time.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Function to validate the time input
    const validateTime = (hours, minutes) => {
        try {
            const hoursNum = parseInt(hours, 10);
            const minutesNum = parseInt(minutes, 10);

            if (
                isNaN(hoursNum) || isNaN(minutesNum) ||
                hoursNum < 0 || hoursNum > 23 ||
                minutesNum < 0 || minutesNum > 59
            ) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    const [timeOfDay, setTimeOfDay] = useState([
        {label: 'Select', value: '0'},
        {label: 'AM', value: '1'},
        {label: 'PM', value: '2'},
    ]);

    const [items, setItems] = useState([
        { label: 'Select', value: '0' },
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ]);

    const enableButton = () => {
        try {
            let isAmInt = parseInt(isAm, 10);
            if(isAmInt === 0){
                Alert.alert('Please select either AM or PM to confirm time of day.');
            }else {
                setIsDisabled(false);
            }
        } catch (error) {
            console.error('An error occurred  ',error);
        }
    };

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>My Availability</Text>

            <View style={styles.monthOp}>
                <Text style={styles.labels}>Select month to add availability</Text>
                    <DropDownPicker
                        open={open}
                        value={monthOp}
                        items={items}
                        setOpen={setOpen}
                        setValue={setMonthOp}
                        setItems={setItems}
                        zIndex={3000}
                        zIndexInverse={1000}
                        dropDownContainerStyle={{height:300}}
                        onChangeValue={handlChange}
                        listMode="SCROLLVIEW"
                        placeholder="Select your month"
                    />
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

                <FlatList
                    data={dateData}
                    renderItem={({ item }) => (
                    <View style={styles.meetingItem}>
                        <Text style={styles.detailText}>Date: {item.Date}</Text>
                        <Text style={styles.detailText}>Time: {convertToStandardTime(item.Time)}</Text>
                        <TouchableOpacity style={styles.touchStyle2} onPress={() => removeDate(item.Id)}>
                            <Text style={styles.rmvButton}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />

                {isVisible && (
                    <View style={styles.box}>
                        <Text style={styles.labels}>Date To Add</Text>
                        <Text style={{marginBottom: 10,fontSize: 25,fontWeight: 'bold'}}>{addDate}</Text>

                        <Text style={styles.labels}>Enter Hour</Text>
                        <TextInput
                            style={styles.inputs}
                            onChangeText={setHours}
                            value={hours}
                            keyboardType="numeric"
                            maxLength={2}
                            placeholder="HH"
                        />

                        <Text style={styles.labels}>Enter Minute</Text>
                        <TextInput
                            style={styles.inputs}
                            onChangeText={setMinutes}
                            value={minutes}
                            keyboardType="numeric"
                            maxLength={2}
                            placeholder="MM"
                        />

                        <Text style={styles.labels}>Time Of Day</Text>
                        <DropDownPicker
                            open={open}
                            value={isAm}
                            items={timeOfDay}
                            setOpen={setOpen}
                            setValue={setIsAm}
                            setItems={setTimeOfDay}
                            style={styles.selects}
                            onChangeValue = {enableButton}
                        />

                        <TouchableOpacity
                                style={styles.button}
                                onPress={() => commitNewAvailabiity()}
                                disabled={isDisabled}>
                            <Text style={[styles.buttons, isDisabled ? styles.buttonDisabled : styles.buttonEnabled ]}>Add</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Button onPress={addDateTime} title="Add Date/Time" />
                <Button onPress={clearList} title="Clear List" />
            </SafeAreaView>
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
    labels:{
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputs:{
        width: '80%',
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        height: 60,
        fontSize: 16,
        color: '#000000',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    monthOp: {
        height:60,
        marginBottom: 30,
        marginTop:20,
    },
    calSection:{
        flex: 1,
        height: 400,
        marginTop: 50,
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
    buttons:{
        height:50,
        width: 80,
        fontSize: 25,
        backgroundColor: 'lightblue',
        textAlign: 'center',
        padding:5,
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
    touchStyle1:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: '80%',
        height: 30,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10,
        marginTop: 10,
        alignItems: 'flex-end',
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
    box: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selects:{
        width: '50%',
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        height: 60,
        fontSize: 16,
        color: '#000000',
        marginLeft:40,
    },
    buttonEnabled: {
        color: 'black',
        margin: 10,
        marginLeft: '60%',
        alignItems: 'flex-end',
        height:50,
        width: 80,
        fontSize: 25,
        textAlign: 'center',
    },
    buttonDisabled: {
        color: 'grey',
        marginLeft: '60%',
        alignItems: 'flex-end',
        height:50,
        width: 80,
        fontSize: 25,
        textAlign: 'center',
    },
});

export default AddAvailability;

