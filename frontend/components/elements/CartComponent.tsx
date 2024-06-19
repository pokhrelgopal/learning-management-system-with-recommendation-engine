import { ShoppingCart } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const CartComponent = () => {
  const count = 0;
  return (
    <Sheet>
      <SheetTrigger>
        <p className="relative">
          <ShoppingCart size={24} />
          <span className="absolute -top-3 -right-3 rounded-full p-1 text-xs w-full h-fit bg-red-500 text-white">
            {count}
          </span>
        </p>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
          <SheetDescription className="text-md">
            Your cart is empty. Add some items to get started
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CartComponent;
