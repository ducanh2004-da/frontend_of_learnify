export type TCommentItem = {
  id?: string;
  userName: string;
  avatar?: string | null;
  time: string;
  content?: string | null;
  rating: number;
  isCurrentUser?: boolean;
};

export type TCommentItemProps = TCommentItem;
