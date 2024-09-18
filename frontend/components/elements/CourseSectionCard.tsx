import { isSectionCompleted } from "@/app/server";
import { useQuery } from "@tanstack/react-query";
import { CircleCheckBig, PlayCircle } from "lucide-react";
import React from "react";

type Props = {
  section: any;
  isActive: boolean;
  onClick: () => void;
};

const CourseSectionCard = ({ section, isActive, onClick }: Props) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["section", section.id],
    queryFn: () => isSectionCompleted(section.id),
  });
  const activeClass = "bg-indigo-600 text-white";
  if (isLoading)
    return (
      <div className="animate-pulse pl-2 py-5 bg-gray-100 rounded-lg w-full flex items-center gap-2">
        <div className="ml-1 h-7 w-7 bg-gray-300 rounded-full"></div>
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
      </div>
    );

  return (
    <p
      key={section.id}
      className={`cursor-pointer pl-2 py-5 bg-gray-50 rounded-lg w-full ${
        isActive ? activeClass : ""
      } flex items-center gap-2`}
      onClick={onClick}
    >
      {!data.is_completed && <PlayCircle size={29} className="ml-1" />}
      {data.is_completed && (
        <CircleCheckBig size={29} className="ml-1 text-green-500" />
      )}
      <span>{section.title}</span>
    </p>
  );
};

export default CourseSectionCard;
