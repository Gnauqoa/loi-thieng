export type Room = {
  id: string;
  authorId: string;
  name: string;
  description: string;
};

export type RoomUser = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type RoomStream = {
  userId: string;
  rtcSessionDescription: RTCSessionDescription;
  candidates: RTCIceCandidate[];
};