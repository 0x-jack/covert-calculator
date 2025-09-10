import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { NumberInput, NumberInputProps } from "../shared/NumberInput";

export const NumericField = ({
  name,
  NumberInputProps,
  label,
}: {
  name: string;
  NumberInputProps?: NumberInputProps;
  label?: string;
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="text-xs text-muted-foreground/40">
            {label}
          </FormLabel>
          <FormControl>
            <NumberInput
              className="font-bold border-none bg-transparent px-4 h-[36px] focus-visible:ring-0 flex-1"
              placeholder="0.0"
              type="text"
              min={0}
              decimalScale={18}
              {...NumberInputProps}
              {...field}
              value={parseFloat(field.value)}
              onValueChange={field.onChange}
            />
          </FormControl>
          <FormMessage className="text-center" />
        </FormItem>
      )}
    />
  );
};
