import { Video } from "lucide-react";
import React from "react";

type Props = {
  sections: any;
};

const CourseSections = ({ sections }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Course Contents</h1>
      {sections.map((section: any) => (
        <div key={section.id} className="bg-gray-50 p-3 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <Video />
            <span>{section.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseSections;
