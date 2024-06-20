import { BookOpen, CircleDollarSign, Users } from "lucide-react";
import React from "react";

const Instructor = () => {
  return (
    <article className="mt-5">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="w-full shadow border-l-4 border-indigo-600 p-4 flex items-center gap-4">
          <p className="bg-indigo-100 rounded-full p-3">
            <BookOpen size={32} className="block" />
          </p>
          <div>
            <p className="text-3xl font-bold mt-3">22</p>
            <p className="text-lg">Courses</p>
          </div>
        </div>
        <div className="w-full shadow border-l-4 border-indigo-600 p-4 flex items-center gap-4">
          <p className="bg-indigo-100 rounded-full p-3">
            <Users size={32} className="block" />
          </p>
          <div>
            <p className="text-3xl font-bold mt-3">238</p>
            <p className="text-lg">Students</p>
          </div>
        </div>
        <div className="w-full shadow border-l-4 border-indigo-600 p-4 flex items-center gap-4">
          <p className="bg-indigo-100 rounded-full p-3">
            <CircleDollarSign size={32} className="block" />
          </p>
          <div>
            <p className="text-3xl font-bold mt-3">$ 12300</p>
            <p className="text-lg">Income</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Instructor;