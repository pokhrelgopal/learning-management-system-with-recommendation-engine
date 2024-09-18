"use client";
import { getAllCourses } from "@/app/server";
import AdminCourseCard from "@/components/elements/AdminCourseCard";
import Spinner from "@/components/elements/Spinner";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const AdminCourses = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getAllCourses"],
    queryFn: () => getAllCourses(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="my-5">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>
      <div className="grid grid-cols-3 gap-4">
        {data?.map((course: any) => {
          return <AdminCourseCard key={course.id} course={course} />;
        })}
      </div>
    </div>
  );
};

export default AdminCourses;
