import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import CreateHabit from "./create-habit";
import HabitDetailsSheet from "./habit-details-sheet";
import DeleteHabitSheet from "./delete-habit-sheet";
import HideHabitSheet from "./hide-habit-sheet";
import HabitFilterSheet from "./habit-filter-sheet";

type HabitDetailsProp = {
  id: string;
  habit_name: string;
  category: string;
  reminder_time: string;
  frequency: number[];
  habit_color: string;
  created_at: string;
  archived: boolean;
};

registerSheet("create-habit", CreateHabit);
registerSheet("habit-details", HabitDetailsSheet);
registerSheet("delete-habit", DeleteHabitSheet);
registerSheet("hide-habit", HideHabitSheet);
registerSheet("habit-filter", HabitFilterSheet);

// Extend types for better intellisense
declare module "react-native-actions-sheet" {
  interface Sheets {
    // "example-sheet": SheetDefinition;
    "create-habit": SheetDefinition;
    "habit-details": SheetDefinition<{
      payload: { data: HabitDetailsProp };
    }>;
    "delete-habit": SheetDefinition<{
      payload: { data: HabitDetailsProp };
    }>;
    "hide-habit": SheetDefinition<{
      payload: { habitId: string; updateStatus: (status: boolean) => void };
    }>;
    "habit-filter": SheetDefinition<{
      payload: {
        selectedFilter: "latest" | "alphabetical";
        setSelectedFilter: (filter: "latest" | "alphabetical") => void;
      };
    }>;
  }
}
