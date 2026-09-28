import React, { useEffect, useState } from "react";
import {
  TiStarOutline,
  TiStarFullOutline,
  TiStarHalfOutline,
} from "react-icons/ti";

const RatingStars = ({ Review_Count, Star_Size }) => {
  const [starCount, setStarCount] = useState({
    full: 0,
    half: 0,
    empty: 5,
  });

  useEffect(() => {
    const count = Number(Review_Count) || 0;
    const wholeStars = Math.min(5, Math.max(0, Math.floor(count)));
    const hasHalf = !Number.isInteger(count) && count > 0 && count < 5 ? 1 : 0;
    const emptyStars = Math.max(0, 5 - wholeStars - hasHalf);

    setStarCount({
      full: wholeStars,
      half: hasHalf,
      empty: emptyStars,
    });
  }, [Review_Count]);

  return (
    <div className="flex items-center gap-0.5 text-yellow-50">
      {[...Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline key={`full-${i}`} size={Star_Size || 18} />
      ))}
      {[...Array(starCount.half)].map((_, i) => (
        <TiStarHalfOutline key={`half-${i}`} size={Star_Size || 18} />
      ))}
      {[...Array(starCount.empty)].map((_, i) => (
        <TiStarOutline key={`empty-${i}`} size={Star_Size || 18} />
      ))}
    </div>
  );
};

export default RatingStars;