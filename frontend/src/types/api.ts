export type UserRole = "PARENT" | "TEACHER" | "CURRICULUM_ADMIN";

export interface ChildProfile {
  id: number;
  name: string;
  avatar_code?: string;
  birth_year: number;
  stars_balance: number;
  current_level: number;
  classroom_name?: string | null;
  mascot_equipped?: {
    hat: string | null;
    glasses: string | null;
    shirt: string | null;
  };
}

export interface LearningNode {
  id: number;
  area: "HUTAN_HURUF" | "BUKIT_ANGKA" | "SUNGAI_KATA" | "GUA_TAMBAH";
  title: string;
  story_intro: string;
  order_index: number;
  is_boss_challenge: boolean;
  reward_stars: number;
  is_completed: boolean;
  stars_earned: number;
}

export interface QuizQuestion {
  item_key: string;
  question_type: "CHOICE" | "VISUAL_COUNT" | "SYLLABLE_BUILD";
  prompt: string;
  speak_text?: string;
  options: string[];
  answer: string;
  syllables?: string[];
  visual?: {
    item: "APPLE" | "ORANGE" | "CRYSTAL";
    count: number;
  } | null;
  mode: "NORMAL" | "TEACH_KIKO";
}

export interface ParentDashboardData {
  child: {
    id: number;
    name: string;
    stars_balance: number;
    current_level: number;
  };
  streak: {
    flower_chain_count: number;
    rest_day_available: boolean;
    is_garden_sleeping: boolean;
    today_minutes_spent: number;
    should_rest_now: boolean;
  };
  area_progress: {
    area: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
  weekly_chart: {
    date: string;
    minutes: number;
    status: string;
  }[];
  review_items: {
    item_key: string;
    mastery_score: number;
  }[];
  stickers_summary: {
    owned: number;
    total: number;
  };
  missions: {
    id: number;
    mission_type: "WEEKLY_FAMILY_MISSION" | "REAL_WORLD_REWARD";
    title: string;
    target_stars: number;
    is_completed: boolean;
  }[];
}