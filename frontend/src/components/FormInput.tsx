import type { ChangeEventHandler } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface props {
  labelText: string;
  placeholderText: string;
  inputId: string;
  inputType?: string;
  onChange: ChangeEventHandler;
}

const FormInput = ({
  labelText,
  placeholderText,
  inputId,
  inputType = "text",
  onChange,
}: props) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{labelText}</Label>
      <Input
        type={inputType}
        id={inputId}
        placeholder={placeholderText}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
