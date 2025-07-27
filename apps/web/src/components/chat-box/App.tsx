import React, {useState} from "react";
import {streamChatResponse} from "@/api/chat";

import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {XIcon} from "lucide-react";
import type {Message} from "@/types";
import ChatInput from "@/components/chat-box/chat-input.tsx";
import ChatHistory from "@/components/chat-box/chat-history.tsx";
import {useIsMobile} from "@/hooks/use-mobile.ts";
import defaultHistory from "@/assets/default_chat_history.txt";


const ChatPanel = ({messages, onSend}: { messages: Message[]; onSend: (input: string) => void }) => (
    <div className="flex flex-col h-full w-full bg-background border">
        <ScrollArea className="m-2 flex-1">
            <ChatHistory messages={messages}/>
        </ScrollArea>
        <ChatInput onSend={onSend}/>
    </div>
);


const ChatApp: React.FC = () => {
    const [isChatOpen, setChatOpen] = useState(false);
    const isMobile = useIsMobile();

    const [messages, setMessages] = useState<Message[]>([{role: "assistant", content: defaultHistory}]);

    const handleSend = async (input: string) => {
        const newUserMessage: Message = {role: "user", content: input};
        setMessages(prev => [...prev, newUserMessage]);

        let assistantContent = "";
        const assistantMessage: Message = {role: "assistant", content: ""};
        setMessages(prev => [...prev, assistantMessage]);

        try {
            await streamChatResponse(input, (chunk) => {
                assistantContent += chunk;
                setMessages(prev => {
                    const updatedHistory = [...prev];
                    updatedHistory[updatedHistory.length - 1] = {
                        ...updatedHistory[updatedHistory.length - 1],
                        content: assistantContent
                    };
                    return updatedHistory;
                });
            });
        } catch {
            const errorContent = "⚠️ Error getting response. Try again.";
            setMessages(prev => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1] = {
                    ...updatedHistory[updatedHistory.length - 1],
                    content: errorContent
                };
                return updatedHistory;
            });
        }
    };

    // Responsive rendering logic
    if (isMobile) {
        return (
            <>
                <div className="p-4">
                    <Button onClick={() => setChatOpen(true)} className="w-full">
                        Open Chat
                    </Button>
                </div>
                {isChatOpen && (
                    <div className="fixed inset-0 z-50 bg-background  w-[var(--component-height)]">
                        <div className="relative h-full w-full">
                            <ChatPanel messages={messages} onSend={handleSend}/>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={() => setChatOpen(false)}
                            >
                                <XIcon className="h-6 w-6"/>
                            </Button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Desktop view
    return <ChatPanel messages={messages} onSend={handleSend}/>;
};

export default ChatApp;
