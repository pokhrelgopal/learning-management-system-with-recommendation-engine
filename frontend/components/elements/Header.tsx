import React from "react";
import Logo from "../particles/Logo";
import MenuItems from "../particles/MenuItems";
import UserButtons from "../particles/UserButtons";

const Header = () => {
  return (
    <header className="py-4 border-b bg-gray-50">
      <nav className="container mx-auto flex items-center justify-between">
        <Logo />
        <div className="">
          <MenuItems />
        </div>
        <div className="">
          <UserButtons />
        </div>
      </nav>
    </header>
  );
};

export default Header;
