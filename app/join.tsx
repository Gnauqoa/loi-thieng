import React, { useState, useEffect } from "react";
import { View } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import { db } from "../firebase";
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

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

interface JoinScreenProps {
  roomId: string;
  screens: { ROOM: string; [key: string]: string };
  setScreen: (screen: string) => void;
}

export default function JoinScreen({
  roomId,
  screens,
  setScreen,
}: JoinScreenProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection | null>(
    null
  );

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOffCam, setIsOffCam] = useState<boolean>(false);

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (localStream) {
      joinCall(roomId);
    }
  }, [localStream]);

  const endCall = async () => {
    if (cachedLocalPC) {
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    const roomRef = doc(db, "room", roomId);
    await updateDoc(roomRef, { answer: deleteField(), connected: false });

    setLocalStream(null);
    setRemoteStream(null);
    setCachedLocalPC(null);
    setScreen(screens.ROOM);
  };

  const startLocalStream = async () => {
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

    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const joinCall = async (id: string) => {
    const roomRef = doc(db, "room", id);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists()) return;

    const localPC = new RTCPeerConnection(configuration);

    localStream?.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (e.candidate) {
        addDoc(calleeCandidatesCollection, e.candidate.toJSON());
      }
    });

    localPC.addEventListener("track", (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    });

    const offer = roomSnapshot.data()?.offer;
    if (!offer) return;

    await localPC.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    await updateDoc(roomRef, { answer, connected: true });

    onSnapshot(callerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (!data?.answer) {
        setScreen(screens.ROOM);
      }
    });

    setCachedLocalPC(localPC);
  };

  const switchCamera = () => {
    localStream?.getVideoTracks().forEach((track) => track._switchCamera());
  };

  const toggleMute = () => {
    if (!remoteStream) return;
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!track.enabled);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <RTCView
        style={{ flex: 1 }}
        streamURL={remoteStream?.toURL() || ""}
        objectFit={"cover"}
      />

      {remoteStream && !isOffCam && (
        <RTCView
          style={{
            width: 128,
            height: 192,
            position: "absolute",
            right: 24,
            top: 32,
          }}
          streamURL={localStream?.toURL() || ""}
        />
      )}

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        {/* <CallActionBox
          switchCamera={switchCamera}
          toggleMute={toggleMute}
          toggleCamera={toggleCamera}
          endCall={endCall}
        /> */}
      </View>
    </View>
  );
}
