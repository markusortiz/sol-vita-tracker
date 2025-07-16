import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-95 transition-transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90 shadow-ios-small hover:shadow-ios-medium",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-ios-small",
        outline:
          "border-2 border-border bg-background hover:bg-secondary hover:text-secondary-foreground shadow-ios-small",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-90 shadow-ios-small",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // iOS-specific variants
        ios: "bg-gradient-ios-vitamin text-primary-foreground hover:opacity-90 shadow-ios-medium active:shadow-ios-small",
        "ios-health": "bg-gradient-ios-health text-accent-foreground hover:opacity-90 shadow-ios-medium",
        "ios-secondary": "bg-secondary text-secondary-foreground hover:bg-muted shadow-ios-small",
        "ios-bordered": "border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 shadow-ios-small",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-2xl px-8 text-lg",
        xl: "h-16 rounded-2xl px-10 text-xl",
        icon: "h-12 w-12 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
