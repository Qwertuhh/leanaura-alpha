import type {Message} from "@/types";
import {useEffect, useMemo, useRef} from "react";
import MarkdownPreview from "@/components/markdown-preview.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import defaultHistory from "@/const/defaultHistory";

interface ChatHistoryProps {
  messages: Message[];
}

/**
 * Renders a list of chat messages with automatic scrolling to the latest message.
 * 
 * @note This component handles the display of chat messages and automatically scrolls
 *       to the bottom when new messages are added. It uses MarkdownPreview for rendering
 *       message content with proper styling based on the message role (user/assistant).
 * 
 *       - User messages are displayed with a blue background and light text
 *       - Assistant messages are displayed with a gray background and dark text
 * 
 * @component
 */
function ChatHistory({ messages }: ChatHistoryProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messageCompleteHistory = useMemo(() => {
        return  messages.length > 0 ? messages : [{role: "assistant", content: defaultHistory}];
    }, [messages]);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
    }, [messageCompleteHistory]);

    return (
        <ScrollArea>
            <div className="space-y-4 pr-4">
                {messageCompleteHistory.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`message p-3 rounded-md max-w-full break-words ${
                            msg.role === "user"
                                ? "bg-blue-50 dark:bg-stone-900"
                                : "bg-gray-100 dark:bg-stone-800"
                        }`}
                    >
                        <MarkdownPreview content={msg.content}/>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    );
}
export default ChatHistory;