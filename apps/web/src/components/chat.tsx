import React from "react";
import useChatStream from "@magicul/react-chat-stream";

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChatStream({
    options: {
      url: "http://127.0.0.1:8000/api/ai/chat/stream",
      method: "POST",
    },
    method: {
      type: "query",
      key: "prompt",
    }
  });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>
            <strong>{message.role}:</strong> {message.content}
          </p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your prompt..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatComponent;