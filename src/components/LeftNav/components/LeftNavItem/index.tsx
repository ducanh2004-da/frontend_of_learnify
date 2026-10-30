import { Link } from "@tanstack/react-router";
import Icon, { type TIconName } from "@/components/Icon";
import "./style.scss";

type TLeftNavItemProps = {
  iconName: TIconName;
  label: string;
  href: string;
  className?: string;
};

const LeftNavItem = (props: TLeftNavItemProps) => {
  const { iconName, label, href, className = "" } = props;

  return (
    <div className="left-nav-item">
      <Link
        className="link-box"
        to={href}
        activeOptions={{ includeSearch: false, exact: true }}
      >
        <div className="icon-box">
          <Icon name={iconName} className={className} />
        </div>
        <small>{label}</small>
      </Link>
    </div>
  );
};

export default LeftNavItem;
