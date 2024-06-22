import { mediaUrl } from "@/app/endpoints";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Progress } from "@/components/ui/progress";
import {
  courseProgress,
  createCertificate,
  getCertificate,
} from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import SkeletonCourseLoader from "./SkeletonCourseLoader";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import showToast from "@/lib/toaster";
import useUser from "@/hooks/useUser";

interface Props {
  course: any;
}
const ProfileCourseCard = ({ course }: Props) => {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [loading, setLoading] = React.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["courseProgress", course?.id],
    queryFn: () => courseProgress(course?.id),
    enabled: !!course?.id,
    retry: 0,
  });
  const completed_percentage = data?.completed_percentage || 0;

  const handleGetCertificate = async () => {
    try {
      setLoading(true);
      const res = await getCertificate(course?.id);
      if (res.id) {
        router.push(`/certificate/${course?.id}`);
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        try {
          const res = await createCertificate({
            course_id: course?.id,
            user_id: user?.id,
          });
          if (res.status === 201) {
            router.push(`/certificate/${course?.id}`);
          }
        } catch (error: any) {
          showToast("error", "Something went wrong. Please try again later.");
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || userLoading) return <SkeletonCourseLoader />;
  return (
    <div className="block rounded-lg border p-4 shadow-sm shadow-indigo-100">
      <Link href={`/my-courses/${course?.slug}`}>
        <Image
          src={mediaUrl + course?.thumbnail}
          alt={course?.title}
          width={300}
          height={200}
          className="rounded-lg border w-full object-cover h-44"
        />
      </Link>
      <div className="mt-2">
        <dl>
          <div className="flex justify-end mb-1 items-center py-1">
            {completed_percentage < 100 && (
              <Button className="cursor-default" variant={"secondary"}>
                {completed_percentage}% Completed
              </Button>
            )}
            {completed_percentage === 100 && (
              <Button
                loading={loading}
                onClick={handleGetCertificate}
                variant={"secondary"}
              >
                Get Certificate
                <Trophy
                  size={20}
                  className="text-yellow-600 ml-2 cursor-pointer"
                />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mb-2">
            <Progress value={completed_percentage} />
          </div>

          <div>
            <dt className="sr-only">Title</dt>

            <dd className="font-medium text-lg">{course?.title}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Instructor</dt>

            <dd className="text-sm text-gray-500">
              By {course?.instructor?.full_name}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileCourseCard;
