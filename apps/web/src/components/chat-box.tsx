import React, { useState } from "react";
import { streamChatResponse } from "../api/chat";

const ChatBox: React.FC = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    setResponse(""); // Reset previous response
    try {
      await streamChatResponse(input, (chunk) => {
        setResponse((prev) => prev + chunk);
      });
    } catch (error) {
      console.error("Streaming error:", error);
    }
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
      <div>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default ChatBox;
