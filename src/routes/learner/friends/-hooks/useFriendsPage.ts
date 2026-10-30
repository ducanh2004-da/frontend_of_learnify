import { DEFAULT_AVATAR } from "@/constants/avatar";
import {
  useGetLeaderboard,
  useGetMyFriends,
  useGetPendingRequests,
  useRespondFriendRequest,
  useSendFriendRequest,
} from "@/hooks/useFriends";
import type { TBackendUser } from "@/hooks/useProfile";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { TFriendDetail } from "../-components/FriendDetail/type";
import type {
  TFriendItem,
  TTypeFriendItem,
} from "../-components/FriendItem/type";

type TDisplayFriend = Omit<TFriendItem, "id" | "onClick"> & {
  id: string;
  rawUser?: TBackendUser;
};

type TUseFriendsPageReturn = {
  t: ReturnType<typeof useTranslation>["t"];
  typeFriend: TTypeFriendItem;
  setTypeFriend: (t: TTypeFriendItem) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  displayList: TDisplayFriend[];
  selectedFriend: TDisplayFriend | null;
  friendDetailData: TFriendDetail | null;
  shouldShowAddFriendBtn: boolean;
  isLoading: boolean;
  isSendingRequest: boolean;
  handleRespondRequest: (requesterId: string, isAccepted: boolean) => void;
  handleSendRequest: (targetUserId: string) => void;
  tabs: { value: TTypeFriendItem; label: string }[];
};

export function useFriendsPage(currentUserId?: string): TUseFriendsPageReturn {
  const { t } = useTranslation();
  const [typeFriend, setTypeFriend] = useState<TTypeFriendItem>("leaderboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: friendsData, isLoading: isLoadingFriends } = useGetMyFriends();
  const { data: pendingData, isLoading: isLoadingPending } =
    useGetPendingRequests();
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } =
    useGetLeaderboard();

  const respondMutation = useRespondFriendRequest();
  const sendRequestMutation = useSendFriendRequest();

  const tabs: { value: TTypeFriendItem; label: string }[] = [
    { value: "leaderboard", label: t("friends.tabs.leaderboard") },
    { value: "friends", label: t("friends.tabs.friends") },
    { value: "request", label: t("friends.tabs.requests") },
  ];

  const displayList: TDisplayFriend[] = useMemo(() => {
    if (typeFriend === "leaderboard" && leaderboardData?.isSuccess) {
      return leaderboardData.users.map((user) => ({
        id: user.id,
        name: user.username,
        imgUrl: DEFAULT_AVATAR,
        typeFriendItem: "leaderboard" as TTypeFriendItem,
        streaks: user.currentSteak || 0,
        rawUser: user,
      }));
    }

    if (typeFriend === "friends" && friendsData?.isSuccess) {
      return friendsData.users.map((user) => ({
        id: user.id,
        name: user.username,
        imgUrl: DEFAULT_AVATAR,
        typeFriendItem: "friends" as TTypeFriendItem,
        streaks: user.currentSteak || 0,
        rawUser: user,
      }));
    }

    if (typeFriend === "request" && pendingData?.isSuccess) {
      return pendingData.users.map((user) => ({
        id: user.id,
        name: user.username,
        imgUrl: DEFAULT_AVATAR,
        typeFriendItem: "request" as TTypeFriendItem,
        streaks: user.currentSteak || 0,
        rawUser: user,
      }));
    }
    return [];
  }, [typeFriend, friendsData, pendingData, leaderboardData]);

  const selectedFriend =
    selectedId !== null
      ? (displayList.find((friend) => friend.id === selectedId) ?? null)
      : null;

  let friendDetailData: TFriendDetail | null = null;
  if (selectedFriend?.rawUser) {
    const user = selectedFriend.rawUser;
    friendDetailData = {
      id: user.id,
      name: user.username,
      email: user.email,
      imgUrl: DEFAULT_AVATAR,
      imgBackground: undefined,
      phoneNumber: user.phoneNumber,
      streak: user.currentSteak || 0,
      badges: 0,
      follower: 0,
      course: 0,
    };
  }

  let shouldShowAddFriendBtn = false;
  if (typeFriend === "leaderboard" && selectedFriend) {
    const isSelf = currentUserId === selectedFriend.id;
    shouldShowAddFriendBtn = !isSelf;
  }

  const handleRespondRequest = (requesterId: string, isAccepted: boolean) => {
    respondMutation.mutate(
      { requesterId, isAccepted },
      {
        onSuccess: (res) => {
          if (res.respondFriendRequest.isSuccess) {
            toast.success(
              isAccepted
                ? t("friends.alerts.accepted")
                : t("friends.alerts.declined")
            );
            if (selectedId === requesterId) setSelectedId(null);
          } else {
            toast.error(res.respondFriendRequest.message);
          }
        },
      }
    );
  };

  const handleSendRequest = (targetUserId: string) => {
    sendRequestMutation.mutate({ targetUserId });
  };

  const isLoading =
    (typeFriend === "friends" && isLoadingFriends) ||
    (typeFriend === "request" && isLoadingPending) ||
    (typeFriend === "leaderboard" && isLoadingLeaderboard);

  return {
    t,
    typeFriend,
    setTypeFriend,
    selectedId,
    setSelectedId,
    displayList,
    selectedFriend,
    friendDetailData,
    shouldShowAddFriendBtn,
    isLoading,
    isSendingRequest: sendRequestMutation.isPending,
    handleRespondRequest,
    handleSendRequest,
    tabs,
  };
}
