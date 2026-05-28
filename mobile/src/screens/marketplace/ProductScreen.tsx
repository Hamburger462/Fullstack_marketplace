import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { itemApi } from "@/api/productAPI";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";

import { type Item } from "@/types/product.types";

export default function ProductScreen({ navigation }: any) {
    const [items, setItems] = useState<Item[] | undefined>();
  const [loading, setLoading] = useState(true);

  async function loadCatalogue() {
    try {
      setLoading(true);

        console.log("Loading started")

      const response = await itemApi.getAllProducts();

      console.log(response);

      setItems(response);
    } catch (error: any) {
      console.log("ME ERROR:", error?.response?.data || error.message);

      Alert.alert("Ошибка", "Нужно войти в аккаунт");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogue();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Products loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Catalogue</Text>

        {items ? (items.map((item) => (
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{item.title}</Text>

            <Text style={styles.label}>Desc</Text>
            <Text style={styles.value}>{item.desc}</Text>

            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>{item.price}</Text>
          </View>
        ))) : (
          <Text style={styles.empty}>Items not found</Text>
        )}
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