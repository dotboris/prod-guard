import { Slot } from "radix-ui";
import { cn } from "../utils";

export function Button({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "cursor-pointer bg-slate-800 px-4 py-2 text-white hover:text-amber-300 focus:text-amber-300",
        className,
      )}
      {...props}
    />
  );
}
