import React, { useState, useCallback, useEffect } from "react";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = () => {
    console.log("Email: ", email);
    console.log("Room: ", room);
    console.log("Joining room...");
  }


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
