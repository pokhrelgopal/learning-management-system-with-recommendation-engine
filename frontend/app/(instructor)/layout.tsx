"use client";
import Sidebar from "@/components/elements/Sidebar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex">
      <aside className="fixed w-72">
        <Sidebar />
      </aside>
      <article className="ml-72 px-10 w-full">{children}</article>
    </main>
  );
};

export default MainLayout;
