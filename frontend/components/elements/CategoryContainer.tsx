import React from "react";
import CategoryCard from "./CategoryCard";

type Props = {
  categories: any[];
};

const CategoryContainer = ({ categories }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-10">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryContainer;
