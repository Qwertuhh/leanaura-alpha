interface Message {
    role: "user" | "assistant";
    content: string;
}

export type {Message};
