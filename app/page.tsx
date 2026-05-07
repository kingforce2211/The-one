"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message, SkillProfileData } from "@/lib/types";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import SkillProfile from "@/components/SkillProfile";

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm Unlock — your personal skills discovery guide.\n\nI'm going to ask you some questions to help you uncover the full depth of your unique skills, talents, and abilities — including the ones you might be taking for granted.\n\nAt the end, I'll generate your personal Skill Profile showing exactly how AI can amplify what makes you special.\n\nReady to begin? Tell me a little about yourself — what do you spend most of your time doing these days?",
};

type Phase = "chat" | "generating" | "profile";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("chat");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [profile, setProfile] = useState<SkillProfileData | null>(null);
  const [readyForProfile, setReadyForProfile] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const generateProfile = useCallback(async (msgs: Message[]) => {
    setPhase("generating");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setPhase("profile");
      }
    } catch {
      setPhase("chat");
    }
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }

      const finalMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: assistantText },
      ];

      if (assistantText.includes("[READY_FOR_PROFILE]")) {
        setReadyForProfile(true);
      }

      setMessages(finalMessages);
      setIsStreaming(false);
    } catch {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const handleRestart = () => {
    setMessages([WELCOME_MESSAGE]);
    setPhase("chat");
    setProfile(null);
    setReadyForProfile(false);
    setInput("");
  };

  if (phase === "generating") {
    return <GeneratingScreen />;
  }

  if (phase === "profile" && profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--background)",
          overflowY: "auto",
        }}
      >
        <SkillProfile profile={profile} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(15,15,19,0.8)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
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
          }}
        >
          ✦
        </div>
        <div>
          <div
            style={{ fontWeight: 700, fontSize: 15, color: "var(--foreground)" }}
          >
            Unlock
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            AI Skills Discovery
          </div>
        </div>
        {messages.length > 3 && (
          <div
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            {Math.floor((messages.length - 1) / 2)} exchanges
          </div>
        )}
      </header>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 720,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isLatest={i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}
        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <TypingIndicator />
        )}

        {readyForProfile && !isStreaming && (
          <div
            className="message-enter"
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 8,
            }}
          >
            <button
              onClick={() => generateProfile(messages)}
              className="btn-glow"
              style={{
                background: "linear-gradient(135deg, var(--accent), #6366f1)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ✦ Generate My Skill Profile
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "16px",
          background: "rgba(15,15,19,0.9)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts..."
            rows={1}
            style={{
              flex: 1,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "12px 16px",
              fontSize: 15,
              color: "var(--foreground)",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              fontFamily: "inherit",
              overflowY: "hidden",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--border)")
            }
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background:
                !input.trim() || isStreaming
                  ? "var(--surface)"
                  : "linear-gradient(135deg, var(--accent), #6366f1)",
              border: "1px solid var(--border)",
              color:
                !input.trim() || isStreaming ? "var(--muted)" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: !input.trim() || isStreaming ? "not-allowed" : "pointer",
              fontSize: 18,
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            ↑
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--muted)",
            marginTop: 8,
            opacity: 0.6,
          }}
        >
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function GeneratingScreen() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        gap: 24,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), #a78bfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          boxShadow: "0 0 40px var(--accent-glow)",
          animation: "glow-pulse 1.5s ease-in-out infinite",
        }}
      >
        ✦
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: 8,
          }}
        >
          Building your Skill Profile...
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>
          Analyzing your conversation to uncover your unique potential
        </div>
      </div>
    </div>
  );
}
