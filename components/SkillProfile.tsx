"use client";

import { SkillProfileData } from "@/lib/types";

const difficultyColor: Record<string, string> = {
  Beginner: "#4ade80",
  Intermediate: "#facc15",
  Advanced: "#f87171",
};

interface Props {
  profile: SkillProfileData;
  onRestart: () => void;
}

export default function SkillProfile({ profile, onRestart }: Props) {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 24px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
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
            margin: "0 auto 16px",
            boxShadow: "0 0 32px var(--accent-glow)",
          }}
        >
          ✦
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: 8,
          }}
        >
          {profile.name}&apos;s Skill Profile
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {profile.headline}
        </p>
      </div>

      {/* Core Skills */}
      <Section title="Core Skills" icon="⚡">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {profile.coreSkills.map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--accent)",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {s.skill}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
                {s.evidence}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Hidden Strengths */}
      <Section title="Hidden Strengths" icon="💎">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {profile.hiddenStrengths.map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: 6,
                }}
              >
                {s.strength}
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
                {s.insight}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI Opportunities */}
      <Section title="Where AI Unlocks Your Potential" icon="🚀">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {profile.aiOpportunities.map((o, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--accent)",
                borderRadius: 12,
                padding: "18px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg, var(--accent), #a78bfa)",
                }}
              />
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: 8,
                  fontSize: 16,
                }}
              >
                {o.title}
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  margin: "0 0 10px",
                  lineHeight: 1.6,
                }}
              >
                {o.description}
              </p>
              <div
                style={{
                  background: "rgba(124,107,255,0.1)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 13,
                  color: "var(--accent)",
                }}
              >
                <span style={{ fontWeight: 600 }}>Try this:</span> {o.example}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Suggested Projects */}
      <Section title="Projects to Start Today" icon="🛠️">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {profile.suggestedProjects.map((p, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{ fontWeight: 600, color: "var(--foreground)" }}
              >
                {p.title}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                {p.description}
              </p>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: difficultyColor[p.difficulty] || "var(--muted)",
                  alignSelf: "flex-start",
                }}
              >
                {p.difficulty}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Affirmation */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--surface), var(--surface-2))",
          border: "1px solid var(--accent)",
          borderRadius: 16,
          padding: "24px",
          textAlign: "center",
          boxShadow: "0 0 32px var(--accent-glow)",
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 12 }}>✨</div>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {profile.affirmation}
        </p>
      </div>

      {/* Restart */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={onRestart}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            borderRadius: 10,
            padding: "10px 24px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Start a new discovery session
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--foreground)",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}
