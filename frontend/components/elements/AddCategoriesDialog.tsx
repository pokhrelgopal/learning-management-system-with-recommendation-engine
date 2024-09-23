"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createCategory } from "@/app/server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {};

const AddCategoriesDialog = (props: Props) => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const handleClick = async () => {
    // must not be empty
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    // must be only letter
    if (!/^[a-zA-Z ]+$/.test(name)) {
      toast.error("Category name must be only letters");
      return;
    }
    try {
      const res = await createCategory({ name });
      if (res.status === 200) {
        toast.success("Category added successfully");
        setName("");
      }
      router.refresh();
      document.getElementById("close-category-dialog")?.click();
    } catch (error: any) {
      if (error.response.status === 400) {
        toast.error("Category already exists");
      } else {
        toast.error("Something went wrong !");
      }
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Category</DialogTitle>
          <DialogDescription>
            Category Name must be unique. Please enter a new category name.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Category Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name..."
          />
          <Button onClick={handleClick}>Add Category</Button>
        </div>
        <DialogClose id="close-category-dialog" />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoriesDialog;
