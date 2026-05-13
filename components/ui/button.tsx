import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-[44px]",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-bg-primary hover:bg-amber-400 shadow-lg shadow-accent/20",
        outline:
          "border border-accent-border bg-transparent text-accent hover:bg-accent-muted",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-card",
        secondary: "bg-bg-card text-text-primary hover:bg-bg-card-hover border border-border",
      },
      size: {
        default: "h-12 px-6 rounded-button text-base",
        sm: "h-10 px-4 rounded-pill text-sm",
        lg: "h-14 px-8 rounded-button text-lg",
        icon: "h-11 w-11 rounded-button",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
