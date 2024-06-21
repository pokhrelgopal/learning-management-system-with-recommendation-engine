"use client";
import { mediaUrl } from "@/app/endpoints";
import useEnrollment from "@/hooks/useEnrollment";
import { PlayCircle } from "lucide-react";
import React from "react";
import EnrollWarning from "./EnrollWarning";
import SelectedSection from "./SelectedSection";

type Props = {
  course: any;
};

const ProfileCourseContainer = ({ course }: Props) => {
  const [selectedSection, setSelectedSection] = React.useState(
    course.sections[0]
  );
  const activeClass = "border-r-indigo-700";
  const { enrolled } = useEnrollment(course.id);
  if (!enrolled) return <EnrollWarning slug={course.slug} />;
  return (
    <article className="flex">
      <aside className="w-96 fixed bg-gray-50 h-screen border-r">
        {course.sections
          .sort((a: any, b: any) => a.order - b.order)
          .map((section: any) => {
            const isActive = selectedSection.id === section.id;
            return (
              <p
                key={section.id}
                className={`cursor-pointer bg-white pl-10 py-5 border-b border-r-4 ${
                  isActive ? activeClass : "border-r-white"
                } flex items-center gap-2`}
                onClick={() => setSelectedSection(section)}
              >
                <PlayCircle size={24} />
                <span>
                  {section.order}. {section.title}
                </span>
              </p>
            );
          })}
      </aside>
      <section className="ml-96 p-1 w-full">
        <video
          key={selectedSection.id} // Add key to ensure re-render
          width="320"
          height="240"
          controls
          autoPlay
          className="w-full"
        >
          <source src={mediaUrl + selectedSection.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="p-5">
          <SelectedSection section={selectedSection} />
        </div>
      </section>
    </article>
  );
};

export default ProfileCourseContainer;
