import React from "react";
import Image from "next/image";
import { mediaUrl } from "@/app/endpoints";
import { ArrowRightCircle, Reply, Trash2Icon } from "lucide-react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import showToast from "@/lib/toaster";
import { createReply, deleteReply, deleteDiscussion } from "@/app/server";
import { InvalidateQueryFilters } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import ConfirmationDialog from "./ConfirmationDialog";
type Props = {
  discussion: any;
  queryClient: any;
};

const DiscussionCard = ({ discussion, queryClient }: Props) => {
  const [viewReplyBox, setViewReplyBox] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const { user, isLoading } = useUser();
  const handleReply = async () => {
    if (!message.trim()) {
      showToast("error", "Message cannot be empty.");
    }
    if (message.length > 400) {
      showToast("error", "Message must be at most 400 characters.");
    }
    try {
      setSending(true);
      const payload = {
        message,
        discussion_id: discussion.id,
        user_id: user?.id,
      };
      const res = await createReply(payload);
      if (res.status === 201) {
        setMessage("");
        setViewReplyBox(false);
        await queryClient.invalidateQueries(
          "sectionDiscussion" as InvalidateQueryFilters
        );
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };
  const handleDeleteReply = async (id: any) => {
    try {
      const res = await deleteReply(id);
      if (res.status === 204) {
        await queryClient.invalidateQueries(
          "sectionDiscussion" as InvalidateQueryFilters
        );
      }
    } catch (error) {
      showToast("error", "An error occurred. Please try again.");
    }
  };

  const handleDeleteDiscussion = async (id: any) => {
    try {
      const res = await deleteDiscussion(id);
      if (res.status === 204) {
        showToast("success", "Discussion deleted.");
        await queryClient.invalidateQueries(
          "sectionDiscussion" as InvalidateQueryFilters
        );
      }
    } catch (error) {
      showToast("error", "An error occurred. Please try again.");
    }
  };
  return (
    <div className="p-2 bg-gray-50 rounded-lg" key={discussion.id}>
      <div>
        <div className="flex items-center justify-between gap-2 text-lg">
          <div className="flex items-center gap-2">
            <Image
              src={mediaUrl + discussion.user?.profile_image}
              alt={discussion.user?.name || "User"}
              width={80}
              height={80}
              className="rounded-full h-8 w-8 object-cover"
            />
            <p>{discussion.user?.full_name}</p>
          </div>
          {user?.id === discussion.user?.id && (
            <div>
              <ConfirmationDialog
                buttonContent={
                  <Trash2Icon
                    size={20}
                    className="cursor-pointer text-red-600"
                  />
                }
                title="Delete Reply"
                description="Are you sure you want to delete this reply? All associated replies will be deleted as well."
                onConfirm={() => handleDeleteDiscussion(discussion.id)}
              />
            </div>
          )}
        </div>
        <div className="ml-10 text-lg">
          <p className="text-gray-600">{discussion?.message}</p>
        </div>
        {viewReplyBox && (
          <div className="ml-10 my-4">
            <Textarea
              placeholder="Reply to this message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end mt-3">
              <Button
                loading={sending || isLoading}
                onClick={handleReply}
                className="w-40"
              >
                <span className="text-lg">Reply</span>
                <ArrowRightCircle size={16} className="ml-3 text-lg" />
              </Button>
            </div>
          </div>
        )}
        <Button
          loading={isLoading}
          onClick={() => setViewReplyBox(!viewReplyBox)}
          variant={"ghost"}
          className="my-2 ml-10 flex items-center gap-2 cursor-pointer"
        >
          <Reply size={16} className="cursor-pointer" />
          <span>
            {viewReplyBox ? "Hide Reply Box" : "Reply to this message"}
          </span>
        </Button>
        <div className="space-y-5">
          {discussion.replies?.map((reply: any) => {
            return (
              <div key={reply.id} className="ml-10">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <Image
                      src={mediaUrl + reply.user?.profile_image}
                      alt={reply.user?.name || "User"}
                      width={32}
                      height={32}
                      className="h-12 w-12 rounded-full"
                    />
                    <p>{reply.user?.full_name}</p>
                  </div>
                  {user?.id == reply.user?.id && (
                    <div>
                      <ConfirmationDialog
                        buttonContent={
                          <Trash2Icon
                            size={20}
                            className="cursor-pointer text-red-600"
                          />
                        }
                        title="Delete Reply"
                        description="Are you sure you want to delete this reply?"
                        onConfirm={() => handleDeleteReply(reply.id)}
                      />
                    </div>
                  )}
                </div>
                <div className="ml-10">
                  <p className="text-gray-600">{reply?.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
