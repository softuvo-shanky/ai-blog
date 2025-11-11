export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  gradient: string;
};

export const CATEGORIES: Record<string, Category> = {
  "machine-learning": {
    id: "machine-learning",
    name: "Machine Learning",
    description: "Deep learning, neural networks, and ML algorithms",
    color: "#3b82f6",
    gradient: "from-blue-500 to-cyan-500",
  },
  "natural-language": {
    id: "natural-language",
    name: "Natural Language",
    description: "NLP, language models, and text processing",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-500",
  },
  "computer-vision": {
    id: "computer-vision",
    name: "Computer Vision",
    description: "Image recognition, video analysis, and visual AI",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
  },
  robotics: {
    id: "robotics",
    name: "Robotics",
    description: "Autonomous systems, robotics, and automation",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
  },
  ethics: {
    id: "ethics",
    name: "AI Ethics",
    description: "Ethics, policy, safety, and responsible AI",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-500",
  },
  research: {
    id: "research",
    name: "Research",
    description: "Academic research, papers, and breakthroughs",
    color: "#6366f1",
    gradient: "from-indigo-500 to-blue-500",
  },
  applications: {
    id: "applications",
    name: "Applications",
    description: "Real-world AI applications and use cases",
    color: "#14b8a6",
    gradient: "from-teal-500 to-cyan-500",
  },
  general: {
    id: "general",
    name: "General AI",
    description: "General AI news and updates",
    color: "#64748b",
    gradient: "from-slate-500 to-gray-500",
  },
};

export const DEFAULT_CATEGORY = "general";

export function getCategoryById(id: string): Category {
  return CATEGORIES[id] || CATEGORIES[DEFAULT_CATEGORY];
}

export function getAllCategoryIds(): string[] {
  return Object.keys(CATEGORIES);
}

export function getAllCategories(): Category[] {
  return Object.values(CATEGORIES);
}

export function assignCategoryFromTags(tags: string[]): string {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  // Machine Learning
  if (
    tagSet.has("machine-learning") ||
    tagSet.has("deep-learning") ||
    tagSet.has("neural-networks") ||
    tagSet.has("ml") ||
    tagSet.has("training") ||
    tagSet.has("models")
  ) {
    return "machine-learning";
  }

  // Natural Language
  if (
    tagSet.has("nlp") ||
    tagSet.has("natural-language") ||
    tagSet.has("language-models") ||
    tagSet.has("gpt") ||
    tagSet.has("llm") ||
    tagSet.has("chatbot") ||
    tagSet.has("text-generation")
  ) {
    return "natural-language";
  }

  // Computer Vision
  if (
    tagSet.has("computer-vision") ||
    tagSet.has("image-recognition") ||
    tagSet.has("object-detection") ||
    tagSet.has("video-analysis") ||
    tagSet.has("visual-ai") ||
    tagSet.has("image-processing")
  ) {
    return "computer-vision";
  }

  // Robotics
  if (
    tagSet.has("robotics") ||
    tagSet.has("autonomous-systems") ||
    tagSet.has("automation") ||
    tagSet.has("drones") ||
    tagSet.has("self-driving")
  ) {
    return "robotics";
  }

  // Ethics
  if (
    tagSet.has("ethics") ||
    tagSet.has("ai-safety") ||
    tagSet.has("policy") ||
    tagSet.has("regulation") ||
    tagSet.has("bias") ||
    tagSet.has("fairness") ||
    tagSet.has("responsible-ai")
  ) {
    return "ethics";
  }

  // Research
  if (
    tagSet.has("research") ||
    tagSet.has("academic") ||
    tagSet.has("paper") ||
    tagSet.has("breakthrough") ||
    tagSet.has("study")
  ) {
    return "research";
  }

  // Applications
  if (
    tagSet.has("applications") ||
    tagSet.has("use-cases") ||
    tagSet.has("industry") ||
    tagSet.has("business") ||
    tagSet.has("healthcare") ||
    tagSet.has("finance")
  ) {
    return "applications";
  }

  return DEFAULT_CATEGORY;
}
