import React from 'react';
//, { useState }
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

//https://github.com/ClayHughes1/myhcmanager.git
const AdminPortalScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.heading}>Admin Portal</Text>

                <View style={styles.optGrp}>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('AddClient')}>
                        <Text style={styles.buttons}>Add Client</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('Clients')}>
                        <Text style={styles.buttons}>Client List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('MeetingScheduler')}>
                        <Text style={styles.buttons}>Add Appointment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('ViewAppointments')}>
                        <Text style={styles.buttons}>View Appointments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('AddAvailability')}>
                        <Text style={styles.buttons}>Availability</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttons}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    optGrp: {
        marginTop: 10,
        padding:0,
    },
    heading: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 100,
    },
    appName:{
        marginTop: -200,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 34,
        fontWeight: '800',
        padding:10,
    },
    greetText: {
        padding: 10, // Padding around the text
        marginTop: 15,
        marginBottom: 200,
        fontSize: 24,
        fontWeight: '800',
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
    optionsSection:{
        textAlign: 'center',
        marginBottom: 20,
    },
    touchStyle1:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: 200,
        height: 100,
        margin: 10,
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
});
export default AdminPortalScreen;
