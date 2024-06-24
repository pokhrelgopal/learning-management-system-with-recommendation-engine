"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

interface AdminChartProps {
  total_students: number;
  total_instructors: number;
}
const AdminPieChart = ({
  total_students,
  total_instructors,
}: AdminChartProps) => {
  const data = {
    labels: ["Students", "Instructors"],
    datasets: [
      {
        label: "Instructors vs Students",
        data: [total_students, total_instructors],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: ["#FF6384", "#4F46E5"],
      },
    ],
  };
  return (
    <div className="w-full flex items-center justify-center">
      <Doughnut data={data} />
    </div>
  );
};
export default AdminPieChart;
