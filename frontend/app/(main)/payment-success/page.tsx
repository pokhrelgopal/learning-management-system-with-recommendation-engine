"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import Spinner from "@/components/elements/Spinner";
import { completePayment } from "@/app/server";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";

const PaymentSuccess = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const [paying, setPaying] = React.useState(false);
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx") ?? "";
  const amount = searchParams.get("amount") ?? "";
  const status = searchParams.get("status") ?? "";
  const purchase_order_id = searchParams.get("purchase_order_id") ?? "";
  const transaction_id = searchParams.get("transaction_id") ?? "";

  React.useEffect(() => {
    if (
      !user ||
      error ||
      status !== "Completed" ||
      !purchase_order_id ||
      !transaction_id ||
      !pidx ||
      !amount
    ) {
      return;
    }
    
    const pay = async () => {
      try {
        setPaying(true);
        const data = { pidx: pidx };
        await completePayment(data);
        queryClient.invalidateQueries("cart" as InvalidateQueryFilters);
      } catch (error) {
        console.log(error);
      } finally {
        setPaying(false);
      }
    };

    pay();
  }, [user, error, status, purchase_order_id, transaction_id, pidx, amount, queryClient]);

  if (isLoading) return <Spinner />;
  if (status === "User canceled") {
    return (
      <div className="bg-gray-100">
        <div className="bg-white p-6 md:mx-auto">
          <X className="text-red-600 w-16 h-16 mx-auto my-6" />
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold">Payment Cancelled!</h3>
            <p className="text-gray-600 my-2">It seems you have cancelled the payment.</p>
            <div className="py-10 text-center">
              <Link href="/my-courses">
                <Button loading={paying} size="lg">
                  Go to course
                  <ArrowRightCircle className="w-5 h-5 inline-block ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100">
      <div className="bg-white p-6 md:mx-auto">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
          <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z" />
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold">Payment Done!</h3>
          <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
          <p>Have a great day!</p>
          <div className="py-10 text-center">
            <Link href="/my-courses">
              <Button loading={paying} size="lg">
                Go to course
                <ArrowRightCircle className="w-5 h-5 inline-block ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
