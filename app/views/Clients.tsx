import React,{useEffect,useState} from 'react';
//, { useState }
// import { Col, Row, Grid } from 'react-native-easy-grid';
import {
    SafeAreaView,
    // ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    FlatList,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// add notes for client support notes


const ClientResultsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [clientId, setClientId] = useState('');

    // const getClients = async() => {
    // }

    useEffect(() => {
        fetch('http://10.0.2.2:4000/api/data')
            .then((response) => response.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const getClientDetail = async(item) => {
        console.log('GETTING CLIENT DETAIL.....................',item.Id);
        navigation.navigate('ClientDetail',{ClientId: item.Id});
    };

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.heading}>My Client List</Text>
                <SafeAreaView style={styles.container}>
                    {/* <View style={styles.tableHeader}>
                        <Text style={styles.itemEmailCell}>Email</Text>
                        <Text style={styles.itemCell}>First</Text>
                        <Text style={styles.itemCell}>Last</Text>
                    </View> */}
                        <View style={styles.listParent}>
                            {/* {data.map((item) => (
                                <TouchableOpacity key={item.Id}  onPress={() => getClientDetail(item)}>
                                    <View style={styles.item}>
                                        <Text style={styles.itemEmailCell}>{item.Email}</Text>
                                        <Text style={styles.itemCell}>{item.First}</Text>
                                        <Text style={styles.itemCell}>{item.Last}</Text>
                                    </View>
                                </TouchableOpacity>

                            ))} */}

                            <FlatList
                                style={styles.list}
                                    data={data}
                                    keyExtractor={(item) => item.Id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.meetingItem}>
                                            <Text style={styles.detailText}>Email: {item.Email}</Text>
                                            <Text style={styles.detailText}>First: {item.First}</Text>
                                            <Text style={styles.detailText}>Last: {item.Last}</Text>
                                            <TouchableOpacity style={styles.touchStyle2} onPress={() => getClientDetail(item)}>
                                                <Text style={styles.listButton}>Details</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                            />
                        </View>
                    <TouchableOpacity style={styles.touchStyle1} onPress={() => navigation.navigate('AddClient')}>
                        <Text style={styles.buttons}>Add Client</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: '45%',
        paddingTop: '5%',
        backgroundColor: 'rgba(0, 0, 0, 0)',

        // height: 500,
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
        backgroundColor:'lightblue',
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
    gridCol: {
        borderWidth: 1,
        height:50,
    },
    gridParent: {
        height:5,
        backgroundColor: 'lightblue',
        marginBottom: 5,
        paddingBottom: 5,
    },
    gridColText:{
        fontWeight: 'bold',
        fontSize: 20,
    },
    gridFlex: {
        flex: 1, alignSelf: 'stretch', flexDirection: 'row', height:10, marginTop: 20, marginBottom: -450,
    },
    gridColCell:{
        flex: 1, alignSelf: 'stretch' , borderWidth: 1,height:50, backgroundColor: 'lightblue',
        fontWeight: 'bold',
        fontSize: 28,
    },
    gridRow:{
        flex: 1, alignSelf: 'stretch', flexDirection: 'row',
    },
    gridData:{
        flex: 1, alignSelf: 'stretch', flexDirection: 'row', height:20,
    },
    item: {
        padding: 10,
        fontSize: 18,
        // height: 60,
        textAlign: 'left',
        flexDirection: 'row',
        width:400,
        backgroundColor: '#fff',
    },
    list: {
        paddingHorizontal: 5,
        textAlign: 'left',
        backgroundColor: '#fff',
        width: 400,
        borderWidth: 1,
        borderColor: '#000',
    },
    itemCell:{
        padding:5,
        backgroundColor: '#fff',
        width: '20%',
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    itemEmailCell:{
        padding:5,
        backgroundColor: '#fff',
        width: '55%',
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#000',
        height:60,
    },
    tableHeader:{
        padding: 10,
        fontSize: 18,
        textAlign: 'left',
        flexDirection: 'row',
        width:400,
        backgroundColor: 'lightblue',
    },
    touchStyle1:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: '100%',
        height: 100,
        margin: 10,
        flexDirection: 'row',
        textAlign: 'center',

    },
    listParent:{
        height:500,
        marginBottom: 100,
    },
    listScroll:{
        height:800,

    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    meetingItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    listButton: {
        height:40,
        width: 100,
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        padding:5,
        marginTop: -10,
        marginLeft: 20,
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
    detailText:{
        fontSize: 22,
    },
});
export default ClientResultsScreen;
