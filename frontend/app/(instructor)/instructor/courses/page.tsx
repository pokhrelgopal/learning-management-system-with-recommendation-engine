"use client";
import { getMyCourses } from "@/app/server";
import Error from "@/components/elements/Error";
import Spinner from "@/components/elements/Spinner";
import TeacherCourseCard from "@/components/elements/TeacherCourseCard";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const InstructorCourses = () => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["my-courses"],
    queryFn: () => getMyCourses(),
  });
  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return (
    <article className="mt-5">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data?.map((course: any) => (
          <TeacherCourseCard key={course.id} course={course} />
        ))}
      </div>
    </article>
  );
};

export default InstructorCourses;
