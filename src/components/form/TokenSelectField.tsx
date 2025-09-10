import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Token } from "@/hooks/api/useSupportedTokens";
import { getTokenKey } from "@/lib/utils";

export const TokenSelectField = ({
  name,
  options,
  isLoading,
  label,
}: {
  name: string;
  options: Token[] | undefined;
  isLoading: boolean;
  label?: string;
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="text-xs text-muted-foreground/50">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Select
              value={getTokenKey(field.value)}
              onValueChange={(value) => {
                const selectedToken = options?.find(
                  (token) => getTokenKey(token) === value
                );
                field.onChange(selectedToken);
              }}
            >
              <SelectTrigger className="w-auto border-none bg-transparent px-4 h-auto cursor-pointer min-w-[120px]">
                <SelectValue>
                  {field.value && (
                    <span className="font-medium">{field.value?.symbol}</span>
                  )}
                  {!field.value && (
                    <span className="font-medium opacity-50">Select token</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {options?.map((token) => (
                  <SelectItem
                    key={getTokenKey(token)}
                    value={getTokenKey(token)}
                    className="cursor-pointer"
                  >
                    <span>{token.symbol}</span>
                  </SelectItem>
                ))}
                {isLoading && (
                  <SelectItem value="loading">
                    <span>Loading...</span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
