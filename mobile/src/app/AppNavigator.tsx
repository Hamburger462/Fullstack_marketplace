import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "../screens/auth/RegisterScreen";
import LoginScreen from "@/screens/auth/LoginScreen";
import ProfileScreen from "@/screens/auth/ProfileScreen";

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register">
      
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Регистрация",
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}