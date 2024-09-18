import Footer from "@/components/elements/Footer";
import Header from "@/components/elements/Header";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <main className="container mx-lg:auto min-h-screen flex items-center justify-center">
    //   {children}
    // </main>
    <main className="flex flex-col min-h-[110vh]">
      <Header />
      <div className="flex-grow container mx-auto my-10 flex justify-center">
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default AuthLayout;
