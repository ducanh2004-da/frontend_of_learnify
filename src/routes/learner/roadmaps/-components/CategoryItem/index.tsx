import classnames from "classnames";
import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import "./style.scss";
import type { TCategoryItemProps } from "./type.d.ts";

const CategoryItem = (props: TCategoryItemProps) => {
  const { t } = useTranslation();
  const { icon, labelKey, selected, onClick } = props;

  return (
    <button
      type="button"
      className={classnames("category-item", {
        "category-item--selected": selected,
      })}
      onClick={onClick}
    >
      <Icon name={icon} className="icon" />
      <span className="label">{t(labelKey)}</span>
    </button>
  );
};

export default CategoryItem;
