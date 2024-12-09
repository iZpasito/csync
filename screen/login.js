import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { PlaceContext } from "../controller/taskController";

const LoginScreen = ({ navigation }) => {
  const { loginUser } = useContext(PlaceContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // Manejar la lógica de inicio de sesión
  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
  
    try {
      const isAuthenticated =  loginUser(userName, password);
  
      if (isAuthenticated) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso.');
        navigation.navigate('Home'); // Cambia 'Home' por la pantalla inicial
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#007BFF',
    fontSize: 14,
  },
});
