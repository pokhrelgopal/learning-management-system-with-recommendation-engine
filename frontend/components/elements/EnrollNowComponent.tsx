import React from "react";
import { Button } from "../ui/button";
import { ArrowRightCircle, BadgeDollarSignIcon } from "lucide-react";
import useEnrollment from "@/hooks/useEnrollment";
import ConfirmationDialog from "./ConfirmationDialog";
import { initiatePayment } from "@/utils/khalti";
import showToast from "@/lib/toaster";
import { useRouter } from "next/navigation";

type Props = {
  courseId: string;
  course: any;
};

const EnrollNowComponent = ({ courseId, course }: Props) => {
  const [paying, setPaying] = React.useState(false);
  const router = useRouter();
  const { enrolled, isLoading } = useEnrollment(courseId);
  const handleEnrollment = async () => {
    try {
      setPaying(true);
      const formData = {
        return_url: `http://localhost:3000/payment-success`,
        website_url: "http://localhost:3000",
        amount: parseFloat(course?.price) * 100,
        purchase_order_id: courseId,
        purchase_order_name: course?.title,
      };
      const response = await initiatePayment(formData);
      const { payment_url } = response;
      if (!payment_url) {
        showToast("error", "Failed to initiate payment.");
        return;
      }
      router.push(payment_url);
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to initiate payment.");
    } finally {
      setPaying(false);
    }
  };
  return (
    <>
      {enrolled ? (
        <Button
          loading={isLoading}
          className="text-lg w-full flex items-center gap-3"
        >
          Go to Course
          <ArrowRightCircle className="w-5 h-5 inline-block" />
        </Button>
      ) : (
        <ConfirmationDialog
          title="Enroll Now ?"
          description="Are you sure you want to enroll in this course? You will be taken to Khalti for payment."
          onConfirm={handleEnrollment}
          buttonContent={
            <Button
              loading={isLoading || paying}
              className="text-lg w-full flex items-center gap-3"
            >
              <BadgeDollarSignIcon className="w-5 h-5 inline-block" />
              Enroll Now
            </Button>
          }
        />
      )}
    </>
  );
};

export default EnrollNowComponent;
