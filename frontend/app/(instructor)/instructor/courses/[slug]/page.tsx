"use client";
import { getCourseDetail } from "@/app/server";
import CourseUpdateForm from "@/components/elements/CourseUpdateForm";
import Error from "@/components/elements/Error";
import Spinner from "@/components/elements/Spinner";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CourseSingle = ({ params }: any) => {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: ["course", params.slug],
    queryFn: () => getCourseDetail(params.slug),
  });
  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return (
    <article className="mt-5">
      <CourseUpdateForm course={course} />
    </article>
  );
};

export default CourseSingle;
