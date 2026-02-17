import { cn } from "../utils";
import { ChevronDownIcon } from "lucide-react";

type SelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default";
};

function Select({ className, size = "default", ...props }: SelectProps) {
  return (
    <div
      className={cn(
        "relative w-fit has-[select:disabled]:opacity-50",
        className,
      )}
      data-slot="select-wrapper"
      data-size={size}
    >
      <select
        data-slot="select"
        data-size={size}
        className="selection:bg-primary selection:text-primary-foreground h-8 w-full min-w-0 appearance-none border bg-transparent py-1 pr-8 pl-2.5 text-base outline-none select-none focus-within:ring-amber-300 focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none"
        aria-hidden="true"
        data-slot="select-icon"
      />
    </div>
  );
}

function SelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="select-option" {...props} />;
}

function SelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="select-optgroup"
      className={cn(className)}
      {...props}
    />
  );
}

export { Select, SelectOptGroup, SelectOption };
