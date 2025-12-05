'use client';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/shared/utils/cn';

// Define classes for variants
const switchVariants = cva(
  `
    relative peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors 
    focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background 
    disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input
    aria-invalid:border aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20
  `,
  {
    variants: {
      shape: {
        pill: 'rounded-full',
        square: 'rounded-md',
      },
      size: {
        sm: 'h-5 w-8',
        md: 'h-6 w-10',
        lg: 'h-8 w-14',
        xl: 'h-9 w-16',
      },
      permanent: {
        true: 'bg-input',
        false: 'data-[state=checked]:bg-primary',
      },
    },
    defaultVariants: {
      shape: 'pill',
      permanent: false,
      size: 'md',
    },
  },
);

const switchThumbVariants = cva(
  'pointer-events-none block bg-white w-1/2 h-[calc(100%-4px)] shadow-lg ring-0 transition-transform start-0 data-[state=unchecked]:translate-x-[2px] data-[state=checked]:translate-x-[calc(100%-2px)] rtl:data-[state=unchecked]:-translate-x-[2px] rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]',
  {
    variants: {
      shape: {
        pill: 'rounded-full',
        square: 'rounded-md',
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    defaultVariants: {
      shape: 'pill',
      size: 'md',
    },
  },
);
const switchIndicatorVariants = cva(
  'absolute left-1 top-1 flex items-center justify-center text-[10px] font-bold text-background transition-opacity',
  {
    variants: {
      state: {
        checked: 'opacity-100',
        unchecked: 'opacity-0',
      },
    },
    defaultVariants: {
      state: 'unchecked',
    },
  },
);

function SwitchRoot({
  className,
  shape,
  size,
  permanent,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ shape, size, permanent }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ shape, size }))}
      />
    </SwitchPrimitive.Root>
  );
}

function SwitchIndicator({
  className,
  state,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof switchIndicatorVariants>) {
  return (
    <span
      data-slot="switch-indicator"
      className={cn(switchIndicatorVariants({ state }), className)}
      {...props}
    />
  );
}

const Switch = Object.assign(SwitchRoot, {
  Indicator: SwitchIndicator,
});

export { Switch, switchIndicatorVariants };
