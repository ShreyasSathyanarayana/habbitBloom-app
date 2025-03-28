import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import CreateHabit from "./create-habit";
import HabitDetailsSheet from "./habit-details-sheet";
import DeleteHabitSheet from "./delete-habit-sheet";

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
  }
}
