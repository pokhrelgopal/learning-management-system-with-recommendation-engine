import { mediaUrl } from "@/app/endpoints";
import Image from "next/image";
import React from "react";
import StarComponent from "../particles/StarComponent";
import ReviewForm from "./ReviewForm";
type Props = {
  courseId: string;
  reviews: any;
};

const CourseReviews = ({ reviews, courseId }: Props) => {
  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-3">Reviews</h1>
      <ReviewForm courseId={courseId} />
      <div className="mt-3 space-y-4">
        {reviews?.length > 0 &&
          reviews.map((review: any) => {
            return (
              <div
                className="p-2 bg-gray-50 rounded-lg text-lg"
                key={review.id}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Image
                      src={mediaUrl + review.user?.profile_image}
                      alt={review.user?.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <p>{review.user?.full_name}</p>
                  </div>
                  <div className="ml-10">
                    <p className="my-">
                      <StarComponent count={parseInt(review.rating)} />
                    </p>
                    <p className="text-gray-600">{review?.review}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CourseReviews;
