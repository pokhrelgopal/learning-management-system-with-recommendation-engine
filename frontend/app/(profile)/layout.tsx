import ProfileHeader from "@/components/elements/ProfileHeader";
import Sidebar from "@/components/elements/Sidebar";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <header className="z-50 sticky top-0 border-b bg-white">
        <ProfileHeader />
      </header>
      <div>{children}</div>
    </main>
  );
};

export default ProfileLayout;
