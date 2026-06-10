import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "@/screens/marketplace/HomeScreen";
import CartScreen from "@/screens/cart/CartScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoginScreen from "@/screens/auth/LoginScreen";
import ProfileScreen from "@/screens/auth/ProfileScreen";
import ProductScreen from "@/screens/marketplace/ProductScreen";

export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Register: undefined;
  Login: undefined;
  Profile: undefined;
  Product: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      // ─── Global Premium Header Design Configurations ───
      screenOptions={{
        headerStyle: {
          backgroundColor: "#534AB7", // Core signature purple brand color
        },
        headerTintColor: "#FFFFFF", // Colors for top back buttons and titles
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 17,
        },
        headerShadowVisible: false, // Cleaner card border transitions
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Home",
          // Right-aligned header button profile route shortcut
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate("Profile")}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>👤 Profile</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="Cart"
        component={CartScreen} // Corrected mapping to direct to CartScreen instead of HomeScreen
        options={{
          title: "Shopping Cart",
        }}
      />

      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={({ navigation }) => ({
          title: "Catalogue",
          // Injecting quick-action cart access icon inside the top header layer
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate("Cart")}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>🛒 Cart</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Create Account",
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Welcome Back",
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "My Profile",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});