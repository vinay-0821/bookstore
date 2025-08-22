import React, { useState } from "react";
import { Star } from "lucide-react";
import "./css/StarRating.css"

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
}

export default function StarRating({
  rating,
  onRatingChange,
  maxStars = 5,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? rating;

  return (
    <div className="flex gap-3">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = display >= i + 1;
        return (
           <button
            key={i}
            type="button"
            aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onRatingChange(i + 1)}
            className="transition transform hover:scale-110"
            >
            <Star
                className={`w-10 h-10 ${
                filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
            />
            </button>
        );
      })}
    </div>
  );
}
