import Image from "next/image";
import Link from "next/link";
import React from "react";
import { mediaUrl } from "@/app/endpoints";
import { useQuery } from "@tanstack/react-query";
import { getStudentCount } from "@/app/server";
import SkeletonCourseLoader from "./SkeletonCourseLoader";
import { Users } from "lucide-react";
interface Props {
  course: any;
}
const TeacherCourseCard = ({ course }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["student-count", course.id],
    queryFn: () => getStudentCount(course.id),
  });

  if (isLoading) return <SkeletonCourseLoader />;
  return (
    <div className="relative block rounded-lg border p-1.5 shadow-sm shadow-indigo-100">
      {!course.is_published && (
        <p className="absolute top-1.5 left-1.5 bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg">
          Unpublished
        </p>
      )}
      <Link href={`/instructor/courses/${course?.slug}`}>
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-700">Rs {course?.price}</p>
            {data?.student_count > 0 && (
              <p className="flex items-center gap-1">
                <Users size={15} />
                <span>
                  {data?.student_count}{" "}
                  {data?.student_count === 1 ? "Student" : "Students"}
                </span>
              </p>
            )}
          </div>

          <div>
            <dt className="sr-only">Title</dt>

            <dd className="font-medium text-lg">{course?.title}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TeacherCourseCard;
