import { checkEnrollment } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";

type Response = {
  enrolled: boolean;
};

const useEnrollment = (courseId: string) => {
  const { user } = useUser();
  const { data, isLoading, error } = useQuery<Response>({
    queryKey: ["enrollment", courseId],
    queryFn: () => checkEnrollment(courseId),
    retry: 0,
    enabled: !!user,
  });

  const enrolled = data?.enrolled;

  return {
    enrolled: enrolled,
    isLoading,
    error,
  };
};

export default useEnrollment;
