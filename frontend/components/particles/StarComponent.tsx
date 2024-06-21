import { Star } from "lucide-react";
import React from "react";

type Props = {
  count: number;
};

const StarComponent = ({ count }: Props) => {
  return (
    <>
      <span className="flex gap-1">
        {/* <Star className="text-yellow-600" size={18} /> */}
        {Array(count)
          .fill(null)
          .map((_, i) => (
            <Star
              key={i}
              size={16}
              className="text-yellow-600"
              strokeWidth={3}
            />
          ))}
      </span>
    </>
  );
};

export default StarComponent;
