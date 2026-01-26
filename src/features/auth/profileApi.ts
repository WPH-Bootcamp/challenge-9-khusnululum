import { useQuery } from "@tanstack/react-query";
import { authGet } from "@/lib/apiAuth";

export type ProfileResponse = {
  success: boolean;
  data: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return authGet<ProfileResponse>("/api/auth/profile");
    },
  });
}
