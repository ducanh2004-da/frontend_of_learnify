import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import useCardFooterButton from "../../hooks/useCardFooterButton";
import classNames from "classnames";
import type { TStatusCard } from "@/types/global";

type TCardFooterProps = {
  status?: TStatusCard;
  percentage?: number;
  duration?: number;
};

const CardFooter = (props: TCardFooterProps) => {
  const { t } = useTranslation();
  const { status = "default", percentage = 0, duration } = props;

  const cardFooterClassName = classNames("card-footer", status);

  const { icon } = useCardFooterButton(status);

  if (status === "inProgress") {
    return (
      <div className={cardFooterClassName}>
        <div className="progress">
          <div className="tracker" style={{ width: `${percentage}%` }}></div>
        </div>
        <small>{percentage}%</small>
      </div>
    );
  }

  const durationLabel =
    duration != null ? t("card.duration", { count: duration }) : "";

  return (
    <div className={cardFooterClassName}>
      <div className="duration" title={durationLabel || undefined}>
        {duration != null && <Icon name="pace" />}
        <small>{durationLabel}</small>
      </div>
      <IconButton
        className={status}
        icon={icon}
        size="small"
        type="outlined"
        onClick={() => {}}
        shape="circle"
        tooltip={t(`card_footer_tooltip.${status}`)}
      />
    </div>
  );
};

export default CardFooter;
