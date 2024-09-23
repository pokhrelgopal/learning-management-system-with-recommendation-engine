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
    href: "/instructor/create-course",
  },
];
const adminMenu = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Courses",
    href: "/admin/admin-courses",
  },

  {
    title: "Categories",
    href: "/admin/categories",
  },
  {
    title: "Instructors",
    href: "/admin/instructors",
  },
];

const Sidebar = () => {
  const { user } = useUser();
  const currentPath = usePathname();
  const active = "bg-gray-100";
  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white w-full">
      <div className="px-4 py-6">
        <div className="px-4">
          <Logo />
        </div>
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
        </ul>
      </div>

      <UserMenu />
    </div>
  );
};

export default Sidebar;
