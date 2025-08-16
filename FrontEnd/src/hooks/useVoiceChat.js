import { useEffect, useRef } from "react";

export default function useVoiceChat(socketRef, roomId) {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" } // Google STUN server
      ]
    };

    async function initCall() {
      peerConnectionRef.current = new RTCPeerConnection(config);

      // Get local audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioRef.current.srcObject = stream;
      stream.getTracks().forEach(track =>
        peerConnectionRef.current.addTrack(track, stream)
      );

      // Remote audio
      peerConnectionRef.current.ontrack = (event) => {
        remoteAudioRef.current.srcObject = event.streams[0];
      };

      // ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { roomId, candidate: event.candidate });
        }
      };
    }

    socket.on("offer", async ({ sdp }) => {
      await initCall();
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, sdp: answer });
    });

    socket.on("answer", async ({ sdp }) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("iceCandidate", async ({ candidate }) => {
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ice candidate:", err);
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [socketRef, roomId]);

  // Function to start call
  const startCall = async () => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection();
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socketRef.current.emit("offer", { roomId, sdp: offer });
  };

  return { localAudioRef, remoteAudioRef, startCall };
}
