"use client";
import { getCourseDetail } from "@/app/server";
import CourseInfoCard from "@/components/elements/CourseInfoCard";
import CourseRecommendation from "@/components/elements/CourseRecommendation";
import CourseReviews from "@/components/elements/CourseReviews";
import CourseSections from "@/components/elements/CourseSections";
import Error from "@/components/elements/Error";
import PreviewComponent from "@/components/elements/PreviewComponent";
import Spinner from "@/components/elements/Spinner";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CourseSingle = ({ params }: any) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["course", params.slug],
    queryFn: () => getCourseDetail(params.slug),
  });
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <Error />;
  }
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="w-full lg:col-span-4">
          <PreviewComponent course={data} courseId={data.id} />
          <div className="mt-5">
            <h1 className="text-3xl font-bold mb-3">{data.title}</h1>
            <p className="text-lg text-gray-500">{data.description}</p>
          </div>
          <div className="mt-5">
            <CourseSections sections={data?.sections} />
            <CourseReviews courseId={data.id} reviews={data?.reviews} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <CourseInfoCard course={data} />
        </div>
      </div>
      <CourseRecommendation slug={data.slug} />
    </>
  );
};

export default CourseSingle;
