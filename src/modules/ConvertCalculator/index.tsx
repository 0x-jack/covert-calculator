"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConvertQuotes } from "@/hooks/api/useConvertQuotes";
import { useSupportedTokens } from "@/hooks/api/useSupportedTokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Currency {
  symbol: string;
  name: string;
  chainId: string;
  logo?: string;
  balance?: number;
  price?: number;
}

// Zod validation schema
const convertFormSchema = z.object({
  sellAmount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    })
    .refine((val) => parseFloat(val) <= 1000000, {
      message: "Amount cannot exceed 1,000,000",
    }),
  debouncedSellAmount: z.string().min(1, "Amount is required"),
  sellToken: z
    .custom<Currency>()
    .refine((val) => val !== undefined, {
      message: "Sell token is required",
    })
    .optional(),
  buyToken: z
    .custom<Currency>()
    .refine((val) => val !== undefined, {
      message: "Buy token is required",
    })
    .optional(),
});

type ConvertFormData = z.infer<typeof convertFormSchema>;

export const ConvertCalculator = () => {
  const { data: tokens, isLoading } = useSupportedTokens();

  const form = useForm<ConvertFormData>({
    resolver: zodResolver(convertFormSchema),
    defaultValues: {
      sellAmount: "0.0",
      sellToken: {
        symbol: "ETH",
        name: "Ethereum",
        chainId: "1",
      },
    },
  });

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Watch form values for calculations
  const debouncedSellAmount = watch("debouncedSellAmount");
  const sellAmount = watch("sellAmount");
  const sellToken = watch("sellToken");
  const buyToken = watch("buyToken");

  const debouncedSetSellAmount = useMemo(
    () =>
      debounce((amount: string) => {
        setValue("debouncedSellAmount", amount, { shouldValidate: true });
      }, 400),
    [setValue]
  );

  useEffect(() => {
    debouncedSetSellAmount(sellAmount);
    return () => {
      debouncedSetSellAmount.cancel();
    };
  }, [sellAmount, debouncedSetSellAmount]);

  // Convert tokens to currencies format for compatibility
  const currencies: Currency[] =
    tokens?.map((token) => ({
      symbol: token.symbol,
      name: token.name,
      chainId: token.chainId,
    })) || [];

  const {
    data: quotesData,
    isPending: quotesLoading,
    error,
  } = useConvertQuotes({
    sellToken,
    buyToken,
    sellAmount: debouncedSellAmount,
  });

  const getUSDEquivalent = (amount: string, currency: Currency) => {
    const value = parseFloat(amount) || 0;
    return (value * (currency.price || 0)).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tokens...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load tokens</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <Form {...form}>
        <form className="max-w-md mx-auto space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Sell
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <FormField
                  control={control}
                  name="sellAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-3xl font-bold text-center border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                          placeholder="0.0"
                          type="number"
                          step="0.000001"
                          min="0"
                        />
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                {/* <p className="text-sm text-muted-foreground mt-1">
                  $ {getUSDEquivalent(sellAmount, sellCurrencyData!)}
                </p> */}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={control}
                    name="sellToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value?.symbol}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-auto border-none bg-transparent p-0 h-auto">
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">
                                    {field.value?.logo}
                                  </span>
                                  <span className="font-medium">
                                    {field.value?.symbol}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {tokens?.map((token) => (
                                <SelectItem
                                  key={token.symbol}
                                  value={token.symbol}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span>{token.name}</span>
                                    <span>{token.symbol}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              size="sm"
              className="rounded-full h-10 w-10 p-0 border-2 border-border bg-background hover:bg-muted"
              variant="outline"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Buy Section */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Buy
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                {/* <FormField
                  control={control}
                  name="buyToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-3xl font-bold text-center border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                          placeholder="0.0"
                          type="number"
                          step="0.000001"
                          min="0"
                        />
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                /> */}
                {/* <p className="text-sm text-muted-foreground mt-1">
                  $ {getUSDEquivalent(buyAmount, buyCurrencyData!)}
                </p> */}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={control}
                    name="buyToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value?.symbol}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-auto border-none bg-transparent p-0 h-auto">
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">
                                    {field.value?.logo}
                                  </span>
                                  <span className="font-medium">
                                    {field.value?.symbol}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {tokens?.map((token) => (
                                <SelectItem
                                  key={token.symbol}
                                  value={token.symbol}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span>{token.name}</span>
                                    <span>{token.symbol}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
