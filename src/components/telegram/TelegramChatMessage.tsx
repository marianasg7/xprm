
import React from "react";

interface TelegramChatMessageProps {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

export const TelegramChatMessage: React.FC<TelegramChatMessageProps> = ({
  id,
  text,
  sender,
  timestamp,
}) => {
  return (
    <div key={id} className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          sender === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p>{text}</p>
        <p className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
};
