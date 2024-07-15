import React from "react";
import { Button } from "../ui/button";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const Mode = () => {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  if (user?.role === "student") return null;
  return (
    <Button
      loading={isLoading}
      variant={"default"}
      size={"sm"}
      className="capitalize bg-white hover:bg-gray-50 text-black border border-gray-200"
      onClick={() => {
        router.push(`/${user?.role}`);
      }}
    >
      {user?.role} Mode
    </Button>
  );
};

export default Mode;
