import ExerciseIcon from "@/assets/svg/exercise.svg";
import ReadingIcon from "@/assets/svg/reading.svg";
import MeditationIcon from "@/assets/svg/meditation.svg";
import HydrationIcon from "@/assets/svg/hydration.svg";
import SleepIcon from "@/assets/svg/sleep-schedule.svg";
import JournalingIcon from "@/assets/svg/journal.svg";
import BugIcon from "@/assets/suggestion-catergories-icon/bug-icon.svg";
import FeatureIcon from "@/assets/suggestion-catergories-icon/feature-icon.svg";
import AppPerformanceIcon from "@/assets/suggestion-catergories-icon/app-performance-icon.svg";
import LoginIssueIcon from "@/assets/suggestion-catergories-icon/login-issue-icon.svg";
// import OtherIssuesIcon from "@/assets/suggestion-catergories-icon/other-issue-icon.svg";
import UIissueIcon from "@/assets/suggestion-catergories-icon/ui-icon.svg";
// import OtherIssuesIcon from "@/assets/svg/suggestion-description.svg";
import OtherIssuesIcon from "@/assets/svg/categories-icon.svg";
import OthersIcon from "@/assets/svg/others.svg";
import { horizontalScale } from "@/metric";
import moment from "moment";
import { Option } from "@/components/ui/drop-down";
import { getUserId } from "./persist-storage";
const _categoriesIconSize = horizontalScale(24);

const iconSize = {
  width: horizontalScale(24),
  height: horizontalScale(24),
};

const iconMap: Record<string, JSX.Element> = {
  Exercise: <ExerciseIcon {...iconSize} />,
  Reading: <ReadingIcon {...iconSize} />,
  Meditation: <MeditationIcon {...iconSize} />,
  Hydration: <HydrationIcon {...iconSize} />,
  "Sleep Schedule": <SleepIcon {...iconSize} />,
  Journaling: <JournalingIcon {...iconSize} />,
  Others: <OthersIcon {...iconSize} />,
};

export const goodHabitsCategories = [
  {
    id: 1,
    name: "Exercise",
    icon: (
      <ExerciseIcon width={horizontalScale(24)} height={horizontalScale(24)} />
    ),
    colors: ["rgba(255, 65, 108, 0.7)", "rgba(255, 75, 43, 0.4)"],
  },
  {
    id: 2,
    name: "Reading",
    icon: (
      <ReadingIcon width={horizontalScale(24)} height={horizontalScale(24)} />
    ),
    colors: ["rgba(102, 126, 234, 0.7)", "rgba(37, 117, 252, 0.3)"],
  },
  {
    id: 3,
    name: "Meditation",
    icon: (
      <MeditationIcon
        width={horizontalScale(24)}
        height={horizontalScale(24)}
      />
    ),
    colors: ["rgba(17, 153, 142, 0.7)", "rgba(56, 239, 125, 0.6)"],
  },
  {
    id: 4,
    name: "Hydration",
    icon: (
      <HydrationIcon width={horizontalScale(24)} height={horizontalScale(24)} />
    ),
    colors: ["rgba(47, 128, 237, 0.7)", "rgba(86, 204, 242, 0.6)"],
  },
  {
    id: 5,
    name: "Sleep Schedule",
    icon: (
      <SleepIcon width={horizontalScale(24)} height={horizontalScale(24)} />
    ),
    colors: ["rgba(20, 30, 48, 0.7)", "rgba(37, 117, 252, 0.5)"],
  },
  {
    id: 6,
    name: "Journaling",
    icon: (
      <JournalingIcon
        width={horizontalScale(24)}
        height={horizontalScale(24)}
      />
    ),
    colors: ["rgba(247, 151, 30, 0.7)", "rgba(255, 210, 0, 0.4)"],
  },
  {
    id: 7,
    name: "Others",
    icon: (
      <OthersIcon width={horizontalScale(24)} height={horizontalScale(24)} />
    ),
    colors: ["rgba(0, 201, 167, 0.7)", "rgba(132, 94, 194, 0.4)"],
  },
];

export const getCategoryByName = (categoryName: string) => {
  // return goodHabitsCategories.find(
  //   (category) => category.name === categoryName
  // );
  return iconMap[categoryName];
};

export const getCurrentMonthAndYear = () => {
  const today = new Date();

  // Get full month name
  const monthName = today.toLocaleString("en-US", { month: "long" });

  // Get year
  const year = today.getFullYear();

  return { month: monthName, year };
};

// Function to get the current UTC timestamp
export const DateUtils = {
  getCurrentUtcTimestamp: (format = "YYYY-MM-DDTHH:mm:ss[Z]") =>
    moment.utc().format(format),
  convertUtcToLocal: (utcTimestamp: string, format = "YYYY-MM-DD HH:mm:ss") =>
    moment.utc(utcTimestamp).local().format(format),
  getCurrentUtcDate: (format = "YYYY-MM-DD") => moment.utc().format(format),
  convertUtcToLocalDate: (utcTimestamp: string, format = "YYYY-MM-DD") =>
    moment.utc(utcTimestamp).local().format(format),
  getCurrentLocalDate: (format = "YYYY-MM-DD") =>
    moment().local().format(format),
};

export const IsoDateUtils = {
  convertToLocalDate: (isoDate: string, format = "YYYY-MM-DD") => {
    return moment(isoDate).local().format(format);
  },
};

export const getCurrentWeekIndex = (data: { week: string }[]) => {
  const today = moment();

  // Map each week string to a moment date (assumes weeks are Sundays)
  const weeksWithMoment = data.map((item, index) => {
    const weekDate = moment(item.week, "MMM D");

    // Adjust year if needed
    if (weekDate.isAfter(today)) {
      weekDate.subtract(1, "year");
    }

    return {
      ...item,
      index,
      momentDate: weekDate,
    };
  });

  // Find the latest week where weekDate is <= today
  const currentWeek = weeksWithMoment.reduce((latest, curr) => {
    return curr.momentDate.isSameOrBefore(today) &&
      curr.momentDate.isAfter(latest.momentDate)
      ? curr
      : latest;
  }, weeksWithMoment[0]);

  return currentWeek?.index ?? 0;
};

export const Suggestion_categories: Option[] = [
  {
    icon: <BugIcon width={_categoriesIconSize} height={_categoriesIconSize} />,
    value: "Bug Report",
    label: "Bug Report",
  },
  {
    icon: (
      <FeatureIcon width={_categoriesIconSize} height={_categoriesIconSize} />
    ),
    label: "Features Request",
    value: "Features Request",
  },
  {
    icon: (
      <AppPerformanceIcon
        width={_categoriesIconSize}
        height={_categoriesIconSize}
      />
    ),
    label: "App Performances",
    value: "App Performances",
  },
  {
    icon: (
      <UIissueIcon width={_categoriesIconSize} height={_categoriesIconSize} />
    ),
    label: "UI Issues",
    value: "UI Issues",
  },
  {
    icon: (
      <LoginIssueIcon
        width={_categoriesIconSize}
        height={_categoriesIconSize}
      />
    ),
    label: "Login/Account Issues",
    value: "Login/Account Issues",
  },
  {
    icon: (
      <OtherIssuesIcon
        width={_categoriesIconSize}
        height={_categoriesIconSize}
      />
    ),
    label: "Others",
    value: "Others",
  },
];
export const suggestionCategoryValues = Suggestion_categories.map(
  (option) => option.value
);

export const getSuggestionCategoryColor = (value: string): string => {
  const colorMap: Record<string, string> = {
    "Bug Report": "rgba(255, 59, 48, 1)", // Red
    "Features Request": "rgba(0, 122, 255, 1) ", // Blue
    "App Performances": "rgba(52, 199, 89, 1)", // Amber
    "UI Issues": "rgba(175, 82, 222, 1)", // Purple
    "Login/Account Issues": "rgba(255, 149, 0, 1)", // Orange
    Others: "rgba(255, 204, 0, 1)", // Grey
  };

  return colorMap[value] || "rgba(255, 204, 0, 1)"; // Default grey
};

export const Status_options: Option[] = [
  {
    icon: null,
    value: "pending",
    label: "Pending ⏳",
  },
  {
    icon: null,
    value: "approved",
    label: "Resolved ✅",
  },
  {
    icon: null,
    value: "rejected",
    label: "Rejected ❌",
  },
  {
    icon: null,
    value: "in_progress",
    label: "In Progress 🛠️",
  },
];

export const statusValues = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Resolved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
];

export const getUserLabelById = (id: string, userName: string) => {
  const userId = getUserId();
  if (id === userId) {
    return "You";
  }
  return userName || "Unknown User";
};

export function formatLikeCount(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export const reportList = [
  "It’s a spam",
  "False information",
  "Harassment or hate speech",
  "Nudity or sexual content",
  "Violent or graphic content",
  "Scams or fraud",
  "Something else",
];
