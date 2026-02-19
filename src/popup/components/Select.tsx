import { cn } from "../utils";
import { ChevronDownIcon } from "lucide-react";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div
      className={cn(
        "relative w-fit has-[select:disabled]:opacity-50",
        className,
      )}
      data-slot="select-wrapper"
    >
      <select
        data-slot="select"
        className="h-8 w-full min-w-0 appearance-none rounded border border-neutral-500 bg-transparent py-1 pr-8 pl-2.5 text-base outline-none select-none open:ring-1 open:ring-amber-300 focus-visible:ring-1 focus-visible:ring-amber-300 disabled:pointer-events-none disabled:cursor-not-allowed"
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
