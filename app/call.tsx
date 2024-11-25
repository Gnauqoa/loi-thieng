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

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

interface CallScreenProps {
  roomId: string;
  screens: { ROOM: string; [key: string]: string };
  setScreen: (screen: string) => void;
}

export default function CallScreen({
  roomId,
  screens,
  setScreen,
}: CallScreenProps): JSX.Element {
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
    if (localStream && roomId) {
      startCall(roomId);
    }
  }, [localStream, roomId]);

  const endCall = async () => {
    if (cachedLocalPC) {
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    const roomRef = doc(db, "room", roomId);
    await updateDoc(roomRef, { answer: deleteField() });

    setLocalStream(null);
    setRemoteStream(null);
    setCachedLocalPC(null);

    setScreen(screens.ROOM); // Go back to room screen
  };

  const startLocalStream = async () => {
    const isFront = true;
    const devices =
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

  const startCall = async (id: string) => {
    const localPC = new RTCPeerConnection(configuration);
    localStream?.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const roomRef = doc(db, "room", id);

    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    localPC.addEventListener("icecandidate", async (e) => {
      if (e.candidate) {
        addDoc(callerCandidatesCollection, e.candidate.toJSON());
      }
    });

    localPC.addEventListener("track", (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    });

    const offer = await localPC.createOffer({});
    await localPC.setLocalDescription(offer);
    await setDoc(roomRef, { offer, connected: false }, { merge: true });

    onSnapshot(roomRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && !localPC.remoteDescription && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        localPC.setRemoteDescription(rtcSessionDescription);
      }
    });

    onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPC(localPC);
  };

  const switchCamera = () => {
    localStream
      ?.getVideoTracks()
      .forEach((track) => (track as any)._switchCamera());
  };

  const toggleMute = () => {
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
    <View style={{ flex: 1, backgroundColor: "red" }}>
      {!remoteStream ? (
        <RTCView
          style={{ flex: 1 }}
          streamURL={localStream?.toURL() || ""}
          objectFit="cover"
        />
      ) : (
        <>
          <RTCView
            style={{ flex: 1 }}
            streamURL={remoteStream?.toURL() || ""}
            objectFit="cover"
          />
          {!isOffCam && (
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
        </>
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
