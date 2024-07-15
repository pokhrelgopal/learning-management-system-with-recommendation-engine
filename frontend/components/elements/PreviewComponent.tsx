import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlayCircle, VideoIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { mediaUrl } from "@/app/endpoints";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { getPreview } from "@/app/server";

interface Props {
  course: any;
  courseId: string;
}

const PreviewComponent = ({ course, courseId }: Props) => {
  const [selected, setSelected] = React.useState("");
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["preview", courseId],
    queryFn: () => getPreview(courseId),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full relative">
      <Image
        src={course?.thumbnail}
        alt={course?.title}
        width={1920}
        height={1080}
        className="border w-full h-72 lg:h-[450px] object-cover rounded-2xl"
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <p>
            <PlayCircle className="z-20 w-20 h-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white animate-pulse cursor-pointer" />
          </p>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            {selected && (
              <div className="min-h-72">
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  onEnded={() => setSelected("")}
                  loop
                  key={selected}
                >
                  <source src={selected} type="video/mp4" />
                </video>
              </div>
            )}
          </AlertDialogHeader>
          <ScrollArea className="max-h-32">
            {data?.map((item: any) => (
              <div
                onClick={() => setSelected(mediaUrl + item.video)}
                key={item.id}
                className="bg-gray-100 p-3 cursor-pointer rounded-lg mb-2"
              >
                <p className="flex items-center gap-3">
                  <VideoIcon className="w-5 h-5" />
                  <span>{item.title}</span>
                </p>
              </div>
            ))}
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogCancel>Close Preview</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreviewComponent;
