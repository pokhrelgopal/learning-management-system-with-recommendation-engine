import { getSectionDiscussion, createDiscussion } from "@/app/server";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import Spinner from "./Spinner";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import showToast from "@/lib/toaster";
import useUser from "@/hooks/useUser";
import DiscussionCard from "./DiscussionCard";

type Props = {
  section: any;
};

const SelectedSection = ({ section }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sectionDiscussion", section?.id],
    queryFn: () => getSectionDiscussion(section?.id),
    enabled: !!section?.id,
  });

  const { user, isLoading: userLoading } = useUser();
  const queryClient = useQueryClient();
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  if (isLoading) return <Spinner />;

  const handleSubmit = async () => {
    if (!message) return showToast("error", "Message cannot be empty.");
    if (message.length < 5)
      return showToast("error", "Message must be at least 5 characters.");
    if (message.length > 300)
      return showToast("error", "Message must be at most 300 characters.");

    try {
      setSubmitting(true);
      const payload = {
        message,
        section_id: section.id,
        user_id: user?.id,
      };
      const res = await createDiscussion(payload);
      if (res.status === 201) {
        showToast("success", "Message sent successfully.");
        await queryClient.invalidateQueries(
          "sectionDiscussion" as InvalidateQueryFilters
        );
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      showToast("error", "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold">{section?.title}</h2>
      <div>
        <h2 className="text-2xl font-bold my-5">Discussions</h2>
        <div className="mb-4 space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="w-full text-lg"
          />
          <Button
            loading={submitting || isLoading || userLoading}
            onClick={handleSubmit}
            className="w-40 text-lg"
          >
            Send
          </Button>
        </div>
        <div className="space-y-3">
          {data?.map((discussion: any) => (
            <DiscussionCard
              queryClient={queryClient}
              key={discussion.id}
              discussion={discussion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedSection;
