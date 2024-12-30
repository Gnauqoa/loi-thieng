// In App.js in a new project

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/pages/home";
import { initializeAuth, useAuth } from "@/config/redux/slices/auth";
import LoginScreen from "@/pages/auth/login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "@/components/TabBar";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RouterContainer = () => {
  const { isAuthenticated, dispatch } = useAuth();

  React.useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Home2" component={HomeScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RouterContainer;
