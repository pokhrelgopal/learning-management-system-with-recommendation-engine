"use client";
import { getCourses } from "@/app/server";
import CourseContainer from "@/components/elements/CourseContainer";
import Error from "@/components/elements/Error";
import Spinner from "@/components/elements/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import React from "react";

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

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <>
      <div className="flex justify-end">
        <div className="w-[500px] flex gap-2">
          <Input
            placeholder="Search Courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        <h2 className="text-2xl text-center my-40">No courses found.</h2>
      )}
    </>
  );
};

export default Courses;
