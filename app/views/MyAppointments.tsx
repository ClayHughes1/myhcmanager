import React, {useState, useEffect} from 'react';
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
import {MyAppData} from '../../src/types/interfaces';

const MyAppointments = ({route}) => {
    const { email } = route.params;
    const [appData, setAppData] = useState<MyAppData[]>([]);
    const [open, setOpen] = useState(false);
    let [monthOp, setMonthOp] = useState<string>('');
    const [filteredData, setFilteredData] = useState<MyAppData[]>([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Extract a list of appointments from
     * Use fetch and ajax to query db returnin a list of appointments
     */
    const fetchMyAppts = async () => {
        try {
            if(email !== '' || email !== undefined)
            {
                await fetch('http://10.0.2.2:4000/api/getmyappts', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }).then((res) => res.json())
                .then((json) => {
                    // const data = json.data;
                    setAppData(json.data);
                    setFilteredData(json.data);
                    // return data;
                })
                .catch((err) => {
                    console.error('Error   ',err);
                });
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

    useEffect(() => {
        fetchMyAppts();
    }, [email]);


    /**
     * COnverts military time to UTCDate string
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
     * Event handler for Month DropDownPicker index change
    */
    const handleChange = async () => {
        try {
            let formattedMonthOp = monthOp;
            if (formattedMonthOp && parseInt(formattedMonthOp, 10) < 10) {
                formattedMonthOp = '0' + formattedMonthOp;
            }

            if (!formattedMonthOp || parseInt(formattedMonthOp, 10) < 1) {
                setAppData(filteredData);
            } else {
                const filtered = filteredData.filter(item => item.MeetDate.split('-')[1] === formattedMonthOp);
                if (filtered.length === 0) {
                    Alert.alert('No data found for the selected month.');
                } else {
                    setAppData(filtered);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
                setError(err);
                Alert.alert('Error', err.message);
            } else {
                console.error('Unexpected error', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }
        }
    };

    /**
     * Create list for Month list object
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

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.heading}>My Appointments</Text>
                <View>
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
                            // dropDownContainerStyle={{height:100}}
                            onChangeValue={handleChange}
                            listMode="SCROLLVIEW"
                            placeholder="Select your month"
                    />
                </View> 


                <View style={styles.monthOp}>

                    <FlatList
                        data={appData}
                        renderItem={({ item }) => (
                            <View style={styles.meetingItem}>
                                <Text style={styles.detailText}>Date: {item.MeetDate}</Text>
                                <Text style={styles.detailText}>Time: {convertToStandardTime(item.MeetTime)}</Text>
                                <Text style={styles.detailText}>Description: {item.MeetDescription}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
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
        height:800,
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
export default MyAppointments;
