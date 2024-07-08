import { mediaUrl } from "@/app/endpoints";
import { instructorEarnings } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import Spinner from "./Spinner";

type Props = {
  data: any;
};

const UserCard = ({ data }: Props) => {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["earnings", data.id],
    queryFn: () => instructorEarnings(data.id),
  });
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <tr className="group odd:bg-gray-50 hover:bg-emerald-500 transition duration-400 ease-in-out text-lg cursor-pointer">
      <td className="whitespace-nowrap px-4 py-2 font-medium ">
        <p className="flex items-center gap-2">
          <Image
            src={mediaUrl + data.profile_image}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full h-10 w-10 object-cover"
          />
          <span className="group-hover:text-white">{data.full_name}</span>
        </p>
      </td>
      <td className="group-hover:text-white whitespace-nowrap px-4 py-2 text-gray-700">
        {data.email}
      </td>
      <td className="group-hover:text-white whitespace-nowrap px-4 py-2 text-gray-700">
        {data.role === "student"
          ? data.enrollments?.length
          : data.courses?.length}
      </td>
      {data.role == "instructor" && (
        <td className="group-hover:text-white whitespace-nowrap px-4 py-2 text-gray-700">
          $ {earnings?.total_earning}
        </td>
      )}
    </tr>
  );
};

export default UserCard;
