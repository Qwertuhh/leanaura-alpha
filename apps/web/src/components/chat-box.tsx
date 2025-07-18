
import ChatComponent from "@/components/chat.tsx";

function ChatBox() {
    return (
        <div className="fixed right-2 top-1/2 transform -translate-y-1/2" style={{ zIndex: 99 }}>
            <ChatComponent />
        </div>
    );
}

export default ChatBox;