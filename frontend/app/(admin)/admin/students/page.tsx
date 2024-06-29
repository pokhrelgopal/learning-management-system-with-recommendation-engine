"use client";
import { getStudents } from "@/app/server";
import Spinner from "@/components/elements/Spinner";
import UserCard from "@/components/elements/UserCard";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const AdminStudents = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getStudents"],
    queryFn: () => getStudents(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="mt-5">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Courses Enrolled
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data?.map((student: any) => {
                return <UserCard key={student.id} data={student} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
