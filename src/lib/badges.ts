import {
  Star, Shield, Brain, Wand2, Zap, Lightbulb,
  Bug, Rocket, Trophy, Flame, Crown, Gem,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BadgeDefinition {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  ring: string;
  textColor: string;
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: "star_of_session",
    name: "Star of the Session",
    tagline: "Shined brightest in class today",
    icon: Star,
    gradient: "from-yellow-300 via-amber-400 to-orange-400",
    glow: "shadow-amber-400/50",
    ring: "ring-amber-300/60",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "tutorial_hero",
    name: "Tutorial Hero",
    tagline: "Mastered every step of the tutorial",
    icon: Shield,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "shadow-violet-500/50",
    ring: "ring-violet-400/60",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "problem_solver",
    name: "Problem Solver",
    tagline: "Cracked the toughest challenges",
    icon: Brain,
    gradient: "from-blue-500 via-cyan-500 to-sky-400",
    glow: "shadow-blue-500/50",
    ring: "ring-blue-400/60",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "code_wizard",
    name: "Code Wizard",
    tagline: "Pure magic with every line of code",
    icon: Wand2,
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    glow: "shadow-indigo-500/50",
    ring: "ring-indigo-400/60",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "quick_learner",
    name: "Quick Learner",
    tagline: "Picks up new concepts at lightning speed",
    icon: Zap,
    gradient: "from-orange-400 via-amber-400 to-yellow-300",
    glow: "shadow-orange-400/50",
    ring: "ring-orange-300/60",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  {
    id: "creative_mind",
    name: "Creative Mind",
    tagline: "Brings unique ideas to every project",
    icon: Lightbulb,
    gradient: "from-pink-500 via-rose-400 to-pink-400",
    glow: "shadow-pink-500/50",
    ring: "ring-pink-400/60",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  {
    id: "bug_hunter",
    name: "Bug Hunter",
    tagline: "Finds and fixes bugs like a pro",
    icon: Bug,
    gradient: "from-emerald-500 via-teal-500 to-green-500",
    glow: "shadow-emerald-500/50",
    ring: "ring-emerald-400/60",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "first_steps",
    name: "First Steps",
    tagline: "Took the first brave leap into coding",
    icon: Rocket,
    gradient: "from-teal-400 via-cyan-500 to-blue-400",
    glow: "shadow-teal-400/50",
    ring: "ring-teal-300/60",
    textColor: "text-teal-700 dark:text-teal-300",
  },
  {
    id: "champion",
    name: "Champion",
    tagline: "Consistently outstanding performance",
    icon: Trophy,
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    glow: "shadow-yellow-500/50",
    ring: "ring-yellow-400/60",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "never_gives_up",
    name: "Never Gives Up",
    tagline: "Kept going when things got hard",
    icon: Flame,
    gradient: "from-red-500 via-orange-500 to-amber-400",
    glow: "shadow-red-500/50",
    ring: "ring-red-400/60",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    id: "top_of_class",
    name: "Top of Class",
    tagline: "The best student in the group today",
    icon: Crown,
    gradient: "from-amber-400 via-yellow-400 to-lime-400",
    glow: "shadow-amber-400/50",
    ring: "ring-amber-300/60",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "hidden_gem",
    name: "Hidden Gem",
    tagline: "Surprised everyone with a brilliant idea",
    icon: Gem,
    gradient: "from-cyan-400 via-blue-500 to-violet-500",
    glow: "shadow-cyan-400/50",
    ring: "ring-cyan-300/60",
    textColor: "text-cyan-700 dark:text-cyan-300",
  },
];

export function getBadge(idOrName: string): BadgeDefinition | undefined {
  return BADGE_CATALOG.find((b) => b.id === idOrName || b.name === idOrName);
}
