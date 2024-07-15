import React from "react";
import Image from "next/image";
import { mediaUrl } from "@/app/endpoints";
import { ArrowRightCircle, EditIcon, Reply, Trash2Icon } from "lucide-react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import showToast from "@/lib/toaster";
import {
  createReply,
  deleteReply,
  deleteDiscussion,
  updateDiscussion,
  updateReply,
} from "@/app/server";
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
  const [discussionMsg, setDiscussionMsg] = React.useState(discussion.message);
  const [sending, setSending] = React.useState(false);
  const { user, isLoading } = useUser();
  const [editingMessage, setEditingMessage] = React.useState(false);
  const [editingReplyId, setEditingReplyId] = React.useState(null);
  const [replyMessage, setReplyMessage] = React.useState("");

  const handleReply = async () => {
    if (!message.trim()) {
      showToast("error", "Message cannot be empty.");
      return;
    }
    if (message.length > 300) {
      showToast("error", "Message must be at most 300 characters.");
      return;
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
      showToast("error", "An error occurred. Please try again.");
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

  const handleUpdateDiscussion = async () => {
    try {
      const payload = {
        message: discussionMsg,
      };
      const res = await updateDiscussion(discussion.id, payload);
      if (res.status === 200) {
        showToast("success", "Discussion updated.");
        setEditingMessage(false);
        await queryClient.invalidateQueries(
          "sectionDiscussion" as InvalidateQueryFilters
        );
      }
    } catch (error) {
      showToast("error", "An error occurred. Please try again.");
    }
  };

  const handleUpdateReply = async (replyId: any) => {
    try {
      const payload = {
        message: replyMessage,
      };
      const res = await updateReply(replyId, payload); // Replace with your updateReply function
      if (res.status === 200) {
        showToast("success", "Reply updated.");
        setEditingReplyId(null);
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
            <div className="flex items-center gap-2">
              <p
                onClick={() => setEditingMessage(!editingMessage)}
                className="text-lg mt-1"
              >
                <EditIcon size={19} className="cursor-pointer text-blue-700" />
              </p>{" "}
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
          {editingMessage ? (
            <div>
              <Textarea
                value={discussionMsg}
                onChange={(e) => setDiscussionMsg(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end">
                <Button
                  variant={"outline"}
                  loading={sending || isLoading}
                  onClick={handleUpdateDiscussion}
                  className="w-40 mt-2"
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{discussion?.message}</p>
          )}
        </div>

        <div className="space-y-5 mt-4">
          {discussion.replies?.map((reply: any) => {
            return (
              <div key={reply.id} className="ml-10">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <Image
                      src={mediaUrl + reply.user?.profile_image}
                      alt={reply.user?.name || "User"}
                      width={100}
                      height={100}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <p>{reply.user?.full_name}</p>
                  </div>
                  {user?.id == reply.user?.id && (
                    <div className="flex items-center gap-1">
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
                      <div>
                        <p
                          onClick={() => {
                            setEditingReplyId(
                              editingReplyId === reply.id ? null : reply.id
                            );
                            setReplyMessage(reply.message);
                          }}
                          className="text-lg mt-1"
                        >
                          <EditIcon
                            size={19}
                            className="cursor-pointer text-blue-700"
                          />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-14">
                  {editingReplyId === reply.id ? (
                    <div>
                      <Textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end">
                        <Button
                          variant={"outline"}
                          loading={sending || isLoading}
                          onClick={() => handleUpdateReply(reply.id)}
                          className="w-40 mt-2"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">{reply?.message}</p>
                  )}
                </div>
              </div>
            );
          })}
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
      </div>
    </div>
  );
};

export default DiscussionCard;
