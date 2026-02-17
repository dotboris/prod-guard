import { cn } from "../utils";
import { Input } from "./Input";

type ColorFieldProps = {
  value: string;
} & Omit<React.ComponentProps<"input">, "pattern" | "type">;

export default function ColorField({ className, ...props }: ColorFieldProps) {
  return (
    <div className={cn("relative w-fit", className)}>
      <Input
        className="w-full pr-8"
        type="text"
        pattern="^[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$"
        {...props}
      />
      <div
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 rounded-full border border-black select-none"
        style={{ backgroundColor: `#${props.value}` }}
      />
    </div>
  );
}
