import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { authApi } from "@/api/authApi";
import { tokenStorage } from "@/storage/tokenStorage";
import AppInput from "@/components/AppInput";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Заполни все поля");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен быть минимум 6 символов");
      return;
    }

    try {
      setLoading(true);

      const data = await authApi.register({
        name,
        email,
        password,
      });

      await tokenStorage.setToken(data.token);

      Alert.alert("Успешно", "Аккаунт создан");

      navigation.navigate("Profile");
    } catch (error: any) {
      console.log("REGISTER ERROR:", error?.response?.data || error.message);

      Alert.alert(
        "Ошибка регистрации",
        error?.response?.data?.message || "Не удалось создать аккаунт"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>Создай аккаунт для маркетплейса</Text>

          <AppInput
            placeholder="Имя"
            value={name}
            onChangeText={setName}
          />

          <AppInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            placeholder="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            title={loading ? "Создание..." : "Зарегистрироваться"}
            onPress={handleRegister}
            disabled={loading}
          />

          <Text style={styles.linkText}>
            Уже есть аккаунт?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Войти
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    gap: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 12,
  },
  linkText: {
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
    fontSize: 15,
  },
  link: {
    color: "#2563EB",
    fontWeight: "600",
  },
});