import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import {
  GET_ALL_USERS_QUERY,
  CREATE_USER_MUTATION,
  UPDATE_ADMIN_USER_MUTATION,
  DELETE_USER_MUTATION,
} from "@/graphql/admin";
import i18n from "@/i18n";
import { toast } from "sonner";

export type TAdminUser = {
  id: string;
  username: string;
  email: string;
  role: string | null;
  avatar?: string | null;
  createdAt: string;
  phoneNumber?: string | null;
};

export type TCreateUserInput = {
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  role: string;
};

export type TUpdateUserAdminInput = {
  id: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  role?: string;
};

type GetAllUsersResponse = {
  users: {
    isSuccess: boolean;
    count: number;
    message: string;
    users: TAdminUser[];
  };
};

type CreateUserResponse = {
  createUser: Omit<TAdminUser, "avatar" | "updatedAt">;
};

type UpdateAdminResponse = {
  updateAdmin: Omit<TAdminUser, "avatar" | "updatedAt">;
};
const ADMIN_USERS_KEY = ["admin", "users"] as const;

export function useGetAllAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_KEY,
    queryFn: async () => {
      const response =
        await graphqlClient.request<GetAllUsersResponse>(GET_ALL_USERS_QUERY);
      return response.users;
    },
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateUserInput) => {
      const response = await graphqlClient.request<CreateUserResponse>(
        CREATE_USER_MUTATION,
        { data }
      );
      return response.createUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      toast.success(i18n.t("admin.users.toast.user_created"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("admin.users.toast.create_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TUpdateUserAdminInput) => {
      const response = await graphqlClient.request<UpdateAdminResponse>(
        UPDATE_ADMIN_USER_MUTATION,
        { data }
      );
      return response.updateAdmin;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      toast.success(i18n.t("admin.users.toast.user_updated"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("admin.users.toast.update_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await graphqlClient.request(DELETE_USER_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      toast.success(i18n.t("admin.users.toast.user_deleted"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("admin.users.toast.delete_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}
