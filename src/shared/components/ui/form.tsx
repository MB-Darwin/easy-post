import { useFieldContext } from "@/shared/hooks/use-app-form";
import type { ReactNode } from "react";
import { Field } from "./field";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Select } from "./select";

// Base Form Control Props
export type FormControlProps = {
  label: string;
  description?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "textarea" | "checkbox" | "select";
};

// Base Form Component
type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

function Base({
  children,
  label,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const labelElement = (
    <>
      <Field.Label htmlFor={field.name}>{label}</Field.Label>
      {description && <Field.Description>{description}</Field.Description>}
    </>
  );

  const errorElem = isInvalid && (
    <Field.Error errors={field.state.meta.errors} />
  );

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <Field.Content>
            {labelElement}
            {errorElem}
          </Field.Content>
        </>
      ) : (
        <>
          <Field.Content>{labelElement}</Field.Content>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}

// Input Component
function InputField(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Base {...props}>
      <Input
        id={field.name}
        name={field.name}
        placeholder={props.placeholder}
        type={props.type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
      />
    </Base>
  );
}

// Textarea Component
function TextareaField(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Base {...props}>
      <Textarea
        id={field.name}
        name={field.name}
        placeholder={props.placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
      />
    </Base>
  );
}

// Checkbox Component
function CheckboxField(props: FormControlProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Base {...props} controlFirst horizontal>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
        aria-invalid={isInvalid}
      />
    </Base>
  );
}

// Select Component
type SelectFieldProps = FormControlProps & {
  children: ReactNode;
};

function SelectField({ children, ...props }: SelectFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Base {...props}>
      <Select
        onValueChange={(e) => field.handleChange(e)}
        value={field.state.value}
      >
        <Select.Trigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{children}</Select.Content>
      </Select>
    </Base>
  );
}

// Compound Export
export const Form = Object.assign(Base, {
  Input: InputField,
  Textarea: TextareaField,
  Checkbox: CheckboxField,
  Select: SelectField,
});
