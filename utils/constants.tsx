import ExerciseIcon from "@/assets/svg/exercise.svg";
import ReadingIcon from "@/assets/svg/reading.svg";
import MeditationIcon from "@/assets/svg/meditation.svg";
import HydrationIcon from "@/assets/svg/hydration.svg";
import SleepIcon from "@/assets/svg/sleep-schedule.svg";
import JournalingIcon from "@/assets/svg/journal.svg";
import OthersIcon from "@/assets/svg/others.svg";
import { horizontalScale } from "@/metric";

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
  return goodHabitsCategories.find(
    (category) => category.name === categoryName
  );
};
