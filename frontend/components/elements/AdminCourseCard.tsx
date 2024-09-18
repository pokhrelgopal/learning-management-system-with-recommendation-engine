import Image from "next/image";
import Link from "next/link";
import React from "react";
import { mediaUrl } from "@/app/endpoints";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Edit3 } from "lucide-react";
interface Props {
  course: any;
}
const AdminCourseCard = ({ course }: Props) => {
  return (
    <div className="relative block rounded-lg border p-2 shadow-sm shadow-indigo-100">
      <Link href={`/courses/${course?.slug}`}>
        <Image
          src={
            course?.thumbnail.startsWith("http")
              ? course?.thumbnail
              : mediaUrl + course?.thumbnail
          }
          priority
          alt={course?.title}
          width={300}
          height={200}
          className="rounded-lg border w-full object-cover h-44"
        />
      </Link>
      <div className="mt-2">
        <dl className="">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-700">Rs {course?.price}</p>
            <p>
              <span className="text-sm bg-green-100 px-3 py-1 rounded-full my-2 flex items-center gap-2">
                <span className="rounded-full h-2 w-2 bg-indigo-400"></span>
                <span> {course?.category?.name}</span>{" "}
              </span>
            </p>
          </div>

          <div>
            <dd className="font-medium text-lg mb-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p>
                      {course?.title.length > 28
                        ? course?.title.slice(0, 28) + "..."
                        : course?.title}
                    </p>
                  </TooltipTrigger>
                  {course?.title.length > 28 && (
                    <TooltipContent>
                      <p>{course?.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </dd>
          </div>
          <dd className=" text-gray-500 flex items-center gap-2 text-sm">
            <Edit3 className="w-4 h-4 inline-block" />
            <span>{course?.instructor?.full_name}</span>
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default AdminCourseCard;
