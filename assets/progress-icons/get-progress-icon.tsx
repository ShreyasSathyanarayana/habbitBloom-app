import Progress1 from "@/assets/progress-icons/progress-1.svg";
import Progress2 from "@/assets/progress-icons/progress-2.svg";
import Progress3 from "@/assets/progress-icons/progress-3.svg";
import Progress4 from "@/assets/progress-icons/progress-4.svg";
import Progress5 from "@/assets/progress-icons/progress-5.svg";
import Progress6 from "@/assets/progress-icons/progress-6.svg";
import Progress7 from "@/assets/progress-icons/progress-7.svg";
import Progress8 from "@/assets/progress-icons/progress-8.svg";
import { horizontalScale } from "@/metric";

const _iconSize = horizontalScale(18);
const _iconColor = "rgba(138, 43, 226, 1)";

export function getProgressIcon(level: number) {
  if (level >= 0 && level <= 10) {
    return (
      <Progress1
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level >= 11 && level <= 25) {
    return (
      <Progress2
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level >= 26 && level <= 40) {
    return (
      <Progress3
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level >= 41 && level <= 50) {
    return (
      <Progress4
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level >= 51 && level <= 65) {
    return (
      <Progress5
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level >= 66 && level <= 80) {
    return (
      <Progress6
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level >= 81 && level <= 99) {
    return (
      <Progress7
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }
  if (level === 100) {
    return (
      <Progress8
        width={_iconSize}
        height={_iconSize}
        color={_iconColor}
        fill={_iconColor}
      />
    );
  }

  // Default case (if level is out of range)
  return (
    <Progress1
      width={_iconSize}
      height={_iconSize}
      color={_iconColor}
      fill={_iconColor}
    />
  );
}
