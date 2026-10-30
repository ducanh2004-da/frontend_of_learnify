import { queryOptions } from "@tanstack/react-query";
import axios from "redaxios";

export type User = {
  id: string;
  name?: string;
  email: string;
  username?: string;
  role?: string;
  diamond?: number;
  currentSteak?: number;
  phoneNumber?: string;
  avatar?: string;
};

export const DEPLOY_URL = "http://localhost:3000";

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () =>
      axios
        .get<Array<User>>(DEPLOY_URL + "/api/users")
        .then((r) => r.data)
        .catch(() => {
          throw new Error("Failed to fetch users");
        }),
  });

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["users", id],
    queryFn: () =>
      axios
        .get<User>(DEPLOY_URL + "/api/users/" + id)
        .then((r) => r.data)
        .catch(() => {
          throw new Error("Failed to fetch user");
        }),
  });
