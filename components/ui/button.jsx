import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:translate-y-[3px] active:shadow-none shadow-lg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 before:absolute before:-z-10 before:inset-0 before:rounded-lg before:transition-all before:content-[''] before:-translate-y-[6px] active:before:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white before:bg-primary/90 hover:bg-primary/80 focus:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground before:bg-destructive/90 hover:bg-destructive/80 focus:ring-destructive",
        outline:
          "border border-input bg-background before:bg-accent/90 hover:bg-accent hover:text-accent-foreground focus:ring-accent",
        secondary:
          "bg-secondary text-secondary-foreground before:bg-secondary/90 hover:bg-secondary/80 focus:ring-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground before:bg-accent/90 focus:ring-accent",
        link: "text-primary underline-offset-4 hover:underline before:bg-transparent",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
