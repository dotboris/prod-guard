import { cn } from "../utils";

export function TextArea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded border border-neutral-500 bg-transparent px-2.5 py-1 text-base outline-none focus-within:ring-1 focus-within:ring-amber-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
