import { ArrowRightCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
interface Props {
  slug: any;
}
const EnrollWarning = ({ slug }: Props) => {
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
              You need to enroll in this course to access the content.
            </p>

            <div className="py-10 text-center">
              <Link href={`/courses/${slug}`} passHref>
                <Button size={"lg"} className="text-lg">
                  Go to course
                  <ArrowRightCircle className="w-5 h-5 inline-block ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollWarning;
