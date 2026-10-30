import { useTranslation } from "react-i18next";
import type { TFriendDetail } from "./type";
import FriendActionButton from "./FriendActionButton";
import "./style.scss";

type Props = TFriendDetail & {
  showAddFriendBtn?: boolean;
  isSendingRequest?: boolean;
  onSendFriendRequest?: () => void;
  targetUserId?: string;
  currentUserId?: string;
};

const FriendDetail = (props: Props) => {
  const { t } = useTranslation();
  const {
    id,
    targetUserId = id,
    imgBackground,
    imgUrl,
    name,
    email,
    streak,
    badges,
    follower,
    course,
    showAddFriendBtn = true,
    currentUserId,
    onSendFriendRequest,
  } = props;

  return (
    <div className="friend-detail">
      <div className="friend-detail__header">
        {imgBackground ? (
          <img
            className="friend-detail__bg"
            src={imgBackground}
            alt="Background"
          />
        ) : (
          <div className="friend-detail__bg friend-detail__bg--empty"></div>
        )}
        <div className="friend-detail__avatar-wrapper">
          <img className="friend-detail__avatar" src={imgUrl} alt={name} />
        </div>
      </div>

      <div className="friend-detail__body">
        <h3 className="friend-detail__name bold">{name}</h3>
        <p className="friend-detail__meta">{email}</p>
        {showAddFriendBtn && (
          <FriendActionButton
            targetUserId={targetUserId}
            currentUserId={currentUserId}
            onSendSuccess={onSendFriendRequest}
          />
        )}

        <div className="friend-detail__stats friend-detail__stats--with-btn">
          <div className="friend-detail__stat-item">
            <span className="friend-detail__stat-value">{badges}</span>
            <span className="friend-detail__stat-label">
              {t("friends.detail.badges")}
            </span>
          </div>
          <div className="friend-detail__stat-item">
            <span className="friend-detail__stat-value">{follower}</span>
            <span className="friend-detail__stat-label">
              {t("friends.detail.followers")}
            </span>
          </div>
          <div className="friend-detail__stat-item">
            <span className="friend-detail__stat-value">{streak}</span>
            <span className="friend-detail__stat-label">
              {t("friends.detail.streak_days")}
            </span>
          </div>
          <div className="friend-detail__stat-item">
            <span className="friend-detail__stat-value">{course}</span>
            <span className="friend-detail__stat-label">
              {t("friends.detail.courses")}
            </span>
          </div>
        </div>

        <div className="friend-detail__achievements">
          <h2 className="friend-detail__achievements-title">
            {t("friends.detail.achievements")}
          </h2>
          <div className="friend-detail__achievements-list">
            <div className="friend-detail__achievement-item">
              <div className="friend-detail__achievement-icon friend-detail__achievement-icon--yellow"></div>
              <span className="friend-detail__achievement-label">
                {t("friends.detail.path_enroll")}
              </span>
            </div>
            <div className="friend-detail__achievement-item">
              <div className="friend-detail__achievement-icon friend-detail__achievement-icon--red"></div>
              <span className="friend-detail__achievement-label">
                {t("friends.detail.first_lab")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDetail;
