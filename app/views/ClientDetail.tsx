import React,{useEffect,useState} from 'react';
import {
    SafeAreaView,
    // ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    ImageBackground,
    Button,
    Alert,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';

const ClientDetail = ({route}) => {
    const { ClientId } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [clientDetails, setClientDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    // const [firstName, setFirstName] = useState(clientDetails[0].First);
    // const [lastName, setLastName] = useState(clientDetails[0].Last);
    const [email, setEmail] = useState('');
    const [planStart, setPlanStart] = useState('');
    const [planEnd, setPlanEnd] = useState('');
    const [hasOrder, setHasOrder] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleMain, setIsVisibleMain] = useState(true);


    useEffect(() => {
        const fetchClientDetails = async () => {
          try {
              if(ClientId > 0){
                  const response = await fetch('http://10.0.2.2:4000/api/getclientdetail', {
                      method: 'POST',
                      headers: {
                          'Accept':'application/json',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ ClientId }),
                  }).catch((err) => {
                      console.log('Error   ',err);
                  });
                  const data = await response.json();
                  setHasOrder(data[0].HasOrder ? '1' : '0');
                  setEmail(data[0].Email);
                  setPlanStart(data[0].PlanStart);
                  setPlanEnd(data[0].PlanEnd);
                  setClientDetails(data);
                  setLoading(false);
              }
          }
          catch (err) {
              setError(err);
          } finally {
              setLoading(false);
          }
        };

        fetchClientDetails();
    }, [ClientId]);


    const fetchClientDetails = async () => {
      try {
          if(ClientId > 0){
              const response = await fetch('http://10.0.2.2:4000/api/getclientdetail', {
                  method: 'POST',
                  headers: {
                      'Accept':'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ ClientId }),
              }).catch((err) => {
                  console.log('Error   ',err);
              });
              const data = await response.json();
              setHasOrder(data[0].HasOrder ? '1' : '0');
              setEmail(data[0].Email);
              setPlanStart(data[0].PlanStart);
              setPlanEnd(data[0].PlanEnd);
              setClientDetails(data);
              setLoading(false);
          }
      }
      catch (err) {
          setError(err);
      } finally {
          setLoading(false);
      }
    };

    const updateDetails = async() => {
      try {
        console.log('CLIENT ID   \n',ClientId);
          if(ClientId > 0){
              const response = await fetch('http://10.0.2.2:4000/api/updateclientdetail', {
                  method: 'POST',
                  headers: {
                      'Accept':'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ClientId, email,  planStart, planEnd, hasOrder }),
              }).then((json) => {
                console.log('JSON RESULTS  \n',JSON.stringify(json));
                if(json.status === 200)
                  {
                    Alert.alert('Client updated successfully');
                    fetchClientDetails();
                    setIsVisible(false);
                    setIsVisibleMain(true);
                  }
                  else {
                    Alert.alert('Something happened the client was not created. ');
                  }
              })
              .catch((err) => {
                  console.log('Error   ',err);
              });
              // const data = await response.json();

              // setClientDetails(data);
              // setLoading(false);
          }
      }
      catch (err) {
          setError(err);
      } finally {
          setLoading(false);
      }
    };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (!clientDetails) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Client details not found.</Text>
        </View>
      );
    }

    if (error) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load data: {error.message}</Text>
          </View>
        );
    }

    const formatDate = (dateTimeString) => {
        return format(new Date(dateTimeString), 'MMMM dd, yyyy');
    };

    const saveDetails = () => {
      // Save the updated details (e.g., make an API call to update the data on the server)
      console.log('Updated details:', { email, planStart, planEnd, hasOrder });
      updateDetails();
      setIsEditable(false); // Disable editing mode after saving
    };

    const toggleEditMode = () => {
      setIsEditable(!isEditable);
      console.log(isEditable);

      setIsVisible(true);
      setIsVisibleMain(false);
    };

    return(
        <ImageBackground source={require('../components/img/app_admim_portal_bch.gif')}
        style={styles.background}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.heading}>Client Detail</Text>

                <View style={styles.detailContainer}>
                    <Text style={styles.labelClient}>Client: {clientDetails[0].First} {clientDetails[0].Last}</Text>

                    {isVisible && (
                      <View>
                        <Text style={styles.labels}>Email:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={clientDetails[0].Email}
                          onChangeText={setEmail}
                          placeholder="Email"
                          keyboardType="email-address"
                          editable={isEditable}
                        />

                        <Text style={styles.labels}>Start Date:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={clientDetails[0].PlanStart ? formatDate(clientDetails[0].PlanStart) : 'No Start Date'}
                          onChangeText={setPlanStart}
                          placeholder="Start Date"
                          editable={isEditable}
                        />

                        <Text style={styles.labels}>End Date:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={clientDetails[0].PlanEnd ? formatDate(clientDetails[0].PlanEnd) : 'No End Date'}
                          onChangeText={setPlanEnd}
                          placeholder="End Date"
                          editable={isEditable}
                        />

                        <Text style={styles.labels}>Has Order:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={hasOrder}
                          onChangeText={(value) => setHasOrder(value === '1')}
                          placeholder="Has Order"
                          keyboardType="numeric"
                          editable={isEditable}
                        />
                        {/* clientDetails[0].HasOrder ? '1' : '0' */}
                      </View>
                    )}


                    {isVisibleMain && (
                      <View>
                          <Text style={styles.labels}>Email:</Text>
                          <Text style={styles.detailText}>{clientDetails[0].Email}</Text>

                          <Text style={styles.labels}>Start Date:</Text>
                          <Text style={styles.detailText}>{clientDetails[0].PlanStart ? formatDate(clientDetails[0].PlanStart) : 'No Start Date'}</Text>

                          <Text style={styles.labels}>End Date:</Text>
                          <Text style={styles.detailText}>{clientDetails[0].PlanEnd ? formatDate(clientDetails[0].PlanEnd) : 'No End Date'}</Text>

                          <Text style={styles.detailText}>Has Order: {clientDetails[0].HasOrder ? 1 : 0}</Text>
                      </View>
                    )}

                    <View style={styles.buttonContainer}>
                      <Button title={isEditable ? 'Save Details' : 'Edit Details'} onPress={isEditable ? saveDetails : toggleEditMode} />
                    </View>

                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      height:10,
    },
    item: {
      marginBottom: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      width: '100%',
      backgroundColor: '#f9f9f9',
    },
    text: {
      fontSize: 18,
    },
    detailContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: 10,
      width: '95%',
      backgroundColor: 'rgba(0, 0, 0,0.1)',
      marginTop: 20,
    },
    detailText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
     },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    labels:{
        paddingBottom: 5,
        fontSize: 22,
        fontWeight: 'bold',
    },
    labelClient:{
      paddingBottom: 5,
      fontSize: 25,
      fontWeight: 'bold',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      marginBottom: 20,
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 5,
      marginBottom: 15,
      padding: 10,
      borderRadius: 5,
      width: 250,
    },
    buttonContainer: {
      marginTop: 20,
    },
});

export default ClientDetail;
