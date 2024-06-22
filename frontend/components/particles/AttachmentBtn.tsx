import { Link } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { mediaUrl } from "@/app/endpoints";

type Props = {
  attachment: any;
};

const AttachmentBtn = ({ attachment }: Props) => {
  return (
    <div key={attachment.id} className="flex items-center gap-2">
      <a target="_blank" href={mediaUrl + attachment.file}>
        <Button variant={"secondary"}>
          <span className="flex items-center gap-2">
            <Link size={18} />
            {attachment.name}
          </span>
        </Button>
      </a>
    </div>
  );
};

export default AttachmentBtn;
