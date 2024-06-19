import React from "react";
import CourseCard from "./CourseCard";

interface Props {
  courses: any;
}

const CourseContainer = ({ courses }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-5">
      {courses?.map((course: any) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseContainer;
