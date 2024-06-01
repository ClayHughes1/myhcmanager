import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    // TouchableHighlight,
    ImageBackground,
    Alert,
    Button,
    SafeAreaView,
    // ScrollView,
    // Platform ,
} from 'react-native';
// import {ParamListBase, useNavigation} from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddClient = () =>{
    // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [startdate, setStartDate] = useState(new Date());
    const [enddate, setEndDate] = useState(new Date());
    const [hasOrder, setHasOrder] = useState(null);
    const [open, setOpen] = useState(false);
    // const [value, setValue] = useState(null);



    // const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [displayStartDate, setStartDisplayDate] = useState('');
    const [displayEndDate, setEndDisplayDate] = useState('');


    const [items, setItems] = useState([
      {label: 'No', value: '0'},
      {label: 'Yes', value: '1'},
    ]);

    // const [enddate, setEndDate] = useState('');

    // const [password, setPassword] = useState('');

    const addClient = async() => {
        if(email === '' && firstName === '' && lastName === '')
        {
            Alert.alert('Email, First name, and Last name are required');
        }else {
            console.log('email  ',email);
            console.log('first  ',firstName);
            console.log('last  ',lastName);

            try {
                const response = await fetch('http://10.0.2.2:4000/api/addclient', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, firstName,lastName, startdate, enddate, hasOrder }),
                }).catch((err) => {
                    console.log('Error   ',err);
                });
                console.log(response);
                // const data = await response.json();

                // if (data.success) {
                //     Alert.alert('Login Successful', `Welcome ${data.user.name}`);
                // } else {
                //     Alert.alert('Login Failed', data.message);
                // }
            } catch (error) {
                console.error(error);
                console.log(error);
                Alert.alert('Error', 'An error occurred while trying to log in');
            }

        }
    };

    const addMeetingDate = async() => {
        console.log('redirecting to shcduler page  ');
        // navigation.navigate('MeetingScheduler',{email, firstName, lastName,})
    };

    const showStartDatepicker = () => {
        setShow(true);
    };

    const showEndDatepicker = () => {
        setShow(true);
    };

    const onStartChange = (event, selectedDate) => {
        const currentDate = selectedDate || startdate;
        // setShow(Platform.OS === 'android');
        // setShow(Platform.OS === 'ios');
        // setStartDate(currentDate);

        setShow(false);
        setStartDate(currentDate);

        // setStartDate(selectedDate);

        const formattedDate = currentDate.toLocaleDateString();
        setStartDisplayDate(formattedDate);
    };

    const onEndChange = (event, selectedDate) => {
        // const currentDate = selectedDate || enddate;
        // setShow(Platform.OS === 'android');
        setShow(false);
        // setShow(Platform.OS === 'ios');
        setEndDate(selectedDate);

        const formattedDate = selectedDate.toLocaleDateString();
        setEndDisplayDate(formattedDate);
    };

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <SafeAreaView style={{height: 800}}>
                {/* <ScrollView style={{height: 900}}> */}
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


                            {/* <Text style={styles.labels}>Start Date</Text>
                            <TextInput style={styles.inputs} onChangeText={setStartDate} value={startdate} /> */}

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


                            {/* <Text style={styles.labels}>End Date</Text>
                            <TextInput style={styles.inputs} onChangeText={setEndDate} value={enddate} /> */}

                            <Text style={styles.labels}>Has Order</Text>
                            <DropDownPicker
                                open={open}
                                value={hasOrder}
                                items={items}
                                setOpen={setOpen}
                                setValue={setHasOrder}
                                setItems={setItems}
                                style={styles.inputs}
                            />


                            {/* <Text style={styles.labels}>Enter Password</Text>
                            <TextInput style={styles.inputs} onChangeText={setPassword} value={password} secureTextEntry={true} /> */}


                            <Button onPress={addClient} title="Add Client" />
                            <Button onPress={addMeetingDate} title="Add Meeting Date" />

                            {/* <TouchableHighlight style={styles.touchStyle1} onPress={addClient} underlayColor="#000000">
                                <Text style = {styles.buttons}>Add Client</Text>
                            </TouchableHighlight>

                            <TouchableHighlight style={styles.touchStyle1} onPress={addMeetingDate} underlayColor="#000000">
                                <Text style = {styles.buttons}>Add Meeting Date</Text>
                            </TouchableHighlight> */}

                        </View>
                    </View>
                {/* </ScrollView> */}
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
