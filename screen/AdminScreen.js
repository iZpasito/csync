import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { PlaceContext } from "../controller/taskController";

const AdminUserListScreen = () => {
  const { getAllUsers, updateUserPremiumStatus } = useContext(PlaceContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersList = await getAllUsers();
    setUsers(usersList);
  };

  const togglePremiumStatus = async (user) => {
    const newStatus = user.is_premium === 1 ? 0 : 1;
    const result = await updateUserPremiumStatus(user.id, newStatus);
    if (result.success) {
      Alert.alert("Éxito", result.message);
      fetchUsers(); // Reload user list
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userName}>Usuario: {item.nombre_usuario}</Text>
            <Text>Premium: {item.is_premium === 1 ? "Sí" : "No"}</Text>
            <Button
              title={item.is_premium === 1 ? "Eliminar Premium" : "Hacer Premium"}
              onPress={() => togglePremiumStatus(item)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdminUserListScreen;
