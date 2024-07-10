"use client";
import React from "react";
import Logo from "../particles/Logo";
import MenuItems from "../particles/MenuItems";
import UserButtons from "../particles/UserButtons";
import useUser from "@/hooks/useUser";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { user, isLoading } = useUser();
  return (
    <header className="py-4 border-b bg-gray-100">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Logo />
          <MenuItems />
        </div>
        {isLoading ? (
          <div className="bg-white h-8 w-64 rounded animate-pulse"></div>
        ) : (
          <div>
            {user ? (
              <UserButtons user={user} />
            ) : (
              <Link href={"/login"}>
                <Button>
                  Login <ArrowRightCircle size={18} className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
