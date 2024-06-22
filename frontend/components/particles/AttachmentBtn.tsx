import { Link, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { mediaUrl } from "@/app/endpoints";
import showToast from "@/lib/toaster";
import { deleteAttachment } from "@/app/server";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";

type Props = {
  attachment: any;
};

const AttachmentBtn = ({ attachment }: Props) => {
  const queryClient = useQueryClient();
  const handleDeleteAttachment = async () => {
    try {
      const res = await deleteAttachment(attachment.id);
      if (res.status === 204) {
        showToast("success", "Attachment deleted successfully.");
        queryClient.invalidateQueries("course" as InvalidateQueryFilters);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to delete attachment.");
    }
  };
  return (
    <div key={attachment.id} className="relative flex items-center gap-2">
      <Button variant={"secondary"}>
        <a target="_blank" href={mediaUrl + attachment.file}>
          <span className="flex items-center gap-2">
            <Link size={18} />
            {attachment.name}
          </span>
        </a>
      </Button>
      <span
        onClick={handleDeleteAttachment}
        className="cursor-pointer absolute -top-3 -left-3 bg-red-500 text-white rounded-full p-1"
      >
        <Trash2 size={16} />
      </span>
    </div>
  );
};

export default AttachmentBtn;
