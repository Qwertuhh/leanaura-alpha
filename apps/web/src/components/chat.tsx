function ChatComponent() {
    return (
        <div>
            <p>Chat</p>
        </div>
    );
}
// import React from "react";
// import useChatStream from "@magicul/react-chat-stream";

// function ChatComponent() {
//   const { messages, input, handleInputChange, handleSubmit } = useChatStream({
//     options: {
//       url: "http://127.0.0.1:8000/api/ai/chat/stream",
//       method: "POST",
//     }
//   });

//   return (
//     <div>
//       {messages.map((message, index) => (
//         <div key={message.id}>
//           <p>
//             {message.role}: {message.content}
//           </p>
//         </div>
//       ))}
//       <form onSubmit={handleSubmit}>
//         <input type="text" onChange={handleInputChange} value={input} />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }

export default ChatComponent;