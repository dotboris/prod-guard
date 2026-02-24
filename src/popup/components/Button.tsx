import { Slot } from "radix-ui";
import { cn } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const variants = cva(
  "cursor-pointer px-4 py-2 text-white outline-none rounded hover:text-amber-300 focus-visible:text-amber-300 focus-visible:ring-1 focus-visible:ring-amber-300",
  {
    variants: {
      color: {
        default: "bg-slate-700 hover:bg-slate-800 focus-within:bg-slate-800",
        danger: "bg-red-700 hover:bg-red-800 focus-within:bg-red-800",
        none: "",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof variants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  color = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(variants({ color }), className)}
      {...props}
    />
  );
}
