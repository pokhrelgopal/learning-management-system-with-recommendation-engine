import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FilePlus2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import showToast from "@/lib/toaster";
import { createAttachment } from "@/app/server";
import { Button } from "../ui/button";
import AttachmentBtn from "../particles/AttachmentBtn";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";

type Props = { sectionId: any; attachments: any[] };

const AddResourceDialog = ({ attachments, sectionId }: Props) => {
  const queryClient = useQueryClient();
  const [adding, setAdding] = React.useState(false);
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const handleAddAttachment = async () => {
    if (!name.trim()) {
      showToast("error", "Attachment title is required.");
      return;
    }
    if (!file) {
      showToast("error", "Attachment file is required.");
      return;
    }
    try {
      setAdding(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("section_id", sectionId);
      formData.append("file", file);
      const res = await createAttachment(formData);
      if (res.status === 201) {
        showToast("success", "Attachment added successfully.");
        queryClient.invalidateQueries("course" as InvalidateQueryFilters);
        setName("");
        setFile(null);
      }
    } catch (error) {
      showToast("error", "Failed to add attachment.");
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <FilePlus2 size={20} className="cursor-pointer ml-2 text-primary" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            Update Attachments
          </AlertDialogTitle>
          <AlertDialogDescription>
            Here you can add attachments or remove existing ones.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mb-2 flex gap-3 flex-wrap">
          {attachments.map((attachment: any) => (
            <AttachmentBtn key={attachment.id} attachment={attachment} />
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group mb-3">
            <Label htmlFor="title" className="text-lg">
              Attachment Title
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="text-lg mt-1"
              placeholder="Eg. Theory slides"
            />
          </div>
          <div className="form-group mt-2">
            <Label htmlFor="file" className="text-lg">
              File
            </Label>
            <Input
              type="file"
              className="mt-1 text-lg"
              onChange={handleFileChange}
            />
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button loading={adding} onClick={handleAddAttachment}>
            Add Attachment
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddResourceDialog;
