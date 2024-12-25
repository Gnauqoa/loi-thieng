// In App.js in a new project

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FirebaseAuthProvider } from "@/src/context/FirebaseAuthContext";
import TamaguiProvider from "./config/tamagui.config";
import HomeScreen from "./pages/home";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./config/redux/store";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <FirebaseAuthProvider>
      <ReduxProvider store={store}>
        <TamaguiProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </TamaguiProvider>
      </ReduxProvider>
    </FirebaseAuthProvider>
  );
}

export default App;
