import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Trash2, Check, X } from "lucide-react";
import { approveUser, instructorEarnings } from "@/app/server";
import { toast } from "sonner";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
};

type Props = {
  data: UserData;
};

export default function UserRow({ data }: Props) {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["earnings", data.id],
    queryFn: () => instructorEarnings(data.id),
  });

  const queryClient = useQueryClient();
  const approve = async (userId: string) => {
    try {
      const res = await approveUser(userId);
      await queryClient.invalidateQueries(
        "getInstructors" as InvalidateQueryFilters
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve user");
    }
  };

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
      <TableCell>
        {data.is_verified ? (
          <span className="py-1 px-3 text-sm rounded-full bg-green-100 flex items-center gap-1 w-fit">
            <Check className="h-4 w-4" />
            <span>Verified</span>
          </span>
        ) : (
          <span className="py-1 px-3 text-sm rounded-full bg-red-100 flex items-center gap-1 w-fit">
            <X className="h-4 w-4" />
            <span>Not Verified</span>
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {earnings?.total_earning > 0 ? `$${earnings.total_earning}` : "-"}
      </TableCell>
      <TableCell>
        <div className="flex justify-end space-x-2">
          {!data.is_verified && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => approve(data.id)}
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </TableCell>
    </TableRow>
  );
}
