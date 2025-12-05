'use client';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/utils/cn';

// Define CardContext
type CardContextType = {
  variant: 'default' | 'accent';
};

const CardContext = React.createContext<CardContextType>({
  variant: 'default', // Default value
});

// Hook to use CardContext
const useCardContext = () => {
  const context = React.use(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a Card component');
  }
  return context;
};

// Variants
const cardVariants = cva('flex flex-col items-stretch text-card-foreground rounded-xl', {
  variants: {
    variant: {
      default: 'bg-card border border-border shadow-xs black/5',
      accent: 'bg-muted shadow-xs p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardHeaderVariants = cva(
  'flex items-center justify-between flex-wrap px-5 min-h-14 gap-2.5',
  {
    variants: {
      variant: {
        default: 'border-b border-border',
        accent: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const cardContentVariants = cva('grow p-5', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-t-xl [&:last-child]:rounded-b-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardTableVariants = cva('grid grow', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardFooterVariants = cva('flex items-center px-5 min-h-14', {
  variants: {
    variant: {
      default: 'border-t border-border',
      accent: 'bg-card rounded-b-xl mt-[2px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Card Root Component
const CardRoot = ({
  className,
  variant = 'default',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) => {
  const contextValue = React.useMemo(() => ({ variant: variant || 'default' }), [variant]);

  return (
    <CardContext value={contextValue}>
      <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props}>
        {children}
      </div>
    </CardContext>
  );
};

// Card Sub-Components
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ variant }), className)}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ variant }), className)}
      {...props}
    />
  );
};

const CardTable = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-table"
      className={cn(cardTableVariants({ variant }), className)}
      {...props}
    />
  );
};

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ variant }), className)}
      {...props}
    />
  );
};

const CardHeading = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div data-slot="card-heading" className={cn('space-y-1', className)} {...props} />;
};

const CardToolbar = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="card-toolbar"
      className={cn('flex items-center gap-2.5', className)}
      {...props}
    />
  );
};

const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-base leading-none font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};

// Compose Card with namespace pattern
const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Table: CardTable,
  Footer: CardFooter,
  Heading: CardHeading,
  Toolbar: CardToolbar,
  Title: CardTitle,
  Description: CardDescription,
});

// Exports
export { Card };
