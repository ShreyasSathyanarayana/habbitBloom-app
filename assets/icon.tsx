import { AntDesign, Feather } from "@expo/vector-icons";
import { TextStyle } from "react-native";
import HabbitActiveIcon from "@/assets/tab-icons/habits-active.svg";
import HabbitInactiveIcon from "@/assets/tab-icons/habits-inactive.svg";
import StreaksActiveIcon from "@/assets/tab-icons/streak-active.svg";
import StreaksInactiveIcon from "@/assets/tab-icons/streak-inactive.svg";
import InsightsActiveIcon from "@/assets/tab-icons/insights-active.svg";
import InsightsInactiveIcon from "@/assets/tab-icons/insights-inactive.svg";
import ProfileActiveIcon from "@/assets/tab-icons/profile-active.svg";
import ProfileInactiveIcon from "@/assets/tab-icons/profile-inactive.svg";
import { horizontalScale } from "@/metric";

type IconProps = {
  isFoucsed: boolean;
};

export const icons: Record<string, (props: IconProps) => JSX.Element> = {
  index: (props) =>
    props.isFoucsed ? <HabbitActiveIcon /> : <HabbitInactiveIcon />,
  streaks: (props) =>
    props.isFoucsed ? <StreaksActiveIcon /> : <StreaksInactiveIcon />,
  insights: (props) =>
    props.isFoucsed ? <InsightsActiveIcon /> : <InsightsInactiveIcon />,
  profile: (props) =>
    props.isFoucsed ? <ProfileActiveIcon /> : <ProfileInactiveIcon />,
};

export const activeIcons: Record<string, JSX.Element> = {
  index: (
    <HabbitActiveIcon
      width={horizontalScale(24)}
      height={horizontalScale(24)}
    />
  ),
  streaks: (
    <StreaksActiveIcon
      width={horizontalScale(24)}
      height={horizontalScale(24)}
    />
  ),
  insights: (
    <InsightsActiveIcon
      width={horizontalScale(24)}
      height={horizontalScale(24)}
    />
  ),
  profile: (
    <ProfileActiveIcon
      width={horizontalScale(24)}
      height={horizontalScale(24)}
    />
  ),
};

export const inactiveIcons: Record<string, JSX.Element> = {
  index: <HabbitInactiveIcon />,
  streaks: <StreaksInactiveIcon />,
  insights: <InsightsInactiveIcon />,
  profile: <ProfileInactiveIcon />,
};