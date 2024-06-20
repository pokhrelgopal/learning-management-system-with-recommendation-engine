import React from "react";
import Image from "next/image";
import { logout } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ArrowLeftCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  return (
    <Popover>
      <PopoverTrigger>
        {" "}
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          {isLoading ? (
            <div className="animate-pulse">
              <a
                href="#"
                className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100"></div>

                <div>
                  <p className="text-xs">
                    <strong className="block font-medium bg-gray-100 h-4 w-52 rounded"></strong>

                    <span className="block text-gray-500 bg-gray-100 h-3 w-36 rounded mt-2"></span>
                  </p>
                </div>
              </a>
            </div>
          ) : (
            <a
              href="#"
              className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
            >
              <Image
                src={`http://127.0.0.1:8000${user?.profile_image}`}
                alt={user?.full_name ?? "No Image Found"}
                width={40}
                height={40}
                className="rounded-full"
              />

              <p className="flex flex-col items-start">
                <span className="block">{user?.full_name}</span>
                <span className="block text-gray-500 text-sm">
                  {user?.email}
                </span>
              </p>
            </a>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={() => logout()}
          >
            <LogOut size={16} className="mr-4" />
            Logout
          </Button>
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={() => {
              router.push("/");
            }}
          >
            <ArrowLeftCircle size={16} className="mr-4" />
            Back to Website
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
