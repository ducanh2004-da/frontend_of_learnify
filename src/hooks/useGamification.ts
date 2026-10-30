import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import { useAuthStore } from "@/store/authStore";
import {
  INCREASE_STREAK_MUTATION,
  UPDATE_DIAMONDS_MUTATION,
  type UpdateDiamondInput,
  type GamificationMutationResult,
  type IncreaseStreakResponse,
  type UpdateDiamondsResponse,
} from "@/graphql/gamification";

export type {
  DiamondTransactionType,
  DiamondSourceType,
  UpdateDiamondInput,
  UserFieldsData,
  GamificationMutationResult,
} from "@/graphql/gamification";

export type UpdateDiamondsVariables =
  | UpdateDiamondInput
  | { data: UpdateDiamondInput };

/**
 * Synchronizes returned user gamification stats (diamonds, streak, user info)
 * with the Zustand auth store and invalidates relevant React Query caches.
 */
export function syncGamificationState(
  response: GamificationMutationResult | null | undefined,
  queryClient: ReturnType<typeof useQueryClient>
) {
  // a. Check if response.isSuccess is true and response.users contains the updated user data
  if (response?.isSuccess && response.users && response.users.length > 0) {
    const updatedUser = response.users[0];
    if (!updatedUser) return;

    // b. Zustand Sync: If our zustand user profile store holds user stats
    // (diamonds, currentStreak, or the user object), update the store immediately
    // using its existing setter action with the returned user data.
    const currentAuthUser = useAuthStore.getState().user;
    if (currentAuthUser) {
      const newDiamond =
        updatedUser.diamond ?? updatedUser.diamonds ?? currentAuthUser.diamond;
      const newStreak =
        updatedUser.currentSteak ??
        updatedUser.currentStreak ??
        currentAuthUser.currentSteak;

      useAuthStore.getState().setAuth({
        ...currentAuthUser,
        diamond: newDiamond,
        currentSteak: newStreak,
        ...(updatedUser.username ? { username: updatedUser.username } : {}),
        ...(updatedUser.email ? { email: updatedUser.email } : {}),
        ...(updatedUser.role ? { role: updatedUser.role } : {}),
      });
    } else if (updatedUser.id && updatedUser.email) {
      useAuthStore.getState().setAuth({
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username ?? undefined,
        role: updatedUser.role ?? undefined,
        diamond: updatedUser.diamond ?? updatedUser.diamonds ?? 0,
        currentSteak:
          updatedUser.currentSteak ?? updatedUser.currentStreak ?? 0,
      });
    }

    // c. React Query Cache Sync: Invalidate relevant user/gamification query keys
    // (e.g., current user profile, dashboard stats, GetStreakLeaderboard)
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    queryClient.invalidateQueries({ queryKey: ["user"] });
    if (updatedUser.id) {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", updatedUser.id],
      });
    }
    queryClient.invalidateQueries({ queryKey: ["friends", "leaderboard"] });
    queryClient.invalidateQueries({ queryKey: ["GetStreakLeaderboard"] });
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }
}

/**
 * Custom Mutation Hook to increase the current streak for the authenticated user.
 */
export function useIncreaseStreakMutation(
  options?: Omit<
    UseMutationOptions<GamificationMutationResult, Error, void>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async () => {
      const response = await graphqlClient.request<IncreaseStreakResponse>(
        INCREASE_STREAK_MUTATION
      );
      return response.increaseCurrentStreak;
    },
    onSuccess: (...args) => {
      syncGamificationState(args[0], queryClient);
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Custom Mutation Hook to update user diamonds (EARN or SPEND).
 */
export function useUpdateDiamondsMutation(
  options?: Omit<
    UseMutationOptions<
      GamificationMutationResult,
      Error,
      UpdateDiamondsVariables
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (variables: UpdateDiamondsVariables) => {
      const data = "data" in variables ? variables.data : variables;
      const response = await graphqlClient.request<UpdateDiamondsResponse>(
        UPDATE_DIAMONDS_MUTATION,
        { data }
      );
      return response.updateDiamond;
    },
    onSuccess: (...args) => {
      syncGamificationState(args[0], queryClient);
      options?.onSuccess?.(...args);
    },
  });
}
