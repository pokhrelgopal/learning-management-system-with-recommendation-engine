import { mediaUrl } from "@/app/endpoints";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  course: any;
}
const ProfileCourseCard = ({ course }: Props) => {
  return (
    <div className="block rounded-lg border p-4 shadow-sm shadow-indigo-100">
      <Link href={`/profile/courses/${course?.slug}`}>
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
            {/* ! Progress Bar Later */}
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
