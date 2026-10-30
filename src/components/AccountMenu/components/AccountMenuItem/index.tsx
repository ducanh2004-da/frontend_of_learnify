import { Link } from "@tanstack/react-router";
import Icon, { type TIconName } from "@/components/Icon";

type TAccountMenuItemProps = {
  icon: TIconName;
  text: string;
  to?: string;
  onClick?: () => void;
};

const AccountMenuItem = ({
  icon,
  text,
  to,
  onClick,
}: TAccountMenuItemProps) => {
  if (onClick) {
    return (
      <button className="account-menu-item" onClick={onClick}>
        <Icon name={icon} />
        <small className="medium">{text}</small>
      </button>
    );
  }
  return (
    <Link className="account-menu-item" to={to}>
      <Icon name={icon} />
      <small className="medium">{text}</small>
    </Link>
  );
};

export default AccountMenuItem;
