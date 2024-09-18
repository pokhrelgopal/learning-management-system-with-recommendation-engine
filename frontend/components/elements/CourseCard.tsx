import { addToCart } from "@/app/server";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { Edit3, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import { mediaUrl } from "@/app/endpoints";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Props {
  course: any;
}
const CourseCard = ({ course }: Props) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const handleAddToCart = async (id: any) => {
    if (!user) {
      showToast("error", "Please login to add to cart.");
      return;
    }
    try {
      const payload = {
        course_id: id,
        user_id: user?.id,
      };
      const res = await addToCart(payload);
      if (res.status === 201) {
        queryClient.invalidateQueries("cart" as InvalidateQueryFilters);
        showToast("success", `${course?.title} added to cart.`);
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        showToast("error", "Course already in cart.");
        return;
      }
      if (error.response?.status === 403) {
        showToast("error", "You are enrolled in this course.");
        return;
      }
      showToast("error", "Failed to add to cart.");
    }
  };
  return (
    <div className="relative block rounded-lg border p-2 shadow-sm shadow-indigo-100">
      {/* <p className="absolute -top-0.5 -left-0.5 bg-indigo-700 text-white px-3 py-1 rounded-r-full text-sm">
        {course?.category?.name}
      </p> */}
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
          <div className="flex justify-end">
            <span className="text-sm bg-green-100 px-3 py-1 rounded-full my-2 flex items-center gap-2">
              <span className="rounded-full h-2 w-2 bg-indigo-400"></span>
              <span> {course?.category?.name}</span>{" "}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-700">Rs {course?.price}</p>
            <p>
              <svg
                onClick={() => handleAddToCart(course.id)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 w-5 h-5 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </p>
          </div>

          <div>
            <dd className="font-medium text-lg mb-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p>
                      {course?.title.length > 30
                        ? course?.title.slice(0, 30) + "..."
                        : course?.title}
                    </p>
                  </TooltipTrigger>
                  {course?.title.length > 30 && (
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

export default CourseCard;
