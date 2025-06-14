import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import CreateHabit from "./habit-screen/create-habit";
import HabitDetailsSheet from "./habit-screen/habit-details-sheet";
import DeleteHabitSheet from "./habit-screen/delete-habit-sheet";
import HideHabitSheet from "./habit-screen/hide-habit-sheet";
import HabitFilterSheet from "./habit-screen/habit-filter-sheet";
import UpdateProfileInfoSheet from "./profile/update-profile-info-sheet";
import ProfilePicSheet from "./profile/profile-pic-sheet";
import DeleteProfilePicSheet from "./profile/delete-profile-pic-sheet";
import SupportAndFeedbackSheet from "./profile/support-and-feedback-sheet";
import ChangePasswordSheet from "./profile/change-password-sheet";
import AboutUsSheet from "./profile/about-us-sheet";
import MarkedHabitSheet from "./habit-screen/marked-habit-sheet";
import RewardSheet from "./analytics/reward-sheet";
import HabitLimitSheet from "./habit-screen/habit-limit-sheet";
import ExitConfirmationSheet from "./create-or-edit-post/exit-confirmation-sheet";
import MoreOptionSheet from "./insights/more-option-sheet";
import { PostWithDetails } from "@/api/api";
import DeletePostSheet from "./insights/delete-post-sheet";
import CommentPostSheet from "./insights/comment-post-sheet";

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
registerSheet("marked-habit", MarkedHabitSheet);
registerSheet("habit-limit", HabitLimitSheet);
registerSheet("update-profile-info", UpdateProfileInfoSheet);
registerSheet("profile-pic", ProfilePicSheet);
registerSheet("delete-profile-pic", DeleteProfilePicSheet);
registerSheet("support-and-feedback", SupportAndFeedbackSheet);
registerSheet("change-password", ChangePasswordSheet);
registerSheet("about-us", AboutUsSheet);
registerSheet("reward-sheet", RewardSheet);
registerSheet("exit-confirmation", ExitConfirmationSheet);
registerSheet("post-more-option", MoreOptionSheet);
registerSheet("delete-post", DeletePostSheet);
registerSheet("comment-post", CommentPostSheet);

// Extend types for better intellisense
declare module "react-native-actions-sheet" {
  interface Sheets {
    // "example-sheet": SheetDefinition;
    "create-habit": SheetDefinition;
    "habit-details": SheetDefinition<{
      payload: { data: HabitDetailsProp; isHabitCompleted?: boolean };
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
        // setSelectedFilter: (filter: "latest" | "alphabetical") => void;
      };
    }>;
    "marked-habit": SheetDefinition;
    "habit-limit": SheetDefinition<{
      payload: {
        isPremiumUser: boolean;
      };
    }>;
    "update-profile-info": SheetDefinition<{
      payload: {
        id: string;
        full_name: string;
        profile_bio: string;
      };
    }>;
    "profile-pic": SheetDefinition<{
      payload: {
        profile_pic: string | null;
      };
    }>;
    "delete-profile-pic": SheetDefinition;
    "support-and-feedback": SheetDefinition;
    "change-password": SheetDefinition;
    "about-us": SheetDefinition;
    "reward-sheet": SheetDefinition<{
      payload: {
        rewardUri: string;
        habitName: string;
        habitId: string;
      };
    }>;
    "exit-confirmation": SheetDefinition;
    "post-more-option": SheetDefinition<{
      payload: {
        postDetails: PostWithDetails;
      };
    }>;
    "delete-post": SheetDefinition<{
      payload: {
        postId: string;
      };
    }>;
    "comment-post": SheetDefinition<{
      payload: {
        postId: string;
      };
    }>;
  }
}
