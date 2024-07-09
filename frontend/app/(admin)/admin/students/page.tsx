"use client";
import { getStudents } from "@/app/server";
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
      <Table className="text-lg">
        <TableCaption className="text-md">
          A list of registered students.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>No. of Enrolled Courses</TableHead>
            <TableHead className="text-right">Amount Spent</TableHead>
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

export default AdminStudents;
