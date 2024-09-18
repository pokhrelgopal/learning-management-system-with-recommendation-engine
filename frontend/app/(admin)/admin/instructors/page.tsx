"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import UserRow from "@/components/elements/UserCard";
import { useQuery } from "@tanstack/react-query";
import { getInstructors } from "@/app/server";
import Spinner from "@/components/elements/Spinner";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
};

export default function UserTable() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getInstructors"],
    queryFn: () => getInstructors(),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="my-5">
      <div className="my-4">
        <h3 className="text-3xl font-semibold">Instructors</h3>
        <p>
          Manage instructors and view their earnings. You can verify instructors
          here. You can also edit or delete them.
        </p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table className="text-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Earnings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user: any) => (
              <UserRow key={user.id} data={user} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
