import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/app/server";

type User = {
  id: string;
  role: string;
  full_name: string;
  email: string;
  profile_image: string;
};

const useUser = () => {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: 0,
  });

  return {
    user: data,
    isLoading,
    error,
  };
};

export default useUser;
