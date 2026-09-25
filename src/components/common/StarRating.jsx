import React from 'react';
import { Star } from 'lucide-react';

/**
 * Reusable Star Rating Display
 * @param {{ rating?: number, maxStars?: number, showNumber?: boolean }} props
 */
export function StarRating({ rating = 4, maxStars = 5, showNumber = true }) {
  return (
    <div className="star-rating flex items-center">
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
        />
      ))}
      {showNumber && <span className="text-xs text-slate-500 ml-1">{rating}.0</span>}
    </div>
  );
}

export default StarRating;
