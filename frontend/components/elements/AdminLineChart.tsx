"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { getPaymentDetails } from "@/app/server";
import { useQuery } from "@tanstack/react-query";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const AdminLineChart = () => {
  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPaymentDetails(),
  });

  if (!payments) return null;

  const labels = payments.map((payment: any) =>
    new Date(payment.date).toLocaleDateString()
  );
  const dataValues = payments.map((payment: any) => payment.total_amount);

  const data = {
    labels,
    datasets: [
      {
        label: "Payments per Day",
        data: dataValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="w-full ">
      <Line data={data} />
    </div>
  );
};

export default AdminLineChart;
