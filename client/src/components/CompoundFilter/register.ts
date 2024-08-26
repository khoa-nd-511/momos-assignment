import { CompoundFilterFormValues } from "@/lib/types";
import { ReactNode } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";

type Props = {
  field: ControllerRenderProps;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<CompoundFilterFormValues>;
};

export const ValueFieldMap: Record<string, (props: Props) => ReactNode> = {};

export function register(type: string, field: (props: Props) => ReactNode) {
  ValueFieldMap[type] = field;
}
