"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { getPaymentDetails } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function BarChartExample() {
  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPaymentDetails(),
  });

  if (!payments) return null;
  const chartData = payments;

  const chartConfig = {
    earning: {
      label: "Earnings",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  console.log(payments);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Earnings each month</CardTitle>
        <CardDescription>
          As of {chartData[0].month} - {chartData[chartData.length - 1].month}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="earning" fill="var(--color-earning)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
