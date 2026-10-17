import TextButton from "@/components/TextButton";
import { COLORS } from "@/styles/colors";
import type { TProgress, TStatusCard } from "@/types/global";
import type { TIconName } from "@/components/Icon";

type TDecorationCardStatusProps = {
  status: TStatusCard;
  percentage: TProgress;
  star: number | string;
  onStartClick?: () => void;
  startText?: string;
  startIcon?: TIconName;
  startDisabled?: boolean;
};

const DecorationCardStatus = (props: TDecorationCardStatusProps) => {
  const {
    percentage,
    star,
    onStartClick,
    startText = "start",
    startIcon = "arrow_right_alt",
    startDisabled = false,
  } = props;

  return (
    <div className="status">
      <TextButton
        text={startText}
        size="medium"
        type="secondary"
        icon={startIcon}
        backgroundColor={COLORS.white}
        color={COLORS.navy400}
        onClick={onStartClick ?? (() => {})}
        disabled={startDisabled}
      />
      <div className="progress" style={{ backgroundColor: COLORS.white }}>
        <div
          className="tracker"
          style={{ width: `${percentage}%` }}
          title={`${percentage}% completed`}
        ></div>
      </div>
      <TextButton
        text={star.toString()}
        size="tiny"
        type="secondary"
        icon="star"
        backgroundColor={COLORS.navy400}
        color={COLORS.white}
        tooltip={`${star} stars`}
        onClick={() => {}}
      />
    </div>
  );
};

export default DecorationCardStatus;
