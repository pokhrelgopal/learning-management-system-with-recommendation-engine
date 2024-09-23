"use client";
import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteCategory, updateCategory } from "@/app/server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";

type Props = {
  category: any;
};

const CategoryCard = ({ category }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = React.useState(category?.name);
  const handleDelete = async () => {
    try {
      const res = await deleteCategory(category.id);
      if (res.status === 204) {
        toast.success("Category deleted successfully");
        router.refresh();
        queryClient.invalidateQueries(
          "getCategories" as InvalidateQueryFilters
        );
      }
    } catch (error: any) {
      if (error.request.status === 403) {
        toast.error("Category has courses. Please delete all courses first");
        return;
      }
      toast.error("Failed to delete category");
    }
  };
  const handleEdit = async () => {
    try {
      const res = await updateCategory(category.id, { name });
      if (res.status === 200) {
        toast.success("Category updated successfully");
        router.refresh();
        queryClient.invalidateQueries(
          "getCategories" as InvalidateQueryFilters
        );
      }
    } catch (error) {
      toast.error("Failed to update category");
    }
  };
  return (
    <Card>
      <div className="p-5 flex items-center justify-between">
        <div className="flex flex-col items-start gap-2">
          <span>{category.name}</span>
          {category?.courses?.length > 0 ? (
            <>
              <span className="text-xs text-gray-500">
                ({category?.courses?.length} courses)
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-500">(No courses)</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>
                <Edit size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={handleEdit} variant={"default"}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleDelete} variant={"destructive"}>
            <Trash2 size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
