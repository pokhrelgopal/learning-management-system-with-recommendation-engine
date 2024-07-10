"use client";
import React from "react";
import { getCourses } from "@/app/server";
import CourseContainer from "@/components/elements/CourseContainer";
import Error from "@/components/elements/Error";
import Spinner from "@/components/elements/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import SkeletonCourseLoader from "@/components/elements/SkeletonCourseLoader";

const Courses = () => {
  const [query, setQuery] = React.useState("");
  const [courses, setCourses] = React.useState([]);
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
  });

  React.useEffect(() => {
    if (data) setCourses(data);
  }, [data]);

  const handleSearch = () => {
    if (!query) {
      setCourses(data);
      return;
    }
    if (query.length < 3) {
      setCourses(data);
      return;
    }
    const filteredCourses = data?.filter((course: any) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setCourses(filteredCourses);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
        <SkeletonCourseLoader />
      </div>
    );
  if (error) return <Error />;

  return (
    <>
      <div className="flex justify-end">
        <div className="w-[500px] flex gap-2">
          <Input
            placeholder="Search Courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress} // Add this line
          />
          <Button onClick={handleSearch}>
            Search
            <Search className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </div>
      {courses?.length > 0 ? (
        <div>{data?.length > 0 && <CourseContainer courses={courses} />}</div>
      ) : (
        <section className="bg-white dark:bg-gray-900 my-16">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                <X className="inline-block w-10 h-10 bg-red-500 rounded-full text-white p-1" />
              </h2>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                We can&apos;t find any results for that search.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                Sorry, we can&apos;t find what you are looking for. Please try
                searching for something else.
              </p>
              <a
                href="#"
                className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
              >
                Back to Homepage
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Courses;
