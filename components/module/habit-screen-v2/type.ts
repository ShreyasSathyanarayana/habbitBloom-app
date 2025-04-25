import { SharedValue } from "react-native-reanimated";
import { HabitProgressEntry } from "@/api/api";

export type HabitListProps = {
  scrollY: SharedValue<number>;
  habitList?: HabitCardProp[];
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onScrollEnd: () => void;
  isNextPageAvailable: boolean;
  isFetchingNextPage: boolean;
};

export type HabitStats = {
  completed: number;
  notCompleted: number;
  streak: number;
  highestStreak: number;
};
export type HabitCardProp = {
  id: string;
  habit_name: string;
  category: string;
  reminder_time: string;
  frequency: number[];
  habit_color: string;
  created_at: string;
  archived: boolean;
  progress: HabitProgressEntry[];
  public: boolean;
  stats: HabitStats;
};
