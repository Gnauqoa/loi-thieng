import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View, Button } from "react-native";
import { AuthProvider, useAuth } from "@/config/AuthContext";
import RoomScreen from "./room";
import JoinScreen from "./join";
import CallScreen from "./call";
import LoginScreen from "./login";
import SignupScreen from "./signup";
import HomeScreen from "./home";
import "../global.css";

//Main app
export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  )
}
// Just to handle navigation
export function Layout() {

  const { authState, onLogout } = useAuth();

  const screens = {
    ROOM: "JOIN_ROOM",
    CALL: "CALL",
    JOIN: "JOIN",
    LOGIN: "LOGIN",
    SIGNUP: "SIGNUP",
    HOME: "HOME",
  };

  const [screen, setScreen] = useState(screens.HOME);
  const [authScreen, setAuthScreen] = useState(screens.LOGIN);

  const [roomId, setRoomId] = useState("");

  /*useEffect(() => {
    console.log("authState:", authState?.token);
    if (authState?.authenticated) {
      setScreen(screens.HOME);
    } else {
      setScreen(screens.LOGIN);
    }
  }, [authState?.token])*/
  useEffect(() => {
    console.log("authState:", authState);
  }, [authState])

  let content;
  let authentication;

  switch (authScreen) {
    case screens.SIGNUP:
      authentication = (
        <SignupScreen
          screens={screens}
          setScreen={setAuthScreen}
        />
      );
      break;

    case screens.LOGIN:
      authentication = (
        <LoginScreen
          screens={screens}
          setScreen={setAuthScreen}
        />
      );
      break;

    default:
      break;
  }

  switch (screen) {
    case screens.HOME:
      content = (
        <HomeScreen />
      );
      break;

    case screens.ROOM:
      content = (
        <RoomScreen
          roomId={roomId}
          setRoomId={setRoomId}
          screens={screens}
          setScreen={setScreen}
        />
      );
      break;

    case screens.CALL:
      content = (
        <CallScreen roomId={roomId} screens={screens} setScreen={setScreen} />
      );
      break;

    case screens.JOIN:
      content = (
        <JoinScreen roomId={roomId} screens={screens} setScreen={setScreen} />
      );
      break;

    default:
      content = <Text>Wrong Screen</Text>;
  }

  return (
    <SafeAreaView className="flex-1 justify-center ">
      {authState?.authenticated ? content : authentication}
    </SafeAreaView>

  );
}
