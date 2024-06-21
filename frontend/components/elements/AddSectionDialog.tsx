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
import { PlusCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "@/components/ui/switch";
import { createSection } from "@/app/server";
import showToast from "@/lib/toaster";

type Props = {
  courseId: any;
  queryClient: any;
};

const AddSectionDialog = ({ queryClient, courseId }: Props) => {
  const [title, setTitle] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [isFree, setIsFree] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const handleCreateSection = async () => {
    if (!title.trim() || !order.trim()) {
      showToast("error", "Fill all fields.");
      return;
    }
    try {
      setUpdating(true);
      const payload = new FormData();
      payload.append("title", title);
      payload.append("order", order);
      payload.append("is_free", isFree.toString());
      payload.append("course_id", courseId);
      if (videoFile) {
        payload.append("video", videoFile);
      }

      const res = await createSection(payload);
      if (res.status === 201) {
        showToast("success", "Section created successfully.");
        queryClient.invalidateQueries("course");
      }

      setTimeout(() => {
        setUpdating(false);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      showToast("error", "Failed to create section.");
      setUpdating(false);
      location.reload();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center gap-2 mb-2 bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
        <span>Add Section</span>
        <PlusCircle size={18} className="ml-2" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Section</AlertDialogTitle>
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
          <AlertDialogAction onClick={handleCreateSection} disabled={updating}>
            {updating ? "Creating..." : "Create Section"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddSectionDialog;
