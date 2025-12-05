import { cn } from "@/shared/utils";
import * as SlotPrimitive from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon, LoaderIcon, LucideIcon } from "lucide-react";
import * as React from "react";

const buttonVariants = cva(
  "group inline-flex cursor-pointer items-center justify-center whitespace-nowrap whitespace-nowrap font-semibold text-sm ring-offset-background transition-[color,box-shadow] first-letter:uppercase focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-60 has-data-[arrow=true]:justify-between [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        contained: "",
        soft: "",
        outline: "border",
        text: "border-0 bg-transparent",
        dashed: "border border-dashed",
      },
      color: {
        inherit: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      appearance: {
        default: "",
        ghost: "",
      },
      underline: {
        solid: "",
        dashed: "",
      },
      underlined: {
        solid: "",
        dashed: "",
      },
      size: {
        xl: "min-py-2.5 h-12 gap-2 px-4 text-sm [&_svg:not([class*=size-])]:size-4",
        lg: "min-py-2 h-10 gap-1.5 px-4 text-sm [&_svg:not([class*=size-])]:size-4",
        md: "h-8 gap-1.5 px-3 text-[0.8125rem] [&_svg:not([class*=size-])]:size-4",
        sm: "h-7 gap-1.25 px-2.5 text-xs [&_svg:not([class*=size-])]:size-3.5",
        xs: "h-5 gap-1.25 px-2 text-xs [&_svg:not([class*=size-])]:size-2.5",
        icon: "size-8.5 shrink-0 [&_svg:not([class*=size-])]:size-4",
        "xs-icon": "size-7 shrink-0 [&_svg:not([class*=size-])]:size-3",
      },
      autoHeight: {
        true: "",
        false: "",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
      mode: {
        default:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        icon: "shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        link: "h-auto rounded-none bg-transparent p-0 text-primary hover:bg-transparent data-[state=open]:bg-transparent",
        input: `
            justify-start font-normal hover:bg-background [&_svg]:transition-colors [&_svg]:hover:text-foreground data-[state=open]:bg-background
            focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/30
            [[data-state=open]>&]:border-ring [[data-state=open]>&]:outline-hidden [[data-state=open]>&]:ring-[3px]
            [[data-state=open]>&]:ring-ring/30
            aria-invalid:border-error/60 aria-invalid:ring-error/10 dark:aria-invalid:border-error dark:aria-invalid:ring-error/20
           in-data-[invalid=true]:border-error/60 in-data-[invalid=true]:ring-error/10  dark:in-data-[invalid=true]:border-error dark:in-data-[invalid=true]:ring-error/20
          `,
      },
      placeholder: {
        true: "text-muted-foreground",
        false: "",
      },
    },
    compoundVariants: [
      // Contained variants
      {
        variant: "contained",
        color: "inherit",
        className:
          "bg-foreground text-background hover:bg-foreground/90 data-[state=open]:bg-foreground/90",
      },
      {
        variant: "contained",
        color: "primary",
        className:
          "bg-primary-500 text-foreground hover:bg-primary-600 data-[state=open]:bg-primary-700",
      },
      {
        variant: "contained",
        color: "secondary",
        className:
          "bg-secondary-500 text-foreground hover:bg-secondary-600 data-[state=open]:bg-secondary-700",
      },
      {
        variant: "contained",
        color: "success",
        className:
          "bg-green-500 text-foreground hover:bg-green-600 data-[state=open]:bg-green-700",
      },
      {
        variant: "contained",
        color: "warning",
        className:
          "bg-yellow-500 text-foreground hover:bg-yellow-600 data-[state=open]:bg-yellow-700",
      },
      {
        variant: "contained",
        color: "error",
        className:
          "bg-red-500 text-foreground hover:bg-red-600 data-[state=open]:bg-red-700",
      },
      {
        variant: "contained",
        color: "info",
        className:
          "bg-blue-500 text-foreground hover:bg-blue-600 data-[state=open]:bg-blue-700",
      },

      // Soft variants
      {
        variant: "soft",
        color: "inherit",
        className:
          "bg-accent text-muted-foreground hover:bg-muted/80 data-[state=open]:bg-muted/80",
      },
      {
        variant: "soft",
        color: "primary",
        className:
          "bg-primary-50 text-primary-500 hover:bg-primary-100 data-[state=open]:bg-primary-200",
      },
      {
        variant: "soft",
        color: "secondary",
        className:
          "bg-secondary-50 text-secondary-500 hover:bg-secondary-100 data-[state=open]:bg-secondary-200",
      },
      {
        variant: "soft",
        color: "success",
        className:
          "bg-green-50 text-green-500 hover:bg-green-100 data-[state=open]:bg-green-200",
      },
      {
        variant: "soft",
        color: "warning",
        className:
          "bg-yellow-50 text-yellow-500 hover:bg-yellow-100 data-[state=open]:bg-yellow-200",
      },
      {
        variant: "soft",
        color: "error",
        className:
          "bg-red-50 text-red-500 hover:bg-red-100 data-[state=open]:bg-red-200",
      },
      {
        variant: "soft",
        color: "info",
        className:
          "bg-blue-50 text-blue-500 hover:bg-blue-100 data-[state=open]:bg-blue-200",
      },

      // Outline variants
      {
        variant: "outline",
        color: "inherit",
        className:
          "border bg-blur-sm text-foreground hover:border-transparent hover:bg-current/5 data-[state=open]:bg-accent",
      },
      {
        variant: "outline",
        color: "primary",
        className:
          "border-primary-400 bg-background text-primary-500 hover:border-transparent hover:bg-primary-50 data-[state=open]:bg-primary-100",
      },
      {
        variant: "outline",
        color: "secondary",
        className:
          "border-secondary-400 bg-background text-secondary-500 hover:border-transparent hover:bg-secondary-50 data-[state=open]:bg-secondary-100",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "border-green-400 bg-background text-green-500 hover:border-transparent hover:bg-green-50 data-[state=open]:bg-green-100",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "border-yellow-400 bg-background text-yellow-500 hover:border-transparent hover:bg-yellow-50 data-[state=open]:bg-yellow-100",
      },
      {
        variant: "outline",
        color: "error",
        className:
          "border-red-400 bg-background text-red-500 hover:border-transparent hover:bg-red-50 data-[state=open]:bg-red-100",
      },
      {
        variant: "outline",
        color: "info",
        className:
          "border-blue-400 bg-background text-blue-500 hover:border-transparent hover:bg-blue-50 data-[state=open]:bg-blue-100",
      },

      // Text variants
      {
        variant: "text",
        color: "inherit",
        className: "text-foreground",
      },
      {
        variant: "text",
        color: "primary",
        className: "text-primary-500",
      },
      {
        variant: "text",
        color: "secondary",
        className: "text-secondary-500",
      },
      {
        variant: "text",
        color: "success",
        className: "text-green-500",
      },
      {
        variant: "text",
        color: "warning",
        className: "text-yellow-500",
      },
      {
        variant: "text",
        color: "error",
        className: "text-red-500",
      },
      {
        variant: "text",
        color: "info",
        className: "text-blue-500",
      },

      // Dashed variants
      {
        variant: "outline",
        color: "inherit",
        className:
          "border bg-blur-sm text-foreground hover:border-transparent hover:bg-current/5 data-[state=open]:bg-accent",
      },
      {
        variant: "outline",
        color: "primary",
        className:
          "border-primary-400 bg-background text-primary-500 hover:border-transparent hover:bg-primary-50 data-[state=open]:bg-primary-100",
      },
      {
        variant: "outline",
        color: "secondary",
        className:
          "border-secondary-400 bg-background text-secondary-500 hover:border-transparent hover:bg-secondary-50 data-[state=open]:bg-secondary-100",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "border-green-400 bg-background text-green-500 hover:border-transparent hover:bg-green-50 data-[state=open]:bg-green-100",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "border-yellow-400 bg-background text-yellow-500 hover:border-transparent hover:bg-yellow-50 data-[state=open]:bg-yellow-100",
      },
      {
        variant: "outline",
        color: "error",
        className:
          "border-red-400 bg-background text-red-500 hover:border-transparent hover:bg-red-50 data-[state=open]:bg-red-100",
      },
      {
        variant: "outline",
        color: "info",
        className:
          "border-blue-400 bg-background text-blue-500 hover:border-transparent hover:bg-blue-50 data-[state=open]:bg-blue-100",
      },

      // Icons opacity for default mode
      {
        variant: "outline",
        mode: "default",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "dashed",
        mode: "default",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // Icons opacity for input/icon mode
      {
        variant: "outline",
        mode: "input",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "outline",
        mode: "icon",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // Auto height
      {
        size: "md",
        autoHeight: true,
        className: "h-auto min-h-8.5",
      },
      {
        size: "sm",
        autoHeight: true,
        className: "h-auto min-h-7",
      },
      {
        size: "lg",
        autoHeight: true,
        className: "h-auto min-h-10",
      },

      // Shadow support for contained variants
      {
        variant: "contained",
        mode: "default",
        appearance: "default",
        className: "shadow-black/5 shadow-xs",
      },
      {
        variant: "outline",
        mode: "default",
        appearance: "default",
        className: "shadow-black/5 shadow-xs",
      },
      {
        variant: "dashed",
        mode: "default",
        appearance: "default",
        className: "shadow-black/5 shadow-xs",
      },

      // Shadow support for icon mode
      {
        variant: "contained",
        mode: "icon",
        appearance: "default",
        className: "shadow-black/5 shadow-xs",
      },
      {
        variant: "outline",
        mode: "icon",
        appearance: "default",
        className: "shadow-black/5 shadow-xs",
      },
      {
        variant: "dashed",
        mode: "icon",
        appearance: "default",
        className: "shadow-black/5 shadow-xs",
      },

      // Link mode with colors
      {
        color: "primary",
        mode: "link",
        underline: "solid",
        className:
          "font-semibold text-primary-500 hover:text-primary-600 hover:underline hover:decoration-solid hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        color: "primary",
        mode: "link",
        underline: "dashed",
        className:
          "font-semibold text-primary-500 decoration-1 hover:text-primary-600 hover:underline hover:decoration-dashed hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        color: "primary",
        mode: "link",
        underlined: "solid",
        className:
          "font-semibold text-primary-500 underline decoration-solid underline-offset-4 hover:text-primary-600 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        color: "primary",
        mode: "link",
        underlined: "dashed",
        className:
          "font-semibold text-primary-500 underline decoration-1 decoration-dashed underline-offset-4 hover:text-primary-600 [&_svg]:opacity-60",
      },

      {
        color: "inherit",
        mode: "link",
        underline: "solid",
        className:
          "font-semibold text-inherit hover:underline hover:decoration-solid hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        color: "inherit",
        mode: "link",
        underline: "dashed",
        className:
          "font-semibold text-inherit decoration-1 hover:underline hover:decoration-dashed hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        color: "inherit",
        mode: "link",
        underlined: "solid",
        className:
          "font-semibold text-inherit underline decoration-solid underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        color: "inherit",
        mode: "link",
        underlined: "dashed",
        className:
          "font-semibold text-inherit underline decoration-1 decoration-dashed underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },

      // Ghost appearance overrides
      {
        variant: "contained",
        color: "primary",
        appearance: "ghost",
        className:
          "bg-transparent text-primary-500 hover:bg-primary-50 data-[state=open]:bg-primary-50",
      },
      {
        variant: "contained",
        color: "error",
        appearance: "ghost",
        className:
          "bg-transparent text-red-500 hover:bg-red-50 data-[state=open]:bg-red-50",
      },
      {
        variant: "contained",
        color: "inherit",
        appearance: "ghost",
        className:
          "bg-transparent text-foreground/90 hover:bg-accent data-[state=open]:bg-accent",
      },

      // Size adjustments for icon mode
      {
        size: "sm",
        mode: "icon",
        className: "h-7 w-7 p-0 [&_svg:not([class*=size-])]:size-3.5",
      },
      {
        size: "md",
        mode: "icon",
        className: "h-8.5 w-8.5 p-0 [&_svg:not([class*=size-])]:size-4",
      },
      {
        size: "icon",
        className: "h-8.5 w-8.5 p-0 [&_svg:not([class*=size-])]:size-4",
      },
      {
        size: "lg",
        mode: "icon",
        className: "h-10 w-10 p-0 [&_svg:not([class*=size-])]:size-4",
      },

      // Input mode
      {
        mode: "input",
        placeholder: true,
        variant: "outline",
        className: "font-normal text-muted-foreground",
      },
      {
        mode: "input",
        variant: "outline",
        size: "sm",
        className: "gap-1.25",
      },
      {
        mode: "input",
        variant: "outline",
        size: "md",
        className: "gap-1.5",
      },
      {
        mode: "input",
        variant: "outline",
        size: "lg",
        className: "gap-1.5",
      },
    ],
    defaultVariants: {
      variant: "contained",
      color: "primary",
      mode: "default",
      size: "md",
      shape: "default",
      appearance: "default",
    },
  }
);

// Export the interface
export interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  selected?: boolean;
  asChild?: boolean;
  href?: string; // Use href instead of `to`
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      selected,
      variant,
      color,
      shape,
      appearance,
      mode,
      size,
      autoHeight,
      underlined,
      underline,
      asChild = false,
      placeholder = false,
      href,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      children,
      ...props
    },
    ref
  ) => {
    // Always use Slot when href is provided (parent wraps with Link)
    // Or use asChild pattern
    const Comp: React.ElementType =
      asChild || href ? SlotPrimitive.Slot : "button";

    const buttonContent = (
      <>
        {loading && <LoaderIcon className="animate-spin" />}
        {!loading && leftIcon}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon}
      </>
    );

    const buttonClasses = cn(
      buttonVariants({
        variant,
        size,
        shape,
        appearance,
        mode,
        autoHeight,
        placeholder,
        underlined,
        underline,
        color,
        className,
      }),
      (asChild || href) && props.disabled && "pointer-events-none opacity-50"
    );

    // If href is provided, render as anchor (works with Next.js Link wrapping)
    if (href && !asChild) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          data-slot="button"
          className={buttonClasses}
          {...(selected && { "data-state": "open" })}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {buttonContent}
        </a>
      );
    }

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={buttonClasses}
        {...(selected && { "data-state": "open" })}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export interface ButtonArrowProps extends React.SVGProps<SVGSVGElement> {
  icon?: LucideIcon;
}

function ButtonArrow({
  icon: Icon = ChevronDownIcon,
  className,
  ...props
}: ButtonArrowProps) {
  return (
    <Icon
      data-slot="button-arrow"
      className={cn("-me-1 ms-auto", className)}
      {...props}
    />
  );
}
const ButtonRoot = Button;

const ButtonNamespace = Object.assign(ButtonRoot, {
  Arrow: ButtonArrow,
});

export { ButtonNamespace as Button, buttonVariants };
