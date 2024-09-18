import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Trash2, Pencil, Check, X } from "lucide-react";
import { mediaUrl } from "@/app/endpoints";
import { instructorEarnings } from "@/app/server";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  profile_image: string;
  date_added: string;
  last_active: string;
};

type Props = {
  data: UserData;
};

export default function UserRow({ data }: Props) {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["earnings", data.id],
    queryFn: () => instructorEarnings(data.id),
  });

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6}>
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <div className="rounded-full h-10 w-10 bg-gray-300"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-4 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell className="font-medium">
        <p className="flex items-center">
          <span className="flex flex-col">
            <span className="text-lg">{data.full_name}</span>
            <span className="text-sm text-muted-foreground">{data.email}</span>
          </span>
        </p>
      </TableCell>
      <TableCell>Verified</TableCell>
      <TableCell className="text-right">
        {earnings?.total_earning > 0 ? `$${earnings.total_earning}` : "-"}
      </TableCell>
      <TableCell>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Approve</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <X className="h-4 w-4" />
                <span>DisApprove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
