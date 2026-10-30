import classnames from "classnames";
import Icon, { type TIconName } from "@/components/Icon";
import "./style.scss";

type TChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: TIconName;
  className?: string;
  disabled?: boolean;
};

const Chip = (props: TChipProps) => {
  const {
    label,
    selected = false,
    onClick,
    icon,
    className,
    disabled = false,
  } = props;

  return (
    <button
      type="button"
      className={classnames(
        "chip",
        { "chip--selected": selected, "chip--disabled": disabled },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {icon && <Icon name={icon} size={16} />}
      <span className="chip__label">{label}</span>
    </button>
  );
};

export default Chip;
