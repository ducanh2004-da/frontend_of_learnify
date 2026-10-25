import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetMyFriends,
  useGetMyPendingFriendRequests,
  useSendFriendRequest,
} from "@/hooks/useFriends";
import { useAuthStore } from "@/store/authStore";

export type TRelationStatus = "NONE" | "PENDING" | "FRIEND";

export interface FriendActionButtonProps {
  targetUserId: string;
  currentUserId?: string;
  onSendSuccess?: () => void;
  className?: string;
}

export function FriendActionButton({
  targetUserId,
  currentUserId: propCurrentUserId,
  onSendSuccess,
  className,
}: FriendActionButtonProps) {
  const { t } = useTranslation();
  const authUserId = useAuthStore((state) => state.user?.id);
  const currentUserId = propCurrentUserId ?? authUserId;

  const { data: friendsData } = useGetMyFriends();
  const { data: pendingData } = useGetMyPendingFriendRequests();
  const sendFriendRequestMutation = useSendFriendRequest();

  const [optimisticallyPendingUserId, setOptimisticallyPendingUserId] =
    useState<string | null>(null);

  const isSelf = Boolean(currentUserId && currentUserId === targetUserId);
  const optimisticPending = optimisticallyPendingUserId === targetUserId;

  const friendsList = useMemo(() => {
    if (Array.isArray(friendsData)) return friendsData;
    return friendsData?.users ?? [];
  }, [friendsData]);

  const pendingList = useMemo(() => {
    if (Array.isArray(pendingData)) return pendingData;
    return pendingData?.users ?? [];
  }, [pendingData]);

  const isFriend = useMemo(
    () => friendsList.some((u) => u.id === targetUserId),
    [friendsList, targetUserId]
  );

  const isPendingInList = useMemo(
    () => pendingList.some((u) => u.id === targetUserId),
    [pendingList, targetUserId]
  );

  const isPending = isPendingInList || optimisticPending;

  const relationStatus: TRelationStatus = useMemo(() => {
    if (isFriend) return "FRIEND";
    if (isPending) return "PENDING";
    return "NONE";
  }, [isFriend, isPending]);

  if (isSelf) {
    return null;
  }

  const handleAddFriend = () => {
    if (relationStatus !== "NONE" || sendFriendRequestMutation.isPending) {
      return;
    }

    sendFriendRequestMutation.mutate(
      { targetUserId },
      {
        onSuccess: (res) => {
          if (res?.sendFriendRequest?.isSuccess !== false) {
            setOptimisticallyPendingUserId(targetUserId);
            onSendSuccess?.();
          }
        },
      }
    );
  };

  const isSending = sendFriendRequestMutation.isPending;

  if (isSending) {
    return (
      <button
        type="button"
        className={`friend-detail__add-btn friend-detail__add-btn--sending ${className ?? ""}`.trim()}
        disabled
      >
        {t("friends.detail.sending", { defaultValue: "Sending..." })}
      </button>
    );
  }

  if (relationStatus === "FRIEND") {
    return (
      <button
        type="button"
        className={`friend-detail__add-btn friend-detail__add-btn--friend ${className ?? ""}`.trim()}
        disabled
      >
        {t("friends.detail.friend", { defaultValue: "Friend" })}
      </button>
    );
  }

  if (relationStatus === "PENDING") {
    return (
      <button
        type="button"
        className={`friend-detail__add-btn friend-detail__add-btn--pending ${className ?? ""}`.trim()}
        disabled
      >
        {t("friends.detail.pending", { defaultValue: "Pending" })}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`friend-detail__add-btn ${className ?? ""}`.trim()}
      onClick={handleAddFriend}
    >
      {t("friends.detail.add_friend", { defaultValue: "Add Friend" })}
    </button>
  );
}

export default FriendActionButton;
