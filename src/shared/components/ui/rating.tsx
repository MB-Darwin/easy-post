'use client';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Star } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils/cn';

const ratingVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-2.5',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const starVariants = cva('', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const valueVariants = cva('text-muted-foreground w-5', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

function Rating({
  rating,
  maxRating = 5,
  size,
  className,
  starClassName,
  showValue = false,
  editable = false,
  onRatingChange,
  ...props
}: React.ComponentProps<'div'>
  & VariantProps<typeof ratingVariants> & {
    /**
     * Current rating value (supports decimal values for partial stars)
     */
    rating: number;
    /**
     * Maximum rating value (number of stars to show)
     */
    maxRating?: number;
    /**
     * Whether to show the numeric rating value
     */
    showValue?: boolean;
    /**
     * Class name for the value span
     */
    starClassName?: string;
    /**
     * Whether the rating is editable (clickable)
     */
    editable?: boolean;
    /**
     * Callback function called when rating changes
     */
    onRatingChange?: (rating: number) => void;
  }) {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);
  const displayRating = editable && hoveredRating !== null ? hoveredRating : rating;

  const handleStarClick = (starRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarMouseEnter = (starRating: number) => {
    if (editable) {
      setHoveredRating(starRating);
    }
  };

  const handleStarMouseLeave = () => {
    if (editable) {
      setHoveredRating(null);
    }
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      const filled = displayRating >= i;
      const partiallyFilled = displayRating > i - 1 && displayRating < i;
      const fillPercentage = partiallyFilled ? (displayRating - (i - 1)) * 100 : 0;

      stars.push(
        <div
          key={i}
          role="button"
          tabIndex={editable ? 0 : -1}
          className={cn('relative', editable && 'cursor-pointer')}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarMouseEnter(i)}
          onMouseLeave={handleStarMouseLeave}
          onKeyDown={(e) => {
            if (editable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleStarClick(i);
            }
          }}
          aria-label={`Rate ${i} out of ${maxRating}`}
        >
          {/* Background star (empty) */}
          <Star
            data-slot="rating-star-empty"
            className={cn(
              starVariants({ size }),
              'fill-muted stroke-muted text-muted transition-colors duration-150',
            )}
          />

          {/* Foreground star (filled) */}
          <Star
            data-slot="rating-star-filled"
            className={cn(
              starVariants({ size }),
              'absolute top-0 left-0 fill-yellow-400 text-yellow-400 transition-colors duration-150',
            )}
            style={{
              clipPath: `inset(0 ${100 - (filled ? 100 : fillPercentage)}% 0 0)`,
            }}
          />
        </div>,
      );
    }

    return stars;
  };

  return (
    <div data-slot="rating" className={cn(ratingVariants({ size }), className)} {...props}>
      <div className="flex items-center">{renderStars()}</div>
      {showValue && (
        <span data-slot="rating-value" className={cn(valueVariants({ size }), starClassName)}>
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { Rating };
