"use client";
import React from "react";
import useUser from "@/hooks/useUser";
import Logo from "../particles/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/lib/utils";
import { ArrowLeft, ChevronDownCircle, LogOutIcon } from "lucide-react";
type Props = {};

const profileMenu = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Courses",
    href: "/profile/courses",
  },
];

const ProfileHeader = (props: Props) => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  return (
    <nav className="mx-10 h-16 flex flex-col justify-center">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-20">
          <Logo />
          <ul className="flex items-center space-x-10">
            {profileMenu.map((item) => (
              <Link href={item.href} key={item.title}>
                <p className="text-gray-700 text-lg">{item.title}</p>
              </Link>
            ))}
          </ul>
        </div>
        <div>
          {isLoading ? (
            <div>
              <Button variant={"secondary"} loading={isLoading}></Button>
            </div>
          ) : (
            <div>
              <Popover>
                <PopoverTrigger className="">
                  <p className="flex items-center gap-2">
                    <span>{user?.full_name}</span>
                    <ChevronDownCircle size={16} />
                  </p>
                </PopoverTrigger>
                <PopoverContent>
                  <ul className="flex flex-col divide-y space-y-2">
                    <li>
                      <Link href="/">
                        <p className="text-gray-700 flex items-center gap-2">
                          <ArrowLeft size={16} />
                          <span>Back Home</span>
                        </p>
                      </Link>
                    </li>
                    <li
                      className="cursor-pointer pt-2"
                      onClick={() => logout()}
                    >
                      <p className="text-gray-700 flex items-center gap-2">
                        <LogOutIcon size={16} />
                        <span>Logout</span>
                      </p>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProfileHeader;
