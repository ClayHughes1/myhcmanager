import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const  SearchScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [srchString, setSrchString] = useState('');
    // const [password, setPassword] = useState('');
    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Search Clients</Text>

            <Text style={styles.labels}>Enter Username</Text>
            <TextInput style={styles.inputs} onChangeText={setSrchString} value={srchString} />

            <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('ClientResultsScreen')}>
                <Text style={styles.buttons}>Search</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: '45%',
        paddingTop: '5%',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputs:{
        width: '80%',
        marginTop: 15,
        borderWidth: 1,
        height: 45,
        fontSize: 16,
        color: '#000000',
    },
    buttons:{
        padding: 15,
        margin: 5,
        fontSize: 16,
        backgroundColor:'#DDDDDD',
        width: 150,
        height: 50,
        textAlign: 'center',
    },
    labels:{
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    touchStyle:{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
});
export default SearchScreen;
