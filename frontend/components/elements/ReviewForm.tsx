import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import RatingComponent from "./RatingComponent";
import { createRating } from "@/app/server";
import { Button } from "../ui/button";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";

type Props = {
  courseId: string;
};

const ReviewForm = ({ courseId }: Props) => {
  const queryClient = useQueryClient();
  const [review, setReview] = React.useState("");
  const [rating, setRating] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const { user, isLoading } = useUser();

  const handleGiveReview = async () => {
    if (!user) return showToast("error", "You need to be logged in to review.");
    if (!review) return showToast("error", "Review cannot be empty.");
    if (review.length < 10)
      return showToast("error", "Review must be at least 10 characters long.");
    if (review.length > 200)
      return showToast("error", "Review must be at most 200 characters long.");
    //review cant have just numbers
    if (/^\d+$/.test(review))
      return showToast("error", "Review cannot be only numbers.");
    try {
      setLoading(true);
      const payload = {
        user_id: user?.id,
        course_id: courseId,
        review,
        rating,
      };
      const res = await createRating(payload);
      if (res.status === 201) {
        showToast("success", "Review submitted successfully.");
        queryClient.invalidateQueries("course" as InvalidateQueryFilters);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        showToast("error", "You have already reviewed the course.");
      } else if (error?.response?.status === 403) {
        showToast("error", "You need to be enrolled.");
      } else {
        showToast("error", "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
      document.getElementById("cancelReviewForm")?.click();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-gray-100 px-3 py-2 text-gray-600 rounded-lg">
        Write a review
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div>
          <RatingComponent rating={rating} setRating={setRating} />
        </div>
        <div>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here."
            className="w-full"
            rows={5}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel id="cancelReviewForm">Cancel</AlertDialogCancel>
          <Button loading={loading || isLoading} onClick={handleGiveReview}>
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewForm;
