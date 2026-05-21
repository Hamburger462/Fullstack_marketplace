import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { authApi } from "@/api/authApi";
import { tokenStorage } from "@/storage/tokenStorage";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";

type User = {
  id: number | string;
  name: string;
  email: string;
};

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await authApi.me();

      setUser(data.user);
    } catch (error: any) {
      console.log("ME ERROR:", error?.response?.data || error.message);

      Alert.alert("Ошибка", "Нужно войти в аккаунт");

      await tokenStorage.removeToken();

      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await tokenStorage.removeToken();

    Alert.alert("Готово", "Вы вышли из аккаунта");

    navigation.navigate("Login");
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Загрузка профиля...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Профиль</Text>

        {user ? (
          <View style={styles.card}>
            <Text style={styles.label}>Имя</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>ID пользователя</Text>
            <Text style={styles.value}>{user.id}</Text>
          </View>
        ) : (
          <Text style={styles.empty}>Данные пользователя не найдены</Text>
        )}

        <AppButton title="Обновить профиль" onPress={loadProfile} />

        <AppButton title="Выйти" onPress={handleLogout} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 18,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  empty: {
    fontSize: 16,
    color: "#6B7280",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
});