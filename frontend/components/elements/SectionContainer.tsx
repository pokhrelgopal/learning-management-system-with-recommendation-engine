import { Trash2 } from "lucide-react";
import React from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import EditSectionDialog from "./EditSectionDialog";
import { deleteSection } from "@/app/server";
import showToast from "@/lib/toaster";
import AddSectionDialog from "./AddSectionDialog";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
type Props = {
  courseId: any;
  sections: any[];
};

const SectionContainer = ({ sections, courseId }: Props) => {
  const queryClient = useQueryClient();
  const handleDeleteSection = async (id: any) => {
    try {
      const res = await deleteSection(id);
      if (res.status === 204) {
        showToast("success", "Section deleted successfully.");
        queryClient.invalidateQueries("course" as InvalidateQueryFilters);
      }
    } catch (error) {
      showToast("error", "Failed to delete section.");
      console.error(error);
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Section Details</h1>
      <p className="text-lg text-gray-600 mb-4">
        Here you can see the details of the sections of the course. You can also
        add, edit or delete the sections.
      </p>
      <div className="flex justify-end mb-3">
        <AddSectionDialog queryClient={queryClient} courseId={courseId} />
      </div>
      <div>
        {sections.map((section: any) => (
          <div
            key={section.id}
            className="mb-4 p-2 bg-gray-50 shadow-sm rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <p className="w-6 bg-primary rounded-full text-white flex justify-center">
                <span>{section.order}</span>
              </p>
              <h2 className="text-lg">{section.title}</h2>
            </div>
            <div className="flex items-center gap-4">
              <EditSectionDialog section={section} />
              <ConfirmationDialog
                buttonContent={
                  <Trash2
                    size={20}
                    className="cursor-pointer ml-2 text-red-600"
                  />
                }
                title={"Delete Section?"}
                description={`Are you sure you want to delete the section ${section.title}? This action cannot be undone.`}
                onConfirm={() => handleDeleteSection(section.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionContainer;
