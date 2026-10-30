import { graphqlClient } from "@/lib/graphql";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { GET_PROFILE, UPDATE_USER } from "@/graphql/user";
import { toast } from "sonner";

export type TBackendUser = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  diamond: number;
  currentSteak: number;
  phoneNumber: string;
  role: string;
};

export type TProfileCourse = {
  id: string;
  courseName: string;
  abstract: string;
  isDone: boolean;
  keyLearnings: string[];
};

export type GetUserProfileResponse = {
  currentUser: {
    count: number;
    isSuccess: boolean;
    message: string;
    users: TBackendUser[];
  };
  countSuccessEnrollments: {
    count: number;
    data: TProfileCourse[];
  };
  countInProgressEnrollments: {
    count: number;
    data: TProfileCourse[];
    progress: number;
  };
};

export type UpdateUserInput = {
  id: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
};

const emptyProfile: GetUserProfileResponse = {
  currentUser: { count: 0, isSuccess: false, message: "", users: [] },
  countSuccessEnrollments: { count: 0, data: [] },
  countInProgressEnrollments: { count: 0, data: [], progress: 0 },
};

export function useGetUserProfile(userId?: string) {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: async () => {
      try {
        return await graphqlClient.request<GetUserProfileResponse>(
          GET_PROFILE,
          { userId }
        );
      } catch {
        return emptyProfile;
      }
    },
    enabled: !!userId,
  });
}

export function useSuspenseGetUserProfile(userId?: string) {
  return useSuspenseQuery({
    queryKey: ["user", "profile", userId],
    queryFn: async () => {
      try {
        return await graphqlClient.request<GetUserProfileResponse>(
          GET_PROFILE,
          { userId }
        );
      } catch {
        return emptyProfile;
      }
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      return await graphqlClient.request(UPDATE_USER, { data });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", variables.id],
      });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${(error as Error).message}`);
    },
  });
}

export {
  useIncreaseStreakMutation,
  useUpdateDiamondsMutation,
} from "./useGamification";
