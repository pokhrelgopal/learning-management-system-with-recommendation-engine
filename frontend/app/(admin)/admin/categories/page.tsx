"use client";
import { getCategories } from "@/app/server";
import AddCategoriesDialog from "@/components/elements/AddCategoriesDialog";
import CategoryContainer from "@/components/elements/CategoryContainer";
import Spinner from "@/components/elements/Spinner";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CategoriesPage = () => {
  const { data: categories, isLoading } = useQuery<any>({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(),
  });
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <div className="mt-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <AddCategoriesDialog />
      </div>
      <div className="mt-5">
        <h3 className="text-2xl font-semibold">Added Categories</h3>
        <p>You have added {categories.length} categories. </p>
      </div>
      <div className="mt-4">
        <CategoryContainer categories={categories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
