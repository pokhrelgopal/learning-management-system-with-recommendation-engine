import React from "react";
import { getCourseDetail } from "@/app/server";
import ProfileCourseContainer from "@/components/elements/ProfileCourseContainer";

const ProfileCourse = async ({ params }: any) => {
  const { slug } = params;
  const data = await getCourseDetail(slug);
  return <ProfileCourseContainer course={data} />;
};

export default ProfileCourse;
