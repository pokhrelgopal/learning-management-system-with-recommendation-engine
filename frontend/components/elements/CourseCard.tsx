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
      <p className="absolute -top-0.5 -left-0.5 bg-indigo-700 text-white px-3 py-1 rounded-r-full text-sm">
        {course?.category?.name}
      </p>
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
            <p className="font-semibold text-gray-500">Rs {course?.price}</p>
            <p>
              <ShoppingCart
                onClick={() => handleAddToCart(course.id)}
                className="w-5 h-5 cursor-pointer"
              />
            </p>
          </div>

          <div>
            <dd className="font-medium text-lg">
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
          <dd className=" text-gray-500 flex items-center gap-2">
            <Edit3 className="w-4 h-4 inline-block" />
            <span>{course?.instructor?.full_name}</span>
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default CourseCard;
