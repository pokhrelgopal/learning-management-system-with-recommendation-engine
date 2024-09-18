import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        className="cursor-pointer w-20 md:w-28"
        src="/logo.png"
        alt="Logo"
        width={400}
        priority
        height={400}
      />
    </Link>
  );
};

export default Logo;
