"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieDonutChartProps {
  total_students: number;
  total_instructors: number;
}

export function PieDonutChart({
  total_students,
  total_instructors,
}: PieDonutChartProps) {
  const chartData = [
    {
      browser: "Students",
      users: total_students,
      fill: "#6574cd",
    },
    {
      browser: "Instructors",
      users: total_instructors,
      fill: "#e88827",
    },
  ];

  const chartConfig = {
    users: {
      label: "Users",
    },
    chrome: {
      label: "Students",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Instructors",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.users, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Registered Users</CardTitle>
        <CardDescription>
          as of{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          This chart shows the number of users who are registered in the
          website.
        </div>
        <div className="leading-none text-muted-foreground"></div>
      </CardFooter>
    </Card>
  );
}
