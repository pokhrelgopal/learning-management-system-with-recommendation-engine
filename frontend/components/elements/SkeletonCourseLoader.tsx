import React from "react";

const SkeletonCourseLoader = () => {
  return (
    <div className="animate-pulse block rounded-lg border p-4 shadow-sm shadow-indigo-100">
      <div className="rounded-lg bg-gray-300 h-44 w-full"></div>
      <div className="mt-2">
        <dl>
          <div className="flex justify-end mb-1 items-center">
            <span className="text-lg bg-gray-300 rounded w-24 h-6"></span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-gray-300 rounded h-4"></div>
          </div>
          <div>
            <dt className="sr-only">Title</dt>
            <dd className="font-medium text-lg bg-gray-300 rounded h-6 w-3/4"></dd>
          </div>
        </dl>
      </div>
      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Instructor</dt>
            <dd className="text-sm bg-gray-300 rounded h-5 w-1/2"></dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SkeletonCourseLoader;
