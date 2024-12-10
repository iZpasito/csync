import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

function CustomTabBar({ state, descriptors, navigation }) {
  const { logoutUser } = useContext(PlaceContext);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Icon name={getTabIcon(route.name)} size={24} color={isFocused ? "blue" : "gray"} />
            <Text style={{ color: isFocused ? "blue" : "gray" }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
        <Icon name="sign-out" size={24} color="red" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

function getTabIcon(routeName) {
  switch (routeName) {
    case "Inicio":
      return "home";
    case "Tareas":
      return "list";
    case "Calendario":
      return "calendar";
    case "Perfil":
      return "user";
    default:
      return "circle";
  }
}

function AppNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { isLoggedIn } = React.useContext(PlaceContext);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="AppNavigator"
          component={AppNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    alignItems: "center",
  },
  logoutButton: {
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 12,
  },
});
