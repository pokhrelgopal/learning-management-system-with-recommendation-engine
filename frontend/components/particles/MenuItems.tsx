"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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

const MenuItems = () => {
  const activeNavClass = "underline underline-offset-8";
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex space-x-10">
        {items.map((item) => {
          const isActive = currentPath === item.link ? activeNavClass : "";
          return (
            <Link key={item.id} href={item.link}>
              <li
                className={`cursor-pointer text-lg text ease-in-out ${isActive}`}
                key={item.id}
              >
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default MenuItems;
