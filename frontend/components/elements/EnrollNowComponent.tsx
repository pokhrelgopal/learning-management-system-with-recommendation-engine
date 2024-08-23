import React from "react";
import { Button } from "../ui/button";
import { ArrowRightCircle, BadgeDollarSignIcon } from "lucide-react";
import useEnrollment from "@/hooks/useEnrollment";
import ConfirmationDialog from "./ConfirmationDialog";
import { initiatePayment } from "@/utils/khalti";
import showToast from "@/lib/toaster";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPayment } from "@/app/server";
import useUser from "@/hooks/useUser";

type Props = {
  courseId: string;
  course: any;
};

const EnrollNowComponent = ({ courseId, course }: Props) => {
  const { user } = useUser();

  const [paying, setPaying] = React.useState(false);
  const router = useRouter();
  const { enrolled, isLoading } = useEnrollment(courseId);
  const handleEnrollment = async () => {

    try {
      setPaying(true);
      const formData = {
        return_url: `http://localhost:3000/payment-success`,
        website_url: "http://localhost:3000",
        amount: Math.floor(parseFloat(course?.price) * 100),
        purchase_order_id: courseId,
        purchase_order_name: course?.title,
      };
      // console.log(formData);
      const response = await initiatePayment(formData);
      //console.log(response);
      const { payment_url, pidx } = response;
      if (!payment_url) {
        showToast("error", "Failed to initiate payment.");
        return;
      } else {
        try {
          setPaying(true);
          await createPayment({
            course_id: course.id,
            user_id: user?.id,
            pidx: pidx,
            amount: parseFloat(course.price),
          });
          router.push(payment_url);
        } catch (error: any) {
          if (error.response.status === 409) {
            showToast(
              "error",
              "Error Occurred in Khalti Server. Please try again later."
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to initiate payment.");
    } finally {
      setPaying(false);
    }
  };
  return (
    <div className="space-y-3">
      {enrolled ? (
        <Link className="pt-2" href={`/my-courses/${course?.slug}`}>
          <Button
            loading={isLoading}
            className="text-lg w-full flex items-center gap-3"
          >
            Go to Course
            <ArrowRightCircle className="w-5 h-5 inline-block" />
          </Button>
        </Link>
      ) : (
        <ConfirmationDialog
          title="Enroll Now ?"
          description="Are you sure you want to enroll in this course? You will be taken to Khalti for payment."
          onConfirm={handleEnrollment}
          buttonContent={
            <Button
              loading={isLoading || paying}
              className="text-lg w-full flex items-center gap-3 mt-3"
            >
              <BadgeDollarSignIcon className="w-5 h-5 inline-block" />
              Enroll Now
            </Button>
          }
        />
      )}
    </div>
  );
};

export default EnrollNowComponent;
