import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PlaceContext } from '../controller/taskController';
import { PieChart } from 'react-native-chart-kit';

const ProfileScreen = () => {
  const { datosUser, loadUserTasks } = useContext(PlaceContext);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const fetchUserTasks = async () => {
      const tasks = await loadUserTasks();

      console.log("Tareas cargadas:", tasks);

      // Manejo de tareas nulas o vacías
      if (!tasks || tasks.length === 0) {
        setCompletedTasks(0);
        setPendingTasks(0);
        return;
      }

      // Calcular estadísticas
      const completed = tasks.filter((task) => task.Status === "Completada").length;
      const pending = tasks.filter((task) => task.Status === "Pendiente").length;

      setCompletedTasks(completed);
      setPendingTasks(pending);
    };

    fetchUserTasks();
  }, []);

  const chartData = [
    {
      name: "Completadas",
      count: completedTasks,
      color: "#4caf50", // Verde
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Pendientes",
      count: pendingTasks,
      color: "#ff9800", // Naranja
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Nombre: {datosUser?.nombre_usuario || "N/A"}</Text>
      <Text>Plan actual: {datosUser?.is_premium === 1 ? "Premium" : "Básico"}</Text>
      <View style={styles.summary}>
        <Text>{completedTasks} Tareas Completas</Text>
        <Text>{pendingTasks} Tareas Pendientes</Text>
      </View>
      <View style={styles.chart}>
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 40} // Ancho dinámico
          height={220}
          chartConfig={{
            backgroundColor: "#f5f5f5",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
  },
  chart: {
    backgroundColor: "#e0e0e0",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default ProfileScreen;
