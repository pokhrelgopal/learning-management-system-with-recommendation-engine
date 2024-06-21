import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  categories: any;
  seCategory: any;
};

const CourseCategorySelect = ({ seCategory, categories }: Props) => {
  return (
    <Select
      onValueChange={(value) => {
        seCategory(value);
      }}
    >
      <SelectTrigger className="xl:w-1/2 text-lg">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((category: any) => (
          <SelectItem
            key={category.id}
            className="text-lg"
            value={category.name}
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CourseCategorySelect;
