"use client";
import { LogIn } from "lucide-react";
import React from "react";
import CartComponent from "../elements/CartComponent";
import { logout } from "@/lib/utils";

const UserButtons = () => {
  return (
    <div className="flex items-center gap-8">
      <CartComponent />
      <LogIn onClick={() => logout()} className="w-6 h-6 cursor-pointer" />
    </div>
  );
};

export default UserButtons;
