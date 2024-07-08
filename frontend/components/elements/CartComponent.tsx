import { ArrowRightCircle, ShoppingCart, Trash2Icon } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import { getCart, removeFromCart } from "@/app/server";
import Image from "next/image";
import { mediaUrl } from "@/app/endpoints";
import Link from "next/link";
import showToast from "@/lib/toaster";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const CartComponent = () => {
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const queryClient = useQueryClient();
  const handleRemove = async (id: string) => {
    try {
      const res = await removeFromCart(id);
      if (res.status === 204) {
        queryClient.invalidateQueries("cart" as InvalidateQueryFilters);
      }
    } catch (error) {
      showToast("error", "Failed to remove item from cart");
    } finally {
    }
  };
  return (
    <Sheet>
      <SheetTrigger>
        <p className="relative">
          <ShoppingCart size={24} />
          {!isLoading && (
            <span className="absolute -top-3 -right-3 rounded-full p-1 text-xs w-full h-fit bg-red-500 text-white">
              {cart?.length}
            </span>
          )}
        </p>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>

          <>
            {cart?.length == 0 ? (
              <SheetDescription className="text-md">
                Your cart is empty. Add some items to get started.
              </SheetDescription>
            ) : (
              <div>
                <ScrollArea className="min-h-[80vh]">
                  <div className="space-y-4 p-2">
                    {cart?.map((item: any) => (
                      <div
                        key={item.id}
                        className="relative flex items-center space-x-4 bg-gray-50 p-2 rounded-lg"
                      >
                        <div className="">
                          <Link
                            onClick={() => {
                              document.getElementById("close-cart")?.click();
                            }}
                            href={`/courses/${item.course.slug}`}
                          >
                            <Image
                              alt="cart"
                              src={`${mediaUrl}${item.course.thumbnail}`}
                              className="rounded-lg h-12 w-16 object-cover"
                              width={100}
                              height={100}
                            />
                          </Link>
                        </div>
                        <div>
                          <h1>
                            {item.course.title.slice(0, 25)}
                            {item.course.title.length > 25 ? "..." : ""}
                          </h1>
                          <h1>{item.course.price}</h1>
                        </div>
                        <p
                          onClick={() => handleRemove(item.id)}
                          className="absolute cursor-pointer -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2Icon size={20} />
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Link
                  onClick={() => {
                    document.getElementById("close-cart")?.click();
                  }}
                  href={"/checkout"}
                >
                  <Button className="mt-5 w-full" variant={"secondary"}>
                    Proceed to Checkout
                    <ArrowRightCircle className="w-5 h-5 inline-block ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        </SheetHeader>
      </SheetContent>
      <SheetClose id="close-cart" />
    </Sheet>
  );
};

export default CartComponent;
