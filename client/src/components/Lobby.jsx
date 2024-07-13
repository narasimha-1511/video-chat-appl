import React, { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketConext";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("join-room", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    ({ email, room }) => {
      console.log("joined room", email, room);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("join-room", handleJoinRoom);
    return () => {
      socket.off("join-room", handleJoinRoom);
    };
  }, [socket]);

  return (
    <div className="lobby">
      <h1>Lobby</h1>
      <div>
        <form className="formInput" onSubmit={handleSubmit}>
          <div className="item">
            <label htmlFor="email"> Name</label>
            <input
              type="name"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="item">
            <label htmlFor="room"> Room ID</label>
            <input
              type="text"
              id="room"
              name="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="btn" style={{ width: "60px" }}>
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LobbyScreen;
