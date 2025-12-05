"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Form } from "../components/ui/form";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: Form.Input,
    Textarea: Form.Textarea,
    Select: Form.Select,
    Checkbox: Form.Checkbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
