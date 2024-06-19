import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Learn Anytime, Anywhere
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Access our platform to continue your learning journey on the go,
            with all your courses and materials at your fingertips.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/courses">
              <p className="block w-full rounded bg-indigo-600 px-12 py-3 font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring active:bg-indigo-500 sm:w-auto">
                <span>Start Learning</span>
                <ArrowRightCircle className="inline-block w-6 h-6 ml-2" />
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
