import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      {/* <Image
        className="cursor-pointer w-20 md:w-24"
        src="/logo.png"
        alt="Logo"
        width={400}
        height={400}
      /> */}
      <span className="font-bold text-xl">LearnHub</span>
    </Link>
  );
};

export default Logo;
