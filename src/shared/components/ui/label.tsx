'use client';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Label as LabelPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/shared/utils/cn';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

function LabelRoot({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root data-slot="label" className={cn(labelVariants(), className)} {...props} />
  );
}

const Label = Object.assign(LabelRoot, {});

export { Label };
