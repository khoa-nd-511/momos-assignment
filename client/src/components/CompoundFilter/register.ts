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
export const PropertyTypeMap: Record<string, string> = {};

export function register(
  name: string,
  propertyType: string,
  field: (props: Props) => ReactNode
) {
  ValueFieldMap[name] = field;
  PropertyTypeMap[name] = propertyType;
}
