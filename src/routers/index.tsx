// In App.js in a new project

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/pages/root/home";
import { initializeAuth, useAuth } from "@/config/redux/slices/auth";
import LoginScreen from "@/pages/auth/login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "@/components/TabBar";
import HomeIcon from "@/assets/icons/home.svg";
import PrayIcon from "@/assets/icons/pray.svg";
import PrayScreen from "@/pages/root/pray";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RouterContainer = () => {
  const { isAuthenticated, dispatch } = useAuth();

  React.useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  return (
    <SafeAreaProvider>
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
                tabBarIcon: ({ focused, color, size }) => (
                  <HomeIcon
                    fill={color}
                    width={size}
                    height={size}
                    focusable={focused}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Pray"
              component={PrayScreen}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <PrayIcon
                    fill={color}
                    width={size}
                    height={size}
                    focusable={focused}
                  />
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
