import { addToCart } from "@/app/server";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
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
    <div className="block rounded-lg border p-4 shadow-sm shadow-indigo-100">
      <Link href={`/courses/${course?.slug}`}>
        <Image
          src={course?.thumbnail}
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
            <p>
              <ShoppingCart
                onClick={() => handleAddToCart(course.id)}
                className="w-5 h-5 cursor-pointer"
              />
            </p>
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

export default CourseCard;
