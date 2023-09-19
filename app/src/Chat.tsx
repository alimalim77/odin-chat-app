import React, { useEffect, useState } from "react";
import "./App.css";

type ChatProps = {
  socket: any;
  username: string;
  room: string;
};

type MessageData = {
  message: string;
  room: string;
  author: string;
  time: string;
};

const Chat: React.FC<ChatProps> = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: MessageData = {
        message: currentMessage,
        room: room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    });
    // Remove the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Live Chat</h3>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent: MessageData) => (
          <div
            className="message"
            id={username === messageContent.author ? "you" : "other"}
          >
            <div>
              <div className="message-content">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-meta">
                <p>{messageContent.time}</p>
                <p>{messageContent.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
