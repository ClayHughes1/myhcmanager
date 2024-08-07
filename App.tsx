import React from 'react';
import HomeScreen from './app/views/Home.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/views/Login.tsx';
import Register from './app/views/Register.tsx';
import AdminPortal from './app/views/AdminPortal.tsx';
import ClientResults from './app/views/Clients.tsx';
import SchedulerScreen from './app/views/MeetingScheduler.tsx';
import AddClient from './app/views/AddClient.tsx';
import ClientDetail from './app/views/ClientDetail.tsx';
import ViewAppointments from './app/views/ViewAppointments.tsx';
import AddAvailability from './app/views/AddAvailability.tsx';
import AppointmentScreen from './app/views/Appointment.tsx';
import MyAppointments from './app/views/MyAppointments.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Home',headerShown: false}}
        />
        <Stack.Screen
            name="Register"
            component={Register}
            options={{title: 'Register'}}
        />
        <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Login'}}
        />
        <Stack.Screen
            name="Admin"
            component={AdminPortal}
            options={{title: 'Admin', headerShown: false}}
        />
        <Stack.Screen
            name="Clients"
            component={ClientResults}
            options={{title: 'My Clients'}}
        />
        <Stack.Screen
            name="MeetingScheduler"
            component={SchedulerScreen}
            options={{title: 'Scheduler'}}
        /> 
        <Stack.Screen
            name="AddClient"
            component={AddClient}
            options={{title: 'Add Client'}}
        />
        <Stack.Screen
            name="ClientDetail"
            component={ClientDetail}
            options={{title: 'Client Detail'}}
        />
        <Stack.Screen
            name="ViewAppointments"
            component={ViewAppointments}
            options={{title: 'View  Appointments'}}
        />
        <Stack.Screen
            name="AddAvailability"
            component={AddAvailability}
            options={{title: 'Add Availability'}}
        />
        <Stack.Screen
            name="Appointment"
            component={AppointmentScreen}
            options={{title: 'Add Appointment'}}
        />
        <Stack.Screen
            name="MyAppointments"
            component={MyAppointments}
            options={{title: 'My Appointment'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
