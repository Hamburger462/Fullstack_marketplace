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

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Заполни email и пароль");
      return;
    }

    try {
      setLoading(true);

      const data = await authApi.login({
        email,
        password,
      });

      await tokenStorage.setToken(data.token);

      Alert.alert("Успешно", "Вы вошли в аккаунт");

      navigation.navigate("Profile");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error?.response?.data || error.message);

      Alert.alert(
        "Ошибка входа",
        error?.response?.data?.message || "Неверный email или пароль"
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
          <Text style={styles.title}>Вход</Text>
          <Text style={styles.subtitle}>Войди в аккаунт маркетплейса</Text>

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
            title={loading ? "Вход..." : "Войти"}
            onPress={handleLogin}
            disabled={loading}
          />

          <Text style={styles.linkText}>
            Нет аккаунта?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Зарегистрироваться
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