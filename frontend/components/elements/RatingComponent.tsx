import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const RatingComponent = ({ rating, setRating }: RatingProps) => {
  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          className={`p-1 ${
            rating >= star ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          <Star size={24} />
        </button>
      ))}
    </div>
  );
};

export default RatingComponent;
