import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [friend, setFriend] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const navigate = useNavigate();

  const handleUserJoined = ({ email, id }) => {
    console.log("user joined", email, id);
    setFriend(email);
    setRemoteSocketId(id);
  };

  const handleIncomingCall = useCallback(
    async ({ offer, from }) => {
      console.log("incoming call", offer, from);
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyStream(stream);

      const answer = await peer.getAnswer(offer);

      socket.emit("call-accepted", { answer, to: from });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);



  const handleNegotoationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer-negotiation-needed", {
      offer: offer,
      to: remoteSocketId,
    });
  }, [socket, remoteSocketId]);

  const handleNegotoationIncoming = useCallback(
    async ({ offer, from }) => {
      console.log("peer negotiation needed", offer, from);
      setRemoteSocketId(from);

      const answer = await peer.getAnswer(offer);
      socket.emit("peer-negotiation-done", { answer, to: from });
    },
    [socket]
  );

  const handleNegotoationFinal = useCallback(async ({ answer, from }) => {
    console.log("peer negotiation final", answer, from);
    await peer.setremoteDescription(answer);
  }, []);

  //this is to reconnect the stream when the user joins the room
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotoationNeeded);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotoationNeeded
      );
    };
  }, [handleNegotoationNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (e) => {
      console.log("track", e.streams);
      setRemoteStream(e.streams[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incomming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("peer-negotiation-needed", handleNegotoationIncoming);
    socket.on("peer-negotiation-final", handleNegotoationFinal);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incomming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("peer-negotiation-needed", handleNegotoationIncoming);
      socket.off("peer-negotiation-final", handleNegotoationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotoationIncoming,
    handleNegotoationFinal,
  ]);

  const hanldeCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const offer = await peer.getOffer();
    socket.emit("call-user", { offer: offer, to: remoteSocketId });

    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleCallAccepted = useCallback(
    async ({ answer, from }) => {
      console.log("call accepted", answer, from);
      sendStreams();
      await peer.setremoteDescription(answer);
    },
    [sendStreams]
  );

  const handleLeaveRoom = useCallback(() => {
    //stop all the tracks

    setFriend(null);
    setRemoteSocketId(null);
    setMyStream(null);
    setRemoteStream(null);

    peer.peer.close();
    navigate(-1);

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
  }, [navigate]);

  return (
    <div>
      <h1>Room </h1>
      <h3>
        {" "}
        {remoteSocketId
          ? `You are connected to : ${friend}`
          : "No One in This room , Invite your Friends"}
      </h3>
      {remoteSocketId && (
        <button onClick={hanldeCallUser}> Start Video Call</button>
      )}
      {remoteSocketId && (
        <button onClick={sendStreams}>Accept Video Call</button>
      )}
      {myStream ? <h1> Video Call Started</h1> : ""}
      <div className="videos">
        {myStream && (
          <ReactPlayer className="videoPlayer" url={myStream} playing muted />
        )}
        {remoteStream && (
          <ReactPlayer className="videoPlayer" url={remoteStream} playing />
        )}
      </div>
      <div>
        <button onClick={handleLeaveRoom}>Leave Room</button>
      </div>
    </div>
  );
};

export default Room;
