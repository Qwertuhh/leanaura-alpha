import React, {useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";

function ChatInput  ({ onSend }: { onSend: (input: string) => void }) {
    const [input, setInput] = useState("");

    const handleSendClick = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    return (
        <div className="flex-shrink-0 flex gap-2 p-4 border-t bg-background justify-center items-center">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me something..."
                className="flex-1 resize-none h-10 outline-none"
            />
            <Button onClick={handleSendClick} disabled={!input.trim()} className="h-10">
                Send
            </Button>
        </div>
    );
}

export default ChatInput