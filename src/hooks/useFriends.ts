import { graphqlClient } from "@/lib/graphql";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GET_MY_FRIENDS,
  GET_PENDING_REQUESTS,
  RESPOND_FRIEND_REQUEST,
  GET_LEADERBOARD,
  SEND_FRIEND_REQUEST,
} from "@/graphql/friend";
import type { TBackendUser } from "./useProfile";
import { toast } from "sonner";

export type TFriendResponse = {
  isSuccess: boolean;
  message: string;
  count: number;
  users: TBackendUser[];
};

export type TSendFriendRequestVariables = {
  targetUserId: string;
};

export type TRespondFriendRequestVariables = {
  requesterId: string;
  isAccepted: boolean;
};

export function useGetMyFriends() {
  return useQuery({
    queryKey: ["myFriends"],
    queryFn: async () => {
      const res = await graphqlClient.request<{ myFriends: TFriendResponse }>(
        GET_MY_FRIENDS
      );
      return res.myFriends;
    },
  });
}

export function useGetPendingRequests() {
  return useQuery({
    queryKey: ["myPendingFriendRequests"],
    queryFn: async () => {
      const res = await graphqlClient.request<{
        myPendingFriendRequests: TFriendResponse;
      }>(GET_PENDING_REQUESTS);
      return res.myPendingFriendRequests;
    },
  });
}

export const useGetMyPendingFriendRequests = useGetPendingRequests;

export function useGetLeaderboard() {
  return useQuery({
    queryKey: ["friends", "leaderboard"],
    queryFn: async () => {
      const res = await graphqlClient.request<{
        getSteakLeaderboard: TFriendResponse;
      }>(GET_LEADERBOARD);
      return res.getSteakLeaderboard;
    },
  });
}

export function useRespondFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requesterId,
      isAccepted,
    }: TRespondFriendRequestVariables) => {
      return await graphqlClient.request<{
        respondFriendRequest: TFriendResponse;
      }>(RESPOND_FRIEND_REQUEST, { requesterId, isAccepted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
      queryClient.invalidateQueries({ queryKey: ["myPendingFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "list"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "pending"] });
    },
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetUserId }: TSendFriendRequestVariables) => {
      return await graphqlClient.request<{
        sendFriendRequest: TFriendResponse;
      }>(SEND_FRIEND_REQUEST, { targetUserId });
    },
    onSuccess: (res) => {
      // Invalidate current user list query cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });

      // Invalidate pending requests and local friends lists
      queryClient.invalidateQueries({ queryKey: ["myPendingFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });

      // Invalidate query populating the UI where the add button exists (leaderboard / friends)
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "list"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });

      if (res?.sendFriendRequest?.isSuccess === false) {
        toast.error(
          res.sendFriendRequest.message || "Failed to send friend request"
        );
      } else {
        toast.success("Friend request sent!");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send friend request");
    },
  });
}
