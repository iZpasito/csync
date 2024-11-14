import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Para íconos

import AgendaWithPhotoReminder from './screen/menu';
import PhotoScreen from './screen/PhotoScreen';

// Crear navegadores
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Pantalla Home principal
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>C-Sync</Text>
      <Button title="Abrir Calendario" onPress={() => navigation.navigate('Calendario')} />
      <StatusBar style="auto" />
    </View>
  );
}

// Stack Navigator para Home y otras pantallas adicionales
function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Calendario" component={AgendaWithPhotoReminder} options={{ title: 'Calendario' }} />
      <Stack.Screen name="PhotoScreen" component={PhotoScreen} options={{ title: 'Seleccionar o Tomar Foto' }} />
    </Stack.Navigator>
  );
}

// Navegación con Tabs
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Configuración') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Configuración" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Pantalla de Configuración (dummy por ahora)
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Configuración</Text>
    </View>
  );
}

// Componente principal
export default function App() {
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
