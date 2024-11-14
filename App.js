import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Importar las pantallas desde la carpeta screen
import HomeScreen from './screen/HomeScreen';
import CalendarScreen from './screen/CalendarScreen';
import ProfileScreen from './screen/ProfileScreen';
import TasksScreen from './screen/TasksScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Tasks') {
              iconName = focused ? 'list' : 'list';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'user' : 'user';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
