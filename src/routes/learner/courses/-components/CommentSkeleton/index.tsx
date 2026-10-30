import "./style.scss";

export const CommentSkeleton = () => {
  return (
    <div className="comment-skeleton">
      <div className="comment-skeleton__head">
        <div className="skeleton-shape comment-skeleton__avatar" />
        <div className="comment-skeleton__info">
          <div className="skeleton-shape comment-skeleton__name" />
          <div className="skeleton-shape comment-skeleton__time" />
          <div className="skeleton-shape comment-skeleton__stars" />
        </div>
      </div>
      <div className="skeleton-shape comment-skeleton__body" />
    </div>
  );
};

export default CommentSkeleton;
