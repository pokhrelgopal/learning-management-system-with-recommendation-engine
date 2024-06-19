import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-lg:auto min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
};

export default AuthLayout;
