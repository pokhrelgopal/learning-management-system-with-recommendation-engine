import { recommendation } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SkeletonCourseLoader from "./SkeletonCourseLoader";
import CourseCard from "./CourseCard";

type Props = {
  slug: string;
};

const CourseRecommendation = ({ slug }: Props) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["recommendation", slug],
    queryFn: () => recommendation(slug),
  });
  if (isLoading)
    return (
      <div>
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
      </div>
    );

  return (
    <div className="mt-8">
      {data?.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold">You might also like</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
            {data?.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-bold">No recommendations found</h1>
      )}
    </div>
  );
};

export default CourseRecommendation;
