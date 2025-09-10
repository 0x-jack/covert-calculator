"use client";

import { NumericField } from "@/components/form/NumericField";
import { TokenSelectField } from "@/components/form/TokenSelectField";
import { Card } from "@/components/shared/Card";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useConvertQuotes } from "@/hooks/api/useConvertQuotes";
import { useSupportedTokens } from "@/hooks/api/useSupportedTokens";
import { getConvertedAmount } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { ArrowDown } from "lucide-react";
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
  const { data: tokens, isLoading: tokensLoading } = useSupportedTokens();

  const form = useForm<ConvertFormData>({
    resolver: zodResolver(convertFormSchema),
    defaultValues: {},
  });

  const { setValue, watch } = form;

  // Watch form values for calculations
  const debouncedSellAmount = watch("debouncedSellAmount");
  const sellAmount = watch("sellAmount");
  const sellToken = watch("sellToken");
  const buyToken = watch("buyToken");

  console.log("sellAmount", sellAmount, sellToken);

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

  const { buyTokenQuotes, sellTokenQuotes } = useConvertQuotes({
    sellToken,
    buyToken,
    sellAmount: debouncedSellAmount,
  });

  const isSellTokenQuotesEnabled = !!debouncedSellAmount && !!sellToken;
  const isBuyTokenQuotesEnabled = !!debouncedSellAmount && !!buyToken;

  console.log("debouncedSellAmount", debouncedSellAmount);

  const sellTokenQuotesError = sellTokenQuotes.error;
  const buyTokenQuotesError = buyTokenQuotes.error;

  return (
    <div className="h-full flex flex-col justify-center text-foreground p-4">
      <h1 className="text-2xl font-bold text-center mb-10">
        Convert Calculator
      </h1>
      <Form {...form}>
        <form className="max-w-md mx-auto space-y-4">
          <Card title="You Pay" hasError={!!sellTokenQuotesError}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <NumericField name="sellAmount" label="Amount ($)" />
                <AmountDisplay
                  value={getConvertedAmount({
                    unitPrice: sellTokenQuotes.data?.priceQuote.unitPrice ?? 0,
                    decimals: sellTokenQuotes.data?.tokenInfo.decimals ?? 0,
                    sellAmount: debouncedSellAmount ?? "0",
                    enabled: isSellTokenQuotesEnabled,
                  })}
                  prefix="~"
                  suffix={sellToken?.symbol}
                  isPending={
                    isSellTokenQuotesEnabled && sellTokenQuotes?.isPending
                  }
                  isFetching={
                    isSellTokenQuotesEnabled && sellTokenQuotes?.isFetching
                  }
                />
              </div>
              <TokenSelectField
                name="sellToken"
                label="Source Token"
                options={tokens}
                isLoading={tokensLoading}
              />
            </div>
            {sellTokenQuotes.error && (
              <div className="text-sm text-red-500 mt-4">
                {sellTokenQuotes.error.message}
              </div>
            )}
          </Card>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              size="sm"
              className="rounded-full h-10 w-10 p-0 border-2 border-border bg-background hover:bg-muted"
              variant="outline"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          <Card title="You Receive" hasError={!!buyTokenQuotesError}>
            <div className="flex items-center justify-between gap-4">
              <AmountDisplay
                value={getConvertedAmount({
                  unitPrice: buyTokenQuotes.data?.priceQuote.unitPrice ?? 0,
                  decimals: buyTokenQuotes.data?.tokenInfo.decimals ?? 0,
                  sellAmount: debouncedSellAmount ?? "0",
                  enabled: isBuyTokenQuotesEnabled,
                })}
                prefix="="
                suffix={buyToken?.symbol}
                isPending={isBuyTokenQuotesEnabled && buyTokenQuotes?.isPending}
                isFetching={
                  isBuyTokenQuotesEnabled && buyTokenQuotes?.isFetching
                }
                className="text-lg font-medium"
              />
              <TokenSelectField
                name="buyToken"
                options={tokens}
                isLoading={tokensLoading}
              />
            </div>
            {buyTokenQuotes.error && (
              <div className="text-sm text-red-500 mt-4">
                {buyTokenQuotes.error.message}
              </div>
            )}
          </Card>
        </form>
      </Form>
    </div>
  );
};
