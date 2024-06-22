import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit3 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "@/components/ui/switch";
import { updateSection } from "@/app/server";
import showToast from "@/lib/toaster";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";

type Props = {
  section: any;
};

const EditSectionDialog = ({ section }: Props) => {
  const [title, setTitle] = React.useState(section?.title);
  const [order, setOrder] = React.useState(section?.order);
  const [isFree, setIsFree] = React.useState(section?.is_free);
  const [updating, setUpdating] = React.useState(false);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const queryClient = useQueryClient();

  const handleUpdateSection = async () => {
    try {
      setUpdating(true);
      const payload = new FormData();
      payload.append("title", title);
      payload.append("order", order);
      payload.append("is_free", isFree.toString());
      if (videoFile) {
        payload.append("video", videoFile);
      }

      const res = await updateSection(section.id, payload);
      if (res.status === 200) {
        showToast("success", "Section updated successfully.");
        queryClient.invalidateQueries("course" as InvalidateQueryFilters);
      }

      setTimeout(() => {
        setUpdating(false);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Edit3 size={20} className="cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update {section?.title} ?</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <div className="form-group mt-2">
            <Label htmlFor="title" className="text-lg">
              Title
            </Label>
            <Input
              type="text"
              className="mt-1 text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <Label htmlFor="order" className="text-lg">
              Order
            </Label>
            <Input
              type="number"
              min={1}
              className="mt-1 text-lg"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <Label htmlFor="isFree" className="text-lg">
              Status
            </Label>
            <div className="mt-1 flex items-center gap-2">
              <Label htmlFor="isFree" className="text-lg">
                Not Free
              </Label>
              <Switch
                onCheckedChange={(checked) => setIsFree(checked)}
                checked={isFree}
              />
              <Label htmlFor="isFree" className="text-lg">
                Free
              </Label>
            </div>
          </div>
          <div className="form-group mt-2">
            <Label htmlFor="video" className="text-lg">
              Video
            </Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              className="mt-1 text-lg"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateSection} disabled={updating}>
            {updating ? "Updating..." : "Save Changes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSectionDialog;
