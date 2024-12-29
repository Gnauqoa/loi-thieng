// In App.js in a new project

import * as React from "react";
import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext";
import TamaguiProvider from "./config/tamagui.config";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./config/redux/store";
import RouterContainer from "./routers";

import Toast from "react-native-toast-message";

function App() {
  return (
    <FirebaseAuthProvider>
      <ReduxProvider store={store}>
        <TamaguiProvider>
          <RouterContainer />
        </TamaguiProvider>
      </ReduxProvider>
      <Toast />
    </FirebaseAuthProvider>
  );
}

export default App;
