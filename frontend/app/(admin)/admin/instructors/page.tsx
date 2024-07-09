"use client";
import { getInstructors } from "@/app/server";
import Spinner from "@/components/elements/Spinner";
import UserCard from "@/components/elements/UserCard";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const AdminInstructor = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getInstructors"],
    queryFn: () => getInstructors(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="mt-5">
      <h1 className="text-3xl font-bold mb-6">Instructors</h1>

      {/* <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Courses Created
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-lg text-left text-gray-900">
                  Total Earnings
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
      </div> */}
      <Table className="text-lg">
        <TableCaption className="text-md">
          A list of registered teachers.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>No. of Courses Created</TableHead>
            <TableHead className="text-right">Total Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((student: any) => {
            return <UserCard key={student.id} data={student} />;
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminInstructor;
