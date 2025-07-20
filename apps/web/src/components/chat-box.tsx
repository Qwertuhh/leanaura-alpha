import React, { useEffect, useRef, useState } from "react";
import { streamChatResponse } from "../api/chat";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ChatApp: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when new message added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Placeholder for assistant
    let assistantContent = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      await streamChatResponse(input, (chunk) => {
        assistantContent += chunk;
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1
              ? { ...msg, content: assistantContent }
              : msg
          )
        );
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "⚠️ Error getting response. Try again.",
        },
      ]);
    } finally {
      setInput("");
    }
  };

  return (
    <Card className="h-full w-full p-4 space-y-4 m-2">
      <ScrollArea className="h-[75vh] whitespace-nowrap">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md ${
                msg.role === "user"
                  ? "bg-blue-50 dark:bg-stone-900"
                  : "bg-gray-100 dark:bg-stone-800"
              }`}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-muted dark:bg-muted/50 px-1 py-0.5 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.content}
              </Markdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim()}>
          Send
        </Button>
      </div>
    </Card>
  );
};

export default ChatApp;