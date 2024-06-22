"use client";
import { mediaUrl } from "@/app/endpoints";
import useEnrollment from "@/hooks/useEnrollment";
import { PlayCircle, Scroll } from "lucide-react";
import React from "react";
import EnrollWarning from "./EnrollWarning";
import SelectedSection from "./SelectedSection";
import { createProgress } from "@/app/server";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  course: any;
};

const ProfileCourseContainer = ({ course }: Props) => {
  const [selectedSection, setSelectedSection] = React.useState(
    course.sections[0]
  );
  const { user } = useUser();
  const activeClass = "bg-indigo-700 text-white";
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
    <article className="flex gap-8">
      <ScrollArea className="max-h-screen">
        <aside className="w-[500px] max-h-screen space-y-2">
          {course.sections
            .sort((a: any, b: any) => a.order - b.order)
            .map((section: any) => {
              const isActive = selectedSection.id === section.id;
              return (
                <p
                  key={section.id}
                  className={`cursor-pointer pl-2 border-r-4 py-5 bg-gray-50 rounded-lg ${
                    isActive ? activeClass : ""
                  } flex items-center gap-2`}
                  onClick={() => setSelectedSection(section)}
                >
                  <PlayCircle size={29} className="ml-1" />
                  <span>{section.title}</span>
                </p>
              );
            })}
        </aside>
      </ScrollArea>
      <section className="p-1 w-full">
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
        <div className="mt-5">
          <SelectedSection section={selectedSection} />
        </div>
      </section>
    </article>
  );
};

export default ProfileCourseContainer;
