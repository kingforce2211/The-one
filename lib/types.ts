export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface CoreSkill {
  skill: string;
  evidence: string;
}

export interface HiddenStrength {
  strength: string;
  insight: string;
}

export interface AiOpportunity {
  title: string;
  description: string;
  example: string;
}

export interface SuggestedProject {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface SkillProfileData {
  name: string;
  headline: string;
  coreSkills: CoreSkill[];
  hiddenStrengths: HiddenStrength[];
  aiOpportunities: AiOpportunity[];
  suggestedProjects: SuggestedProject[];
  affirmation: string;
}
