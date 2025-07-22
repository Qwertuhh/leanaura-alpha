import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { streamChatResponse } from "../api/chat";
import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";
import { Table } from "@/components/ui/table";
import type { Message } from "@/types";


// Custom hook to detect screen size for responsiveness
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

// --- Reusable Child Components ---

const ChatInput = ({ onSend }: { onSend: (input: string) => void }) => {
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
    <div className="flex-shrink-0 flex gap-2 p-4 border-t bg-background">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me something..."
        className="flex-1"
      />
      <Button onClick={handleSendClick} disabled={!input.trim()}>
        Send
      </Button>
    </div>
  );
};

const markdownComponents: Components = {
  // The ref is destructured and not used to avoid passing it down to SyntaxHighlighter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          style={oneDark as unknown as {[key: string]: CSSProperties}}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-muted dark:bg-muted/50 px-1 py-0.5 rounded" {...props}>
        {children}
      </code>
    );
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <Table className="table-auto border-collapse">{children}</Table>
      </div>
    );
  },
};

const ChatHistory = ({ messages }: { messages: Message[] }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 min-h-0 p-4">
      <div className="space-y-4 pr-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md max-w-full break-words ${
              msg.role === "user"
                ? "bg-blue-50 dark:bg-stone-900"
                : "bg-gray-100 dark:bg-stone-800"
            }`}
          >
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {msg.content}
            </Markdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

const ChatPanel = ({ messages, onSend }: { messages: Message[]; onSend: (input: string) => void }) => (
  <div className="flex flex-col h-full w-full bg-background border rounded-lg overflow-hidden">
    <ChatHistory messages={messages} />
    <ChatInput onSend={onSend} />
  </div>
);

// --- Main Application Component ---



const ChatApp: React.FC = () => {
  const [isChatOpen, setChatOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (input: string) => {
    const newUserMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, newUserMessage]);

    let assistantContent = "";
    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      await streamChatResponse(input, (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = { ...updatedHistory[updatedHistory.length - 1], content: assistantContent };
          return updatedHistory;
        });
      });
    } catch {
      const errorContent = "⚠️ Error getting response. Try again.";
        setMessages(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = { ...updatedHistory[updatedHistory.length - 1], content: errorContent };
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
          <div className="fixed inset-0 z-50 bg-background">
            <div className="relative h-full w-full">
              <ChatPanel messages={messages} onSend={handleSend} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setChatOpen(false)}
              >
                <XIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop view
  return <ChatPanel messages={messages} onSend={handleSend} />;
};

export default ChatApp;
