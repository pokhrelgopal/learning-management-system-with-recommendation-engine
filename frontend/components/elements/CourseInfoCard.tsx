import {
  BadgeDollarSignIcon,
  DownloadCloud,
  ShoppingCart,
  SmilePlus,
  VideoIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { addToCart } from "@/app/server";
import EnrollNowComponent from "./EnrollNowComponent";

interface Props {
  course: any;
}

const CourseInfoCard = ({ course }: Props) => {
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
      showToast("error", "Failed to add to cart.");
    }
  };
  return (
    <>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="mb-2">Full Course</p>
        <p className="space-x-5">
          <span className="text-2xl font-bold">$ {course?.price}</span>
        </p>
        <div className="mt-4">
          <p className="text-lg">Course Includes :</p>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center gap-3">
              <VideoIcon className="w-5 h-5" />
              <span>Video Lectures</span>
            </li>
            <li className="flex items-center gap-3">
              <DownloadCloud className="w-5 h-5" />
              <span>Downloadable Resources</span>
            </li>
          </ul>
        </div>
        <div className="mt-4 space-y-2">
          <Button
            onClick={() => handleAddToCart(course.id)}
            className="text-lg w-full flex items-center gap-3"
          >
            <ShoppingCart className="w-5 h-5 inline-block" />
            <span>Add to Cart</span>
          </Button>
          <EnrollNowComponent course={course} courseId={course.id} />
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 mt-3 flex items-center gap-6">
        <div>
          <SmilePlus size={28} className="text-yellow-600" />
        </div>
        <div className="w-full">
          <p className="text-gray-600 flex items-center justify-between space-y-2">
            <span>Rating</span>
            <span>⭐⭐⭐⭐⭐</span>
          </p>
          <p className="text-gray-600 flex items-center justify-between space-y-2">
            <span>2492 Students</span>
            <span>880 Ratings</span>
          </p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 mt-3">
        <p className="flex justify-between items-center w-full">
          <span className="text-lg font-bold">Publisher</span>
          <span className="text-gray-500 cursor-pointer">View profile</span>
        </p>
        <div className="mt-5 flex items-center gap-4">
          <Image
            src={course?.instructor?.profile_image}
            alt={course?.instructor?.name || "Instructor"}
            width={50}
            height={50}
            className="rounded-full h-12 w-12 object-cover"
          />
          <p className="flex flex-col">
            <span className="text-lg">{course?.instructor?.full_name}</span>
            <span>Instructor</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CourseInfoCard;
