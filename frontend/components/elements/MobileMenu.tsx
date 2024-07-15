"use client";
import { AlignJustify } from "lucide-react";
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
import Link from "next/link";
import UserButtons from "../particles/UserButtons";
import useUser from "@/hooks/useUser";
import Spinner from "./Spinner";
import { Button } from "../ui/button";

const items = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Courses",
    link: "/courses",
  },
  {
    id: 3,
    name: "Profile",
    link: "/profile",
  },
  {
    id: 4,
    name: "My Learning",
    link: "/my-courses",
  },
];

type Props = {};

const MobileMenu = (props: Props) => {
  const { user, isLoading } = useUser();
  if (isLoading) return null;
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <AlignJustify size={24} className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col items-start justify-between h-full">
            <ul className="flex flex-col space-y-3">
              {items.map((item) => {
                return (
                  <Link key={item.id} href={item.link}>
                    <li
                      onClick={() => {
                        document.getElementById("closeMobileMenu")?.click();
                      }}
                      className={`cursor-pointer text-lg ease-in-out`}
                    >
                      {item.name}
                    </li>
                  </Link>
                );
              })}
            </ul>
            <div className="items-center gap-2">
              <UserButtons user={user} />
            </div>
          </div>
        </SheetContent>
        <SheetClose id="closeMobileMenu" />
      </Sheet>
    </>
  );
};

export default MobileMenu;
