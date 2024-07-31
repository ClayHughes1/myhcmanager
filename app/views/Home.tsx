import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <ImageBackground source={require('../components/img/app_main_bch_img.gif')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.appName}>My Health Coach Manager</Text>
        <Text style={styles.greetText}>Welcome to the Health Coach Manager</Text>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttons}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('MeetingScheduler')}>
            <Text style={styles.buttons}>Meet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      video: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ADD8E6',
        height:300,
      },
      appName:{
        marginTop: -200,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 34,
        fontWeight: '800',
        // backgroundColor: '#ADD8E6',
        padding:10,
      },
      greetText: {
        padding: 10, // Padding around the text
        // backgroundColor: '#e0e0e0', // Background color of the text
        marginTop: 15,
        marginBottom: 200,
        fontSize: 24,
        fontWeight: '800',
      },
      buttons:{
        color: '#fff',
        padding: 15,
        margin: 5,
        fontSize: 30,
        fontWeight: '900',
        backgroundColor:'rgba(0, 0, 0,0.1)',
        //'rgba(255, 255, 255, 0.5)',
        width: 180,
        height: 65,
        textAlign: 'center',
        borderWidth: 2, // Border width
        borderColor: '#ADD8E6', // Border color
        borderRadius: 10, // Border radius (optional)
      },
      optionsSection:{
        textAlign: 'center',
        // marginTop: -300,
        marginBottom: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
        //'#000000',
      },
      touchStyle:{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
        // justifyContent: 'center',
      },
});

export default HomeScreen;
