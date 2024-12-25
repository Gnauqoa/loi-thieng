import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { useAuth } from "@/context/FirebaseAuthContext";
import { Room, RoomUser } from "@/@types/room";
import { snapshot } from "node:test";

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export type unsubscribeSnapshot = {
  userId: string;
  unsubscribe: () => void;
};

interface JoinScreenProps {
  roomId: string;
  screens: { ROOM: string; [key: string]: string };
  setScreen: (screen: string) => void;
}

const onRoomStreamChange = (
  setStreams: React.Dispatch<React.SetStateAction<MediaStream[]>>,
  streams: MediaStream[],
  changes: {
    type: "added" | "modified" | "removed";
    stream: MediaStream;
  }[]
) => {
  changes.forEach((change) => {
    if (change.type === "added") {
      if (!streams.find((stream) => stream.id === change.stream.id))
        streams.push(change.stream);
    } else if (change.type === "modified") {
      streams = streams.map((stream) =>
        stream.id === change.stream.id ? change.stream : stream
      );
    } else if (change.type === "removed") {
      streams = streams.filter((stream) => stream.id !== change.stream.id);
    }
  });

  setStreams(streams);
};

const onRoomUserChange = (
  setRoomUsersData: React.Dispatch<React.SetStateAction<RoomUser[]>>,
  roomUsers: RoomUser[],
  changes: {
    type: "added" | "modified" | "removed";
    roomUser: RoomUser;
  }[]
) => {
  changes.forEach((change) => {
    if (change.type === "added") {
      if (!roomUsers.find((roomUser) => roomUser.id === change.roomUser.id))
        roomUsers.push(change.roomUser);
    } else if (change.type === "modified") {
      roomUsers = roomUsers.map((roomUser) =>
        roomUser.id === change.roomUser.id ? change.roomUser : roomUser
      );
    } else if (change.type === "removed") {
      roomUsers = roomUsers.filter(
        (roomUser) => roomUser.id !== change.roomUser.id
      );
    }
  });

  setRoomUsersData((prev) => roomUsers);
};

const createMediaStream = async () => {
  const isFront = true;
  const devices: MediaDeviceInfo[] =
    (await mediaDevices.enumerateDevices()) as MediaDeviceInfo[];

  const facing = isFront ? "front" : "environment";
  const videoSourceId = devices.find(
    (device) =>
      device.kind === "videoinput" &&
      device.label.toLowerCase().includes(facing)
  )?.deviceId;

  const facingMode = isFront ? "user" : "environment";
  const constraints = {
    audio: true,
    video: {
      mandatory: {
        minWidth: 500,
        minHeight: 300,
        minFrameRate: 30,
      },
      facingMode,
      optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
    },
  };

  return await mediaDevices.getUserMedia(constraints);
};

const handleError = (error: Error) => {
  console.error("Error:", error);
};

const roomId = "c7df572b-f061-476a-b3c7-5157451f0e18";

export type Connection = {
  stream: MediaStream;
  with: string;
  PC: RTCPeerConnection;
};

const JoinScreen = ({}: JoinScreenProps) => {
  const { isLogin } = useAuth();
  const [room, setRoom] = useState<Room>();
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const [localStream, setLocalStream] = useState<MediaStream>();

  const startLocalStream = async () => {
    setLocalStream(await createMediaStream());
  };

  const handleHaveOffer = (userId: string) => {
    const RTCsessionsRef = collection(db, "room", roomId, "RTCsessions");

    return onSnapshot(RTCsessionsRef, async (snapshot) => {
      const newConnections: Connection[] = connections;

      snapshot.docChanges().forEach(async (change) => {
        console.log("Have offer type:", change.type);
        const data = change.doc.data() as {
          answerId: string;
          offerId: string;
          answer: RTCSessionDescription;
          offer: RTCSessionDescription;
        };
        const type = change.type;

        if (data.answerId === userId && type === "added") {
          const newPC = new RTCPeerConnection(configuration);

          localStream?.getTracks().forEach((track) => {
            newPC.addTrack(track, localStream);
          });

          newPC.addEventListener("icecandidate", (e) => {
            if (e.candidate) {
              addDoc(
                collection(RTCsessionsRef, change.doc.id, "calleeCandidates"),
                e.candidate.toJSON()
              );
            }
          });

          newPC.addEventListener("track", (e) => {
            const newStream = new MediaStream();
            e.streams[0].getTracks().forEach((track) => {
              newStream.addTrack(track);
            });
            setConnections((prev) => {
              const index = prev.findIndex(
                (connection) => connection.with === data.offerId
              );

              if (index !== -1) {
                prev[index].stream = newStream;
              }

              return prev;
            });
          });

          await newPC.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          const answer = await newPC.createAnswer();
          await newPC.setLocalDescription(answer);

          const sessionRef = doc(RTCsessionsRef, change.doc.id);

          await updateDoc(sessionRef, { answer, connected: true });
          onSnapshot(
            collection(RTCsessionsRef, change.doc.id, "callerCandidates"),
            (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  const data = change.doc.data();
                  newPC.addIceCandidate(new RTCIceCandidate(data));
                }
              });
            }
          );
          newConnections.push({
            stream: new MediaStream(),
            with: data.offerId,
            PC: newPC,
          });
        }
      });

      setConnections((prev) => newConnections);
    });
  };

  const handleNewJoin = (userId: string) => {
    const currentConnectionsRef = collection(
      db,
      "room",
      roomId,
      "currentConnections"
    );

    return onSnapshot(currentConnectionsRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const newConnections: Connection[] = connections;

        const data = change.doc.data() as { userId: string };
        const type = change.type;

        if (type === "added" && data.userId !== userId) {
          const RTCsessionsRef = collection(db, "room", roomId, "RTCsessions");
          const newPC = new RTCPeerConnection(configuration);

          localStream?.getTracks().forEach((track) => {
            newPC.addTrack(track, localStream);
          });

          newPC.addEventListener("icecandidate", (e) => {
            if (e.candidate) {
              addDoc(
                collection(RTCsessionsRef, change.doc.id, "callerCandidates"),
                e.candidate.toJSON()
              );
            }
          });

          newPC.addEventListener("track", (e) => {
            const newStream = new MediaStream();
            e.streams[0].getTracks().forEach((track) => {
              newStream.addTrack(track);
            });

            setConnections((prev) => {
              const index = prev.findIndex(
                (connection) => connection.with === data.userId
              );

              if (index !== -1) {
                prev[index].stream = newStream;
              }

              return prev;
            });
          });

          const offer = await newPC.createOffer({});
          await newPC.setLocalDescription(offer);

          const sessionRef = doc(RTCsessionsRef, change.doc.id);

          await setDoc(
            sessionRef,
            { offer, connected: true, answerId: data.userId, offerId: userId },
            { merge: true }
          );

          onSnapshot(sessionRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && !newPC.remoteDescription && data.answer) {
              const rtcSessionDescription = new RTCSessionDescription(
                data.answer
              );
              newPC.setRemoteDescription(rtcSessionDescription);
            }
          });

          onSnapshot(
            collection(RTCsessionsRef, change.doc.id, "calleeCandidates"),
            (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  const data = change.doc.data();
                  newPC.addIceCandidate(new RTCIceCandidate(data));
                }
              });
            }
          );

          newConnections.push({
            stream: new MediaStream(),
            with: data.userId,
            PC: newPC,
          });
        } else if (type === "removed") {
          const connection = newConnections.find(
            (connection) => connection.with === data.userId
          );
          if (connection) {
            connection.PC.close();
            newConnections.splice(newConnections.indexOf(connection), 1);
          }
        }

        setConnections((prev) => newConnections);
      });
    });
  };

  const startJoin = async (userId: string) => {
    const currentConnectionsRef = collection(
      db,
      "room",
      roomId,
      "currentConnections"
    );
    onSnapshot(currentConnectionsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(`Document ${change.type}:`, change.doc.data());
      });
    });

    await addDoc(currentConnectionsRef, { userId });
  };

  const initSession = () => {
    if (!isLogin) return () => {};

    const roomRef = doc(db, "room", "c7df572b-f061-476a-b3c7-5157451f0e18");

    const roomUserUnSub = onSnapshot(
      roomRef,
      (doc) => setRoom(doc.data() as Room),
      handleError
    );

    const roomUserRef = collection(roomRef, "users");

    const roomUnSub = onSnapshot(
      roomUserRef,
      (snapshot) => {
        onRoomUserChange(
          setRoomUsers,
          roomUsers,
          snapshot.docChanges().map((change) => ({
            type: change.type,
            roomUser: change.doc.data() as RoomUser,
          }))
        );
      },
      handleError
    );

    return () => {
      roomUnSub();
      roomUserUnSub();
    };
  };

  useEffect(() => {
    if (!isLogin) return;
    const removeSessions = initSession();
    startLocalStream();

    return () => {
      removeSessions();
    };
  }, [isLogin]);

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="User1"
        onPress={async () => {
          await startJoin("320d0b8d-3612-43c5-b13d-66bc136eb717");
          const cancelNewJoin = handleNewJoin(
            "320d0b8d-3612-43c5-b13d-66bc136eb717"
          );
          const cancelHaveOffer = handleHaveOffer(
            "320d0b8d-3612-43c5-b13d-66bc136eb717"
          );
        }}
      />
      <Button
        title="User2"
        onPress={async () => {
          await startJoin("ebd5d406-56ea-42b2-8d01-df188d82bdde");
          const cancelNewJoin = handleNewJoin(
            "ebd5d406-56ea-42b2-8d01-df188d82bdde"
          );
          const cancelHaveOffer = handleHaveOffer(
            "ebd5d406-56ea-42b2-8d01-df188d82bdde"
          );
        }}
      />
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          {connections.map((connection) => (
            <RTCView
              key={connection.with}
              streamURL={connection.stream.toURL()}
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Allow items to wrap to the next row
  },
  gridItem: {
    flexBasis: "50%", // Each item takes up 50% of the width
  },
});

export default JoinScreen;
