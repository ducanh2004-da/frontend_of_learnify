import type { TIconName } from "@/components/Icon";
import type { TStatusCard } from "@/types/global";

const useCardFooterButton = (
  status: TStatusCard
): {
  tooltip: string;
  icon: TIconName;
} => {
  switch (status) {
    case "locked":
      return {
        tooltip: "locked",
        icon: "lock",
      };
    case "completed":
      return {
        tooltip: "completed",
        icon: "check",
      };
    default:
      return {
        tooltip: "default",
        icon: "arrow_forward",
      };
  }
};
export default useCardFooterButton;
