import { ButtonHTMLAttributes } from "react";
import { PlusMinus, Divide } from "phosphor-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string | number;
}

export function Button({ value, ...rest }: ButtonProps) {
  return (
    <button className="flex items-center justify-center" {...rest}>
      {value === "negative" ? (
        <PlusMinus size={28} />
      ) : value === "/" ? (
        <Divide size={28} />
      ) : (
        value
      )}
    </button>
  );
}
