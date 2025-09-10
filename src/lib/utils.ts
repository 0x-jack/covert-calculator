import { Token } from "@/hooks/api/useSupportedTokens";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as dn from "dnum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTokenKey(token: Token | undefined) {
  if (!token) return "";
  return `${token.symbol}-${token.chainId}`;
}

export function getConvertedAmount({
  unitPrice,
  decimals,
  sellAmount,
  enabled,
}: {
  unitPrice: number;
  decimals: number;
  sellAmount: string;
  enabled: boolean;
}) {
  let price = "0";
  try {
    price =
      unitPrice && sellAmount && enabled
        ? dn.format(
            dn.div(
              dn.from(sellAmount || "0", decimals ?? 0),
              dn.from(unitPrice ?? "0", decimals ?? 0)
            ),
            {
              digits: Math.min(decimals, 6),
            }
          )
        : "0";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // ignore
    // console.log(e);
  }

  return price;
}
