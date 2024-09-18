"use client";
import { getAdminStats } from "@/app/server";
import { BarChartExample } from "@/components/charts/BarChartExample";
import { PieDonutChart } from "@/components/charts/PieDonutChart";
import Spinner from "@/components/elements/Spinner";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CircleDollarSign, Users } from "lucide-react";
import React from "react";

const AdminDashboard = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
  });
  if (isLoading) return <Spinner />;
  const {
    total_students,
    total_instructors,
    total_courses,
    total_enrollments,
    total_payments,
  } = stats;
  return (
    <div>
      <div className="mt-5">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="w-full shadow border-l-4 border-indigo-600 p-4 flex items-center gap-4">
            <p className="bg-indigo-100 rounded-full p-3">
              <BookOpen size={32} className="block" />
            </p>
            <div>
              <p className="text-3xl font-bold mt-3">{total_courses}</p>
              <p className="text-lg">Total Courses</p>
            </div>
          </div>
          <div className="w-full shadow border-l-4 border-indigo-600 p-4 flex items-center gap-4">
            <p className="bg-indigo-100 rounded-full p-3">
              <Users size={32} className="block" />
            </p>
            <div>
              <p className="text-3xl font-bold mt-3">{total_enrollments}</p>
              <p className="text-lg">Total Enrollments</p>
            </div>
          </div>
          <div className="w-full shadow border-l-4 border-indigo-600 p-4 flex items-center gap-4">
            <p className="bg-indigo-100 rounded-full p-3">
              <CircleDollarSign size={32} className="block" />
            </p>
            <div>
              <p className="text-3xl font-bold mt-3">Rs {total_payments}</p>
              <p className="text-lg">Total Transactions</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-4 gap-6">
        <div className="h-[350px] col-span-2">
          <PieDonutChart
            total_instructors={total_instructors}
            total_students={total_students}
          />
        </div>
        <div className="col-span-2 h-[300px]">
          <BarChartExample />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
