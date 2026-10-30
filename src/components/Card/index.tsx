import { useTranslation } from "react-i18next";
import classnames from "classnames";
import "./style.scss";
import type { TCourseCardProps } from "./type";
import TextButton from "@/components/TextButton";
import CardFooter from "./components/CardFooter";

const Card = (props: TCourseCardProps) => {
  const { t } = useTranslation();
  const {
    className,
    onClick,
    title,
    description,
    duration,
    typeSpecial,
    disabled = false,
    status = "default",
    percentage = 0,
    badgeStatus,
  } = props;

  return (
    <div
      className={classnames("card", { disabled: disabled }, className)}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="card-content">
        <div className="badge">
          <TextButton
            onClick={() => {}}
            text="text"
            size="tiny"
            type="special"
            typeSpecial={typeSpecial}
            tooltip={t(`special_tooltip.${typeSpecial}`)}
          />
          {badgeStatus && (
            <TextButton
              onClick={() => {}}
              text="text"
              size="tiny"
              type="special"
              typeSpecial={badgeStatus}
              tooltip={t(`special_tooltip.${badgeStatus}`)}
            />
          )}
        </div>
        <h5 className="medium" title={title}>
          {title}
        </h5>
        {description && (
          <p className="description" title={description}>
            {description}
          </p>
        )}
      </div>
      <CardFooter status={status} percentage={percentage} duration={duration} />
    </div>
  );
};
export default Card;
