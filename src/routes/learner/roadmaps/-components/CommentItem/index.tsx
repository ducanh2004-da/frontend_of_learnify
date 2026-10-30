import Icon from "@/components/Icon";
import type { TCommentItemProps } from "./type.d.ts";
import "./style.scss";

const CommentItem = (props: TCommentItemProps) => {
  const { userName, time, content, rating } = props;

  return (
    <div className="comment-item">
      <div className="comment-item-head">
        <div className="comment-avatar"></div>
        <div className="comment-head-infor">
          <span>{userName}</span>
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
      <div className="comment-item-body">{content}</div>
    </div>
  );
};

export default CommentItem;
