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

type Option = { label: string; value: string };

export const ValueFieldMap: Record<string, (props: Props) => ReactNode> = {};
export const PropertyTypeMap: Record<string, string> = {};
export const OperationOptionsMap: Record<string, Option[]> = {};

export function register({
  name,
  propertyType,
  field,
  options,
}: {
  name: string;
  propertyType: string;
  field: (props: Props) => ReactNode;
  options: Option[];
}) {
  ValueFieldMap[name] = field;
  PropertyTypeMap[name] = propertyType;
  OperationOptionsMap[name] = options;
}
