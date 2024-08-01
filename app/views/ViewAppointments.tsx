import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ImageBackground,
    Alert,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {AdminAppData} from '../../src/types/interfaces';
import ApiErrorLogger from '../../classlibrary/ApiErrorLog.ts';

const errorLogger = new ApiErrorLogger();

const ViewAppointments = () => {
    const [meetings, setMeetings] = useState({});
    let [monthOp, setMonthOp] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [dateData, setDateData] = useState<AdminAppData[]>([]);
    const [selectedDate, setSelectedDate] = useState('2024-05-01');
    let [formattedMonthOp,setFormattedMonthOp] = useState<string>();
    const [error, setError] = useState<Error | null>(null);

    /**
     * Function to extract meeting data 
     * Uses fetch framework and ajax to call api 
     */
    const fetchMeetings = async () => {
        try {
            if (formattedMonthOp && parseInt(formattedMonthOp, 10) < 10) 
            {
                // Alert.alert('Month criteria met.');

                const response = await fetch('http://10.0.2.2:4000/api/getscheduledata', {
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

                setDateData(response);
            }
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              errorLogger.handleError(err as Error);
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                errorLogger.handleError(err as Error);
                Alert.alert('Error', 'An unexpected error occurred.');
            }      
        } 
    };

    /**
     * Evewnt hanlder for removing meeting data from db
     * Uses fetch and ajax to submit query params to api call
     * @param Id 
     */
    const cancelMeetingOps = async (Id: number) => {
        try {
            if(Id > 0)
            {
                await fetch('http://10.0.2.2:4000/api/deletemeeting', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Id }),
                })
                .then((res) => res.json())
                .then((json) => {
                    // const data = json.Id;
                    if(json.Id)
                    {
                        setDateData([]);
                        fetchMeetings();
                    }
                })
                .catch((err) => {
                    console.error('Error   ',err);
                });
            }
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              errorLogger.handleError(err as Error);
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                errorLogger.handleError(err as Error);
                Alert.alert('Error', 'An unexpected error occurred.');
            }      
        } 
    };

    /**
     * Event handler for month drop down change
     */
    const handleChange = async () => {
        try {
            setFormattedMonthOp(monthOp);
            if (formattedMonthOp && parseInt(formattedMonthOp, 10) < 10) {
                formattedMonthOp = '0' + formattedMonthOp;
            }

            const currentYear = new Date().getFullYear();
            const newDate = `${currentYear}-${formattedMonthOp}-01`;
            setSelectedDate(newDate);
            fetchMeetings();
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              errorLogger.handleError(err as Error);
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                errorLogger.handleError(err as Error);
                Alert.alert('Error', 'An unexpected error occurred.');
            }      
        } 
    };

    /**
     * Converts military time to standard utc date time value
     * @param militaryTime 
     * @returns 
     */
    const  convertToStandardTime = (militaryTime: string) => {
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
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              errorLogger.handleError(err as Error);
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                errorLogger.handleError(err as Error);
                Alert.alert('Error', 'An unexpected error occurred.');
            }      
        } 
    };

    /**
     * Creates list object data for month drop donw picker 
     */
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

    /**
     * Call back method for cancel meeting ops function
     * @param meetId 
     */
    const cancelMeeting = async(meetId: number) => {
        try {
            cancelMeetingOps(meetId);
        }catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
              setError(err);  // Assign the error to the state
              errorLogger.handleError(err as Error);
              Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                errorLogger.handleError(err as Error);
                Alert.alert('Error', 'An unexpected error occurred.');
            }      
        } 
    };

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>View Appointments</Text>

                <View style={styles.monthOp}>
                    <Text style={styles.labels}>Select month to view schedule</Text>
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
                            onChangeValue={handleChange}
                            listMode="SCROLLVIEW"
                            placeholder="Select your month"
                        />
                </View>

                <FlatList
                    data={dateData}
                    renderItem={({ item }) => (
                    <View style={styles.meetingItem}>
                        <Text style={styles.detailText}>Date: {item.MeetDate}</Text>
                        <Text style={styles.detailText}>Time: {convertToStandardTime(item.MeetTime)}</Text>
                        <Text style={styles.detailText}>Description: {item.MeetDescription}</Text>
                        <Text style={styles.detailText}>First Name: {item.First}</Text>
                        <Text style={styles.detailText}>Last Name: {item.Last}</Text>
                        <TouchableOpacity style={styles.touchStyle2} onPress={() => cancelMeeting(item.Id)}>
                            <Text style={styles.rmvButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />

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
        height: 60,
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
        fontSize: 22,
    },
    touchStyle2:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: '80%',
        height: 25,
        marginLeft: 40,
        marginBottom: 10,
        marginRight: 10,
        marginTop: -10,
        alignItems: 'flex-end',
    },
    rmvButton:{
        height:40,
        width: 100,
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        padding:5,
        marginTop: -10,
        marginLeft: 20,
    },
});
export default ViewAppointments;
