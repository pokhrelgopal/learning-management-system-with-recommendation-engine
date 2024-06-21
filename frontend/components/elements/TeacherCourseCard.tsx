import Image from "next/image";
import Link from "next/link";
import React from "react";
import { mediaUrl } from "@/app/endpoints";
interface Props {
  course: any;
}
const TeacherCourseCard = ({ course }: Props) => {
  return (
    <div className="relative block rounded-lg border p-3 shadow-sm shadow-indigo-100">
      {!course.is_published && (
        <p className="absolute -top-0.5 -left-0.5 bg-red-500 text-white px-4 py-1.5 rounded-r-full">
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
            <p className="text-sm text-gray-500">$ {course?.price}</p>
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
