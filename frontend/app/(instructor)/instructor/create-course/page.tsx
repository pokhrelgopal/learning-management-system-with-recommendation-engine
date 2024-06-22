"use client";
import { createCourse } from "@/app/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CreateCourse = () => {
  const { user, isLoading } = useUser();
  const [title, setTitle] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const router = useRouter();
  const handleCourseCreation = async () => {
    if (title.trim() === "") {
      showToast("error", "Title is required.");
      return;
    }
    if (title.trim().length > 70) {
      showToast("error", "Title must be less than 70 characters.");
      return;
    }
    try {
      if (!user) {
        return;
      }
      setCreating(true);
      const payload = {
        title,
        instructor_id: user.id,
      };
      const res = await createCourse(payload);
      if (res.status === 201) {
        showToast("success", "Course created successfully.");
        setTitle("");
        router.push(`/instructor/courses/${res.data.slug}`);
      }
    } catch (error: any) {
      if (error.response?.data?.title) {
        showToast("error", error.response.data.title[0]);
        return;
      }
      showToast("error", "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };
  return (
    <article className="mt-5 flex flex-col justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <div className="flex flex-col">
        <Label className="text-2xl" htmlFor="title">
          Course Title
        </Label>
        <Label className="text-lg" htmlFor="info">
          Please give the course title. Title of the course must be unique.
        </Label>
        <Input
          type="text"
          placeholder="Eg. Introduction to Programming"
          className="mt-3 w-full xl:w-1/2 p-6 text-lg border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          loading={creating || isLoading}
          onClick={handleCourseCreation}
          variant={"default"}
          size={"lg"}
          className="text-lg w-fit mt-2"
        >
          Create Course
          <ArrowRight size={24} className="ml-2" />
        </Button>
      </div>
    </article>
  );
};

export default CreateCourse;
