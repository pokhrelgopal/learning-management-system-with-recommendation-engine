"use client";
import { ChevronDownCircle, LogIn } from "lucide-react";
import React from "react";
import CartComponent from "../elements/CartComponent";
import { logout } from "@/lib/utils";
import Mode from "./Mode";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  user: any;
}

const UserButtons = ({ user }: Props) => {
  return (
    <div className="relative flex items-center gap-5">
      {user && (
        <>
          <Mode />
          <CartComponent />
          <div className="hidden lg:block">
            <Popover>
              <PopoverTrigger>
                <p className="bg-black  px-2.5 py-1.5 rounded-md text-white flex items-center gap-2">
                  <span>{user.full_name}</span>
                  <ChevronDownCircle size={16} />
                </p>
              </PopoverTrigger>
              <PopoverContent className="z-[100000] w-40 space-y-3 p-1">
                <p
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-300 ease-in-out"
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogIn size={16} className="mr-2" />
                  <span>Logout</span>
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <button
              onClick={() => {
                logout();
              }}
              className="lg:hidden bg-black text-white px-3 py-1.5 rounded-md flex items-center"
            >
              <span>Logout</span>
              <LogIn size={16} className="ml-2" />
            </button>
          </div>
        </>
      )}
      {!user && (
        <Link href="/login">
          <Button className="block lg:hidden">Login</Button>
        </Link>
      )}
    </div>
  );
};

export default UserButtons;
