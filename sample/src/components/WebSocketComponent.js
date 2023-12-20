import React, { useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  // Replace 'ws://localhost:8000/ws/update-data/' with your actual WebSocket URL
  const socket = new WebSocket('ws://localhost:8000/ws/update-data/');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const serverResponse = data.message;
    setResponse(serverResponse);
  };

  const sendMessage = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message }));
    }
  };

  return (
    <div>
      <label>
        Message:
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button onClick={sendMessage}>Send Message</button>
      <div>Server Response: {response}</div>
    </div>
  );
};

export default WebSocketComponent;
