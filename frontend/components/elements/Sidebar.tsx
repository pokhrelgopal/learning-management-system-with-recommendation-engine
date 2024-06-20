"use client";
import React from "react";
import Logo from "../particles/Logo";
import useUser from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserMenu from "../particles/UserMenu";

const teacherMenu = [
  {
    title: "Dashboard",
    href: "/instructor",
  },
  {
    title: "Courses",
    href: "/instructor/courses",
  },
  {
    title: "Create Course",
    href: "/instructor/course/create",
  },
  {
    title: "Students",
    href: "/instructor/students",
  },
];
const adminMenu = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Courses",
    href: "/admin/courses",
  },
  {
    title: "Students",
    href: "/admin/students",
  },
  {
    title: "Instructors",
    href: "/admin/instructors",
  },
];
const studentMenu = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Courses",
    href: "/profile/courses",
  },
];

const Sidebar = () => {
  const { user } = useUser();
  const currentPath = usePathname();
  const active = "bg-gray-100";
  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white w-full">
      <div className="px-4 py-6">
        <Logo />
        <ul className="mt-6 space-y-1">
          {user?.role === "instructor" &&
            teacherMenu.map((menu, index) => {
              const isActive = currentPath === menu.href ? active : "";
              return (
                <li key={index}>
                  <Link
                    href={menu.href}
                    className={`block rounded-lg px-4 py-2 text-lg font-medium ${isActive}`}
                  >
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          {user?.role === "admin" &&
            adminMenu.map((menu, index) => {
              const isActive = currentPath === menu.href ? active : "";
              return (
                <li key={index}>
                  <Link
                    href={menu.href}
                    className={`block rounded-lg px-4 py-2 text-lg font-medium ${isActive}`}
                  >
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          {user?.role === "student" &&
            studentMenu.map((menu, index) => {
              const isActive = currentPath === menu.href ? active : "";
              return (
                <li key={index}>
                  <Link
                    href={menu.href}
                    className={`block rounded-lg px-4 py-2 text-lg font-medium ${isActive}`}
                  >
                    {menu.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      <UserMenu />
    </div>
  );
};

export default Sidebar;
