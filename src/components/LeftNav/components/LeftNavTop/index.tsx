import "./style.scss";
import { useTranslation } from "react-i18next";
import IconButton from "@/components/IconButton";
import { useLayout } from "@/contexts/LayoutContext";
import LeftNavItem from "../LeftNavItem";
import { getTopItemsByPathname } from "../../constants";

type TLeftNavTopProps = {
  pathname: string;
};

const LeftNavTop = (props: TLeftNavTopProps) => {
  const { pathname } = props;
  const { t } = useTranslation();
  const { setLayoutConfigState } = useLayout();

  const topItems = getTopItemsByPathname(pathname);

  return (
    <div className="left-nav-top">
      <IconButton
        icon="search"
        size="small"
        ariaLabel={t("sidebar.search")}
        onClick={() =>
          setLayoutConfigState((prev) => ({
            ...prev,
            showSearch: !prev.showSearch,
          }))
        }
      />
      <div className="left-nav-top__items">
        {topItems.map((item) => (
          <LeftNavItem
            key={item.labelKey}
            iconName={item.iconName}
            label={t(item.labelKey)}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftNavTop;
