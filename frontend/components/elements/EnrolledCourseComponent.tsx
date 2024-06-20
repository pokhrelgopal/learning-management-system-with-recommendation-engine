"use client";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import { getMyEnrollments } from "@/app/server";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import CourseCard from "./CourseCard";
const EnrolledCourseComponent = () => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["enrollments"],
    queryFn: getMyEnrollments,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  console.log(data);
  return (
    <div>
      <h1 className="text-3xl font-bold my-5">My Courses</h1>
      {data?.length === 0 && (
        <>
          <p className="text-lg">You are not enrolled in any courses yet.</p>
          <Button onClick={() => router.push("/courses")} className="mt-2">
            View Courses
            <ArrowRightCircle className="ml-2" />
          </Button>
        </>
      )}
      <div className="grid grid-cols-3">
        {data?.map((item: any) => (
          <CourseCard key={item.id} course={item?.course} />
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourseComponent;
