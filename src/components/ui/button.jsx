import { cva } from "class-variance-authority";
import React from "react";
import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-sky-600 text-white hover:bg-sky-700",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
        success: "bg-emerald-600 text-white hover:bg-emerald-700",
        danger: "bg-rose-600 text-white hover:bg-rose-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <button ref={ref} className={clsx(buttonVariants({ variant, size }), className)} {...props}>
    {children}
  </button>
));
Button.displayName = "Button";
export { Button };
export default Button;
