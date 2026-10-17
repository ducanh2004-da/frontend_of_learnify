import Icon from "@/components/Icon";
import type { TCommentItemProps } from "./type.d.ts";
import "./style.scss";

const CommentItem = (props: TCommentItemProps) => {
  const { userName, avatar, time, content, rating, isCurrentUser } = props;

  const initial = userName ? userName.trim().charAt(0).toUpperCase() : "?";

  return (
    <div className="comment-item">
      <div className="comment-item-head">
        <div className="comment-avatar">
          {avatar ? (
            <img src={avatar} alt={userName} />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div className="comment-head-infor">
          <div className="comment-user-row">
            <span className="comment-user-name">{userName}</span>
            {isCurrentUser && <span className="comment-you-badge">You</span>}
          </div>
          <p>{time}</p>
          <div className="comment-head-infor-stars">
            {Array.from({ length: 5 }).map((_, index) => (
              <Icon
                key={index}
                name="star"
                className="icon"
                style={{
                  color: index < rating ? "#FFC107" : "#E0E0E0",
                  fontSize: "18px",
                }}
                fill={index < rating}
              />
            ))}
          </div>
        </div>
        <div className="comment-3dot">
          <Icon name="more_vert" className="icon" />
        </div>
      </div>
      {content && <div className="comment-item-body">{content}</div>}
    </div>
  );
};

export default CommentItem;
