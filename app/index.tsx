import React, { useState } from "react";
import { Text, SafeAreaView } from "react-native";
import RoomScreen from "./room";
import JoinScreen from "./join2";
import CallScreen from "./call";

import "../global.css";
import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext";

// Just to handle navigation
export default function App() {
  const screens = {
    ROOM: "JOIN_ROOM",
    CALL: "CALL",
    JOIN: "JOIN",
  };

  const [screen, setScreen] = useState(screens.ROOM);
  const [roomId, setRoomId] = useState("");

  let content;

  switch (screen) {
    case screens.ROOM:
      content = (
        <JoinScreen roomId={roomId} screens={screens} setScreen={setScreen} />
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
    <FirebaseAuthProvider>
      <SafeAreaView className="flex-1 justify-center ">{content}</SafeAreaView>
    </FirebaseAuthProvider>
  );
}
