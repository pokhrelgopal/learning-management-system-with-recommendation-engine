import Footer from "@/components/elements/Footer";
import Header from "@/components/elements/Header";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto my-10">{children}</div>
      <Footer />
    </main>
  );
};

export default MainLayout;
