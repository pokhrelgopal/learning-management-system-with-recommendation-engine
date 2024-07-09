import { mediaUrl } from "@/app/endpoints";
import { instructorEarnings, studentSpending } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

type Props = {
  data: any;
};

const UserCard = ({ data }: Props) => {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["earnings", data.id],
    queryFn: () => instructorEarnings(data.id),
  });

  const { data: spending, isLoading: loading } = useQuery({
    queryKey: ["spending", data.id],
    queryFn: () => studentSpending(data.id),
  });

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-between m-3">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="rounded-full h-10 w-10 bg-gray-300"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-40 bg-gray-300 rounded my-1"></div>
        <div className="h-4 w-20 bg-gray-300 rounded my-1"></div>
        <div className="h-4 w-24 bg-gray-300 rounded my-1"></div>
      </div>
    );
  }
  console.log(spending);
  return (
    <TableRow>
      <TableCell className="flex items-center gap-2">
        <Image
          src={mediaUrl + data.profile_image}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full h-10 w-10 object-cover"
        />

        <span>{data.full_name}</span>
      </TableCell>
      <TableCell>{data.email}</TableCell>
      <TableCell>
        {data.role === "student"
          ? data.enrollments?.length
          : data.courses?.length}
      </TableCell>
      <TableCell className="text-right">
        {data.role === "student"
          ? spending?.total_spending > 0
            ? `$ ${spending?.total_spending}`
            : "-"
          : earnings?.total_earning > 0
          ? `$ ${earnings?.total_earning}`
          : "-"}
      </TableCell>
    </TableRow>
  );
};

export default UserCard;
