"use client";

import { Message } from "@/lib/types";

interface Props {
  message: Message;
  isLatest?: boolean;
}

export default function MessageBubble({ message, isLatest }: Props) {
  const isUser = message.role === "user";

  const displayContent = message.content
    .replace(/\*\*\[READY_FOR_PROFILE\]\*\*/, "")
    .replace(/\[READY_FOR_PROFILE\]/, "")
    .trim();

  return (
    <div
      className={`flex items-end gap-3 message-enter ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          ✦
        </div>
      )}
      <div
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: isUser
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, var(--accent), #6366f1)"
            : "var(--surface)",
          border: isUser ? "none" : "1px solid var(--border)",
          color: "var(--foreground)",
          fontSize: 15,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          boxShadow: isLatest && !isUser
            ? "0 0 0 1px var(--accent-glow)"
            : "none",
        }}
      >
        {displayContent}
      </div>
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}
