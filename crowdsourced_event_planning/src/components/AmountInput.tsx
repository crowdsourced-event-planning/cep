"use client";
import { NumericFormat } from "react-number-format";

type Props = {
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  onValueChange?: (value: string) => void;
};

export default function AmountInput({
  id,
  name,
  required,
  placeholder,
  className,
  onValueChange,
  error,
}: Props) {
  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
        Rp
      </span>
      <NumericFormat
        id={id}
        name={name}
        required={required}
        className={`pl-10 text-lg border rounded px-3 py-2 w-full ${
          className ?? ""
        }`}
        thousandSeparator="."
        decimalSeparator=","
        allowNegative={false}
        decimalScale={0}
        inputMode="numeric"
        autoComplete="off"
        aria-invalid={!!error}
        placeholder={placeholder}
        valueIsNumericString
        onValueChange={(values) => {
          if (onValueChange) onValueChange(values.value);
        }}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
