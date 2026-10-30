import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import { GOOGLE_LOGIN_MUTATION } from "@/graphql/mutations";
import type { AuthResponse } from "@/gql/graphql";

async function googleLoginRequest(idToken: string) {
  const response = await graphqlClient.request<{ googleLogin: AuthResponse }>(
    GOOGLE_LOGIN_MUTATION,
    { idToken }
  );

  if (!response.googleLogin.success) {
    throw new Error(response.googleLogin.message || "Google Login failed");
  }

  return response.googleLogin;
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLoginRequest,
  });
}
