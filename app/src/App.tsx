import "./App.css";
import { io, Socket } from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket: Socket = io("http://localhost:3001");

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="login">
          <h3>Join a chat</h3>
          <input
            type="text"
            placeholder="User"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Join a room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default App;
