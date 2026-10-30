import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { useNavigate } from "@tanstack/react-router";
import TextButton from "@/components/TextButton";
import Icon from "@/components/Icon";
import "./style.scss";

type TFriendEmptyStateProps = {
  className?: string;
};

const FriendEmptyState = ({ className }: TFriendEmptyStateProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cls = classnames("friend-empty-state", className);

  return (
    <div className={cls}>
      <Icon name="group" className="friend-empty-state__icon" />
      <h4 className="semibold">{t("friends.empty_state.heading")}</h4>
      <p>{t("friends.empty_state.description")}</p>
      <TextButton
        text={t("friends.empty_state.login")}
        size="medium"
        type="primary"
        icon="login"
        onClick={() =>
          navigate({
            to: "/auth/log-in",
            search: { redirect: "/learner/friends" },
          })
        }
      />
    </div>
  );
};

export default FriendEmptyState;
