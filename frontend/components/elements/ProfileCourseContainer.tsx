"use client";
import { mediaUrl } from "@/app/endpoints";
import useEnrollment from "@/hooks/useEnrollment";
import { ArrowRightCircle, ShieldAlert } from "lucide-react";
import React from "react";
import EnrollWarning from "./EnrollWarning";
import SelectedSection from "./SelectedSection";
import { createProgress } from "@/app/server";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "../ui/button";
import Spinner from "./Spinner";
import CourseSectionCard from "./CourseSectionCard";
import { useRouter } from "next/navigation";

type Props = {
  course: any;
};

const ProfileCourseContainer = ({ course }: Props) => {
  const [selectedSection, setSelectedSection] = React.useState(
    course.sections[0]
  );
  const router = useRouter();

  const { user, isLoading: userLoading } = useUser();
  const { enrolled, isLoading: enrollmentLoading } = useEnrollment(course.id);
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
          showToast("success", "Progress saved !");
          router.refresh();
        } else {
          showToast("success", "Progress saved !");
          return;
        }
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        return;
      }
      showToast("error", "An error occurred. Please try again.");
    }
  };
  if (userLoading || enrollmentLoading) {
    return <Spinner />;
  }
  if (!course.is_published) {
    return (
      <div>
        <div className="bg-gray-100 mt-10">
          <div className="bg-white p-6  md:mx-auto">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-5" />
            <div className="text-center">
              <h3 className="md:text-3xl text-base text-gray-900 font-semibold text-center">
                Access Denied!
              </h3>
              <p className="text-gray-600 my-2 text-lg">
                This course is not published yet.
              </p>

              <div className="py-10 text-center">
                <Link href={`/courses`} passHref>
                  <Button size={"lg"} className="text-lg">
                    Back to Courses
                    <ArrowRightCircle className="w-5 h-5 inline-block ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <article className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-8">
      <ScrollArea className="lg:max-h-screen">
        <aside className="w-full lg:w-[500px] lg:max-h-screen space-y-2">
          {course.sections
            .sort((a: any, b: any) => a.order - b.order)
            .map((section: any) => {
              const isActive = selectedSection?.id === section.id;
              return (
                <CourseSectionCard
                  key={section.id}
                  section={section}
                  isActive={isActive}
                  onClick={() => setSelectedSection(section)}
                />
              );
            })}
        </aside>
      </ScrollArea>
      <section className="p-1 w-full">
        <video
          key={selectedSection.id}
          width="320"
          height="240"
          controls
          preload="auto"
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
