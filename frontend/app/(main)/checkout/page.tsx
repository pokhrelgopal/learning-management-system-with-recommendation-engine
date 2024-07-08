"use client";
import { mediaUrl } from "@/app/endpoints";
import { getCart } from "@/app/server";
import Spinner from "@/components/elements/Spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import showToast from "@/lib/toaster";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle, CircleDollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckoutPage = () => {
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (cart) {
      const calculatedTotal = cart.reduce((acc: any, item: any) => {
        return acc + parseFloat(item.course.price);
      }, 0);
      setTotal(calculatedTotal);
    }
  }, [cart]);

  if (isLoading) {
    return <Spinner />;
  }

  const handlePayNow = async () => {
    showToast("info", "Payment is not available right now.");
  };

  if (!cart || cart.length === 0) {
    return (
      <>
        <p className="text-lg mb-4">Your cart is empty.</p>
        <Button onClick={() => router.push("/courses")} className="mt-2">
          Add Courses to cart
          <ArrowRightCircle className="ml-2" />
        </Button>
      </>
    );
  }

  return (
    <div className="min-h-[400px]">
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2">
          <div className="space-y-3">
            {cart?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between bg-gray-50 p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={mediaUrl + item.course.thumbnail}
                    alt={item.course.title}
                    width={100}
                    className="rounded-lg"
                    height={100}
                  />
                  <div>
                    <p className="text-lg">{item.course.title}</p>
                    <p className="text-gray-500">
                      {item.course.instructor.full_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-lg">
                  <p className="flex items-center gap-1">
                    <CircleDollarSign size={24} />
                    <span>{item.course.price}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg h-fit">
          <h1 className="mb-3 text-2xl font-bold">Payment Info</h1>
          <div className="">
            <div>
              <p className="text-gray-600 text-lg">Payment Method</p>
              <div className="">
                <RadioGroup
                  defaultValue="comfortable"
                  className="flex items-center gap-2 mt-2"
                >
                  <RadioGroupItem value="khalti" id="r2" checked disabled />
                  <Label htmlFor="r2" className="text-lg">
                    Khalti Payment
                  </Label>
                </RadioGroup>
                <span className="text-gray-400 text-sm">
                  Currently, Only khalti payment is available for online
                  payments.
                </span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex items-center justify-between text-lg">
              <p>Total Amount</p>
              <p>$ {total.toFixed(2)}</p>
            </div>
            <div className="mt-4">
              <Button onClick={handlePayNow} className="w-full">
                <span className="text-lg">Pay Now</span>
                <ArrowRightCircle className="ml-3" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
