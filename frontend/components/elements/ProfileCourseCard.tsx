import { mediaUrl } from "@/app/endpoints";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { courseProgress } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";

interface Props {
  course: any;
}
const ProfileCourseCard = ({ course }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["courseProgress", course?.id],
    queryFn: () => courseProgress(course?.id),
    enabled: !!course?.id,
  });
  const completed_percentage = data?.completed_percentage || 0;
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
          <div className="flex justify-end mb-1 items-center">
            <span className="text-lg">
              {completed_percentage < 100 ? `${completed_percentage}%` : ""}{" "}
              Completed
            </span>
            {completed_percentage === 100 && (
              <Trophy
                size={20}
                className="text-yellow-600 ml-2 cursor-pointer"
              />
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
