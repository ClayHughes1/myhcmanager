
import React from 'react';
import {
    StyleSheet,
    View,
    // TouchableOpacity,
    // Text,
    // Alert
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
    // const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* <View style={styles.bottomRow}>
                <TouchableOpacity
                    style={styles.bottomButtonStyles}
                    onPress={()=>navigation.navigate('About')}>
                    <Text style={styles.buttonText}>About GloboMantics</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};


const styles = StyleSheet.create({
    container:{
        flex: 2,
        backgroundColor: '#35605a',
    },
    bottomRow: {
        flex: 1,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    bottomButtonStyles:{
        backgroundColor: '#35605a',
        width: '100%',
        height: '50%',
        paddingRight: 20,
    },
    buttonText:{
        color: '#ffffff',
        fontSize: 20,
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyles:{
        backgroundColor: '#35605a',
        width: '50%',
        height: '55%',
        alignItems: 'center',
    },
    border: {
        borderColor: '#ffffff',
        borderBottomWidth: 1,
    },
});

export default MenuScreen;
