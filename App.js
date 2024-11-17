import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PlaceContextProvider from './controller/taskController';

// Importar las pantallas desde la carpeta screen
import HomeScreen from './screen/HomeScreen';
import CalendarScreen from './screen/CalendarScreen';
import ProfileScreen from './screen/ProfileScreen';
import TasksScreen from './screen/TasksScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PlaceContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Inicio') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Tareas') {
                iconName = focused ? 'list' : 'list';
              } else if (route.name === 'Calendario') {
                iconName = focused ? 'calendar' : 'calendar';
              } else if (route.name === 'Perfil') {
                iconName = focused ? 'user' : 'user';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Inicio" component={HomeScreen} />
          <Tab.Screen name="Tareas" component={TasksScreen} />
          <Tab.Screen name="Calendario" component={CalendarScreen} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PlaceContextProvider>
  );
}
