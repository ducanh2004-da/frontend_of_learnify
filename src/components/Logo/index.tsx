import classnames from "classnames";
import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import CustomLink from "../CustomLink";
import "./style.scss";
import type { TLogoProps } from "./type";

const Logo = (props: TLogoProps) => {
  const { className, size = "medium", to = "/" } = props;
  const { t } = useTranslation();
  const logoClassNames = classnames("logo", size.toLowerCase(), className);

  return (
    <CustomLink to={to} className={logoClassNames} title={t("logo.tooltip")}>
      <Icon name="local_library" />
      <span className="logo-text">{t("logo.text")}</span>
    </CustomLink>
  );
};

export default Logo;
