import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/shared/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        contained: '',
        soft: '',
        outline: 'border',
      },
      color: {
        inherit: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      appearance: {
        default: '',
        ghost: 'border-0 bg-transparent',
      },
      size: {
        lg: 'rounded-md px-[0.5rem] h-7 min-w-7 gap-1.5 text-xs [&_svg]:size-3.5',
        md: 'rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5 ',
        sm: 'rounded-sm px-[0.325rem] h-5 min-w-5 gap-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3',
        xs: 'rounded-sm px-[0.25rem] h-4 min-w-4 gap-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3',
      },
      shape: {
        default: '',
        pill: 'rounded-full',
      },
    },
    compoundVariants: [
      // Contained variants
      {
        variant: 'contained',
        color: 'inherit',
        className: 'bg-foreground text-background',
      },
      {
        variant: 'contained',
        color: 'primary',
        className: 'bg-primary-400 text-primary-950 dark:bg-primary-600 dark:text-primary-50',
      },
      {
        variant: 'contained',
        color: 'secondary',
        className:
          'bg-secondary-400 text-secondary-950 dark:bg-secondary-600 dark:text-secondary-50',
      },
      {
        variant: 'contained',
        color: 'success',
        className: 'bg-success-400 text-success-950 dark:bg-success-600 dark:text-success-50',
      },
      {
        variant: 'contained',
        color: 'warning',
        className: 'bg-warning-400 text-warning-950 dark:bg-warning-600 dark:text-warning-50',
      },
      {
        variant: 'contained',
        color: 'error',
        className: 'bg-error-400 text-error-950 dark:bg-error-600 dark:text-error-50',
      },
      {
        variant: 'contained',
        color: 'info',
        className: 'bg-info-400 text-info-950 dark:bg-info-600 dark:text-info-50',
      },

      // Soft variants
      {
        variant: 'soft',
        color: 'inherit',
        className: 'bg-foreground/10 text-foreground',
      },
      {
        variant: 'soft',
        color: 'primary',
        className: 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-600',
      },
      {
        variant: 'soft',
        color: 'secondary',
        className:
          'bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-600',
      },
      {
        variant: 'soft',
        color: 'success',
        className: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-600',
      },
      {
        variant: 'soft',
        color: 'warning',
        className: 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-600',
      },
      {
        variant: 'soft',
        color: 'error',
        className: 'bg-error-100 text-error-600 dark:bg-error-900 dark:text-error-600',
      },
      {
        variant: 'soft',
        color: 'info',
        className: 'bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-600',
      },

      // Outline variants
      {
        variant: 'outline',
        color: 'inherit',
        className: 'border-current bg-background text-foreground',
      },
      {
        variant: 'outline',
        color: 'primary',
        className:
          'border-primary-400 bg-primary-50 text-primary-500 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-600',
      },
      {
        variant: 'outline',
        color: 'secondary',
        className:
          'border-secondary-400 bg-secondary-50 text-secondary-500 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-600',
      },
      {
        variant: 'outline',
        color: 'success',
        className:
          'border-success-400 bg-success-50 text-success-500 dark:border-success-800 dark:bg-success-950 dark:text-success-600',
      },
      {
        variant: 'outline',
        color: 'warning',
        className:
          'border-warning-400 bg-warning-50 text-warning-500 dark:border-warning-800 dark:bg-warning-950 dark:text-warning-600',
      },
      {
        variant: 'outline',
        color: 'error',
        className:
          'border-error-400 bg-error-50 text-error-500 dark:border-error-800 dark:bg-error-950 dark:text-error-600r',
      },
      {
        variant: 'outline',
        color: 'info',
        className:
          'border-info-400 bg-info-50 text-info-500 dark:border-info-800 dark:bg-info-950 dark:text-info-600',
      },

      // Icons opacity for outline variants
      {
        variant: 'outline',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },

      // Shadow support for contained and outline variants
      {
        variant: 'contained',
        appearance: 'default',
        className: 'shadow-black/5 shadow-xs',
      },
      {
        variant: 'outline',
        appearance: 'default',
        className: 'shadow-black/5 shadow-xs',
      },

      // Ghost appearance overrides
      {
        variant: 'contained',
        color: 'inherit',
        appearance: 'ghost',
        className: 'bg-transparent text-foreground',
      },
      {
        variant: 'contained',
        color: 'primary',
        appearance: 'ghost',
        className: 'bg-transparent text-primary',
      },
      {
        variant: 'contained',
        color: 'secondary',
        appearance: 'ghost',
        className: 'bg-transparent text-secondary',
      },
      {
        variant: 'contained',
        color: 'success',
        appearance: 'ghost',
        className: 'bg-transparent text-success',
      },
      {
        variant: 'contained',
        color: 'warning',
        appearance: 'ghost',
        className: 'bg-transparent text-warning',
      },
      {
        variant: 'contained',
        color: 'error',
        appearance: 'ghost',
        className: 'bg-transparent text-error',
      },
      {
        variant: 'contained',
        color: 'info',
        appearance: 'ghost',
        className: 'bg-transparent text-info',
      },

      // Ghost appearance with no padding
      { appearance: 'ghost', size: 'lg', className: 'px-0' },
      { appearance: 'ghost', size: 'md', className: 'px-0' },
      { appearance: 'ghost', size: 'sm', className: 'px-0' },
      { appearance: 'ghost', size: 'xs', className: 'px-0' },
    ],
    defaultVariants: {
      variant: 'contained',
      color: 'primary',
      size: 'md',
      shape: 'default',
      appearance: 'default',
    },
  },
);

const badgeButtonVariants = cva(
  '-me-0.5 inline-flex size-3.5 cursor-pointer items-center justify-center rounded-sm p-0 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-hidden [&>svg]:size-3.5',
  {
    variants: {
      size: {
        lg: 'size-4 [&>svg]:size-4',
        md: 'size-3.5 [&>svg]:size-3.5',
        sm: 'size-3 [&>svg]:size-3',
        xs: 'size-2.5 [&>svg]:size-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const badgeDotVariants = cva('', {
  variants: {
    color: {
      current: 'text-[currentColor]',
      inherit: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
    },
    size: {
      lg: 'text-md',
      md: 'text-sm',
      sm: 'text-xs',
      xs: 'text-[0.5rem]',
    },
  },
  defaultVariants: {
    color: 'current',
    size: 'md',
  },
});

type BadgeProps = {
  asChild?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & Omit<React.ComponentProps<'span'>, 'color'>
& VariantProps<typeof badgeVariants>;

type BadgeButtonProps = {
  asChild?: boolean;
} & React.ComponentProps<'button'>
& VariantProps<typeof badgeButtonVariants>;

type BadgeDotProps = {
  asChild?: boolean;
} & Omit<React.ComponentProps<'span'>, 'color'>
& VariantProps<typeof badgeDotVariants>;

function BadgeRoot({
  className,
  variant,
  color,
  shape,
  appearance,
  size,
  asChild = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';

  const badgeContent = (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, size, appearance, shape, color, className }),
        disabled && 'pointer-events-none opacity-50',
      )}
      {...props}
    >
      {badgeContent}
    </Comp>
  );
}

function BadgeButton({ className, size, asChild = false, children, ...props }: BadgeButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button';

  return (
    <Comp
      data-slot="badge-button"
      type="button"
      className={cn(badgeButtonVariants({ size, className }))}
      {...props}
    >
      {children || <X />}
    </Comp>
  );
}

function BadgeDot({ className, color, size, asChild = false, children, ...props }: BadgeDotProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';

  return (
    <Comp
      data-slot="badge-dot"
      className={cn(badgeDotVariants({ color, size, className }))}
      {...props}
    />
  );
}

const BadgeNamespace = Object.assign(BadgeRoot, {
  Button: BadgeButton,
  Dot: BadgeDot,
});

export type { BadgeButtonProps, BadgeDotProps, BadgeProps };

export { BadgeNamespace as Badge, badgeVariants };
