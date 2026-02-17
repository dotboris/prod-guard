export interface ColorFieldProps {
  id?: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function ColorField(props: ColorFieldProps) {
  const { id, value, disabled, required, onChange } = props;

  return (
    <div className="relative">
      <div className="absolute top-0 right-2 bottom-0 flex content-center items-center">
        <div
          className="size-4 rounded-full border border-black"
          style={{ backgroundColor: `#${value}` }}
        />
      </div>

      <input
        className="w-full border border-black p-2 pr-8"
        id={id}
        type="text"
        pattern="^[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$"
        value={value}
        disabled={disabled}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
