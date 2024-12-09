import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import PlaceContextProvider, { PlaceContext } from "./controller/taskController";

import HomeScreen from "./screen/HomeScreen";
import CalendarScreen from "./screen/CalendarScreen";
import ProfileScreen from "./screen/ProfileScreen";
import Tareas from "./screen/Tareas";
import LoginScreen from "./screen/login";
import RegisterScreen from "./screen/register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Inicio") iconName = "home";
          else if (route.name === "Tareas") iconName = "list";
          else if (route.name === "Calendario") iconName = "calendar";
          else if (route.name === "Perfil") iconName = "user";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Tareas" component={Tareas} />
      <Tab.Screen name="Calendario" component={CalendarScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { isLoggedIn } = useContext(PlaceContext);

  return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <PlaceContextProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </PlaceContextProvider>
  );
}
