"use client";
import { mediaUrl } from "@/app/endpoints";
import useEnrollment from "@/hooks/useEnrollment";
import { PlayCircle } from "lucide-react";
import React from "react";
import EnrollWarning from "./EnrollWarning";
import SelectedSection from "./SelectedSection";
import { createProgress } from "@/app/server";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";

type Props = {
  course: any;
};

const ProfileCourseContainer = ({ course }: Props) => {
  const [selectedSection, setSelectedSection] = React.useState(
    course.sections[0]
  );
  const { user } = useUser();
  const activeClass = "border-r-indigo-700";
  const { enrolled } = useEnrollment(course.id);
  if (!enrolled) return <EnrollWarning slug={course.slug} />;
  const handleVideoEnd = async () => {
    try {
      const payload = {
        section_id: selectedSection.id,
        user_id: user?.id,
        completed: true,
      };
      const res = await createProgress(payload);
      if (res.status === 201) {
        const nextSection = course.sections.find(
          (section: any) => section.order === selectedSection.order + 1
        );
        if (nextSection) {
          setSelectedSection(nextSection);
          showToast(
            "success",
            "Progress saved and moving to the next section!"
          );
        } else {
          showToast(
            "success",
            "Progress saved! You have completed the course."
          );
        }
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        return;
      }
      showToast("error", "An error occurred. Please try again.");
    }
  };

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
                <span>{section.title}</span>
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
          onEnded={handleVideoEnd}
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
