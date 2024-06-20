import Sidebar from "@/components/elements/Sidebar";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex">
      <aside className="fixed w-80">
        <Sidebar />
      </aside>
      <article className="ml-80 px-10 w-full">{children}</article>
    </main>
  );
};

export default ProfileLayout;
