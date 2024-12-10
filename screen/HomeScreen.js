import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { PlaceContext } from "../controller/taskController";

const HomeScreen = () => {
  const {
    currentUser,
    getAllUsers,
    updateUserPremiumStatus,
    tasks,
    loadTasks,
  } = useContext(PlaceContext);

  const [usersWithTaskCounts, setUsersWithTaskCounts] = useState([]);

  useEffect(() => {
    if (currentUser?.is_admin) {
      fetchUsersWithTaskCounts(); // Admin view
    } else {
      loadTasks(); // Regular user view
    }
  }, [currentUser]);

  const fetchUsersWithTaskCounts = async () => {
    try {
      const users = await getAllUsers();
      const usersWithCounts = users.map((user) => {
        const taskCount = tasks.filter((task) => task.user_id === user.id).length;
        return { ...user, taskCount };
      });
      setUsersWithTaskCounts(usersWithCounts);
    } catch (error) {
      console.error("Error fetching users and task counts:", error);
    }
  };

  const handleTogglePremium = async (user) => {
    try {
      const newStatus = user.is_premium === 1 ? 0 : 1;
      const result = await updateUserPremiumStatus(user.id, newStatus);
      if (result.success) {
        Alert.alert("Éxito", result.message);
        fetchUsersWithTaskCounts(); // Refresh user data
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error toggling premium status:", error);
    }
  };

  if (currentUser?.is_admin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <FlatList
          data={usersWithTaskCounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text style={styles.userName}>Usuario: {item.nombre_usuario}</Text>
              <Text>Tareas asignadas: {item.taskCount}</Text>
              <Text>Estado Premium: {item.is_premium === 1 ? "Sí" : "No"}</Text>
              <Button
                title={item.is_premium === 1 ? "Eliminar Premium" : "Hacer Premium"}
                onPress={() => handleTogglePremium(item)}
              />
            </View>
          )}
        />
      </View>
    );
  }

  // Regular User View
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tareas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>Título: {item.title}</Text>
            <Text>Descripción: {item.description}</Text>
            <Text>Estado: {item.Status}</Text>
            <Text>Fecha: {item.date}</Text>
            <Text>Hora: {item.time}</Text>
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
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskContainer: {
    padding: 15,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    marginBottom: 15,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
