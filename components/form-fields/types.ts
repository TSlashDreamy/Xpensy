export interface FormFieldProps extends React.ComponentProps<"input"> {
  error: { errors: string[] } | undefined;
  label?: string | React.ReactElement;
}
