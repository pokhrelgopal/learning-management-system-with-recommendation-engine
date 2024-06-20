import { ChevronDownCircle, Video } from "lucide-react";
import React, { useState } from "react";

type Props = {
  sections: any;
};

const CourseSections = ({ sections }: Props) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    if (expandedSection === index) {
      setExpandedSection(null);
    } else {
      setExpandedSection(index);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Course Contents</h1>
      {sections.map((section: any, sectionIndex: number) => (
        <div
          key={section.id}
          className="bg-gray-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection(sectionIndex)}
        >
          <div className="flex items-center justify-between cursor-pointer">
            <span>{section.title}</span>
            <ChevronDownCircle
              className={`w-5 h-5 inline-block
               ${
                 expandedSection === sectionIndex
                   ? " transform rotate-180 transition ease-in-out duration-300"
                   : ""
               }
              `}
            />
          </div>

          {expandedSection === sectionIndex && (
            <div className="mt-4 space-y-3 ml-4">
              {section.modules.map((module: any) => (
                <p key={module.id} className="flex items-center gap-3">
                  <Video className="w-5 h-5 inline-block" />
                  <span>{module.title}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseSections;
