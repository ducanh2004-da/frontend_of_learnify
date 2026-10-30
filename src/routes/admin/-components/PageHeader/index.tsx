import { useTranslation } from "react-i18next";
import TextButton from "@/components/TextButton";
import "./style.scss";

type TPageHeaderProps = {
  title: string;
  count?: number;
  onAddUser: () => void;
};

const PageHeader = ({ title, count, onAddUser }: TPageHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="admin-page-header">
      <div className="admin-page-header__text">
        <h1 className="admin-page-header__title">{title}</h1>
        {count !== undefined && (
          <span className="admin-page-header__count">
            {count.toLocaleString()} total
          </span>
        )}
      </div>

      <TextButton
        icon="person_add"
        text={t("admin.page_header.add_user")}
        tooltip={t("admin.page_header.add_user_tooltip")}
        onClick={onAddUser}
        size="medium"
      />
    </div>
  );
};

export default PageHeader;
