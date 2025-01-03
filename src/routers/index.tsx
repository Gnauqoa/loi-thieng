// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/pages/root/home";
import { initializeAuth, useAuth } from "@/config/redux/slices/auth";
import LoginScreen from "@/pages/auth/login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "@/components/TabBar";
import PrayScreen from "@/pages/root/pray";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfileScreen from "@/pages/root/profile";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RouterContainer = () => {
  const { isAuthenticated, dispatch } = useAuth();

  React.useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  return (
    <SafeAreaProvider style={{ marginTop: 16 }}>
      <NavigationContainer>
        {isAuthenticated ? (
          <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <TabBar {...props} />}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Foundation name="home" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Pray"
              component={PrayScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5
                    name="praying-hands"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="person" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RouterContainer;
