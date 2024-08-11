"use client";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import { getMyEnrollments } from "@/app/server";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import ProfileCourseCard from "./ProfileCourseCard";

const EnrolledCourseComponent = () => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["enrollments"],
    queryFn: getMyEnrollments,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <div>
      {data?.length === 0 && (
        <>
          <p className="text-lg">You are not enrolled in any courses yet.</p>
          <Button onClick={() => router.push("/courses")} className="mt-2">
            View Courses
            <ArrowRightCircle className="ml-2" />
          </Button>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {data?.map((item: any) => (
          <ProfileCourseCard key={item.id} course={item?.course} />
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourseComponent;
