import { useQuery } from "@tanstack/react-query";
import { Token } from "./useSupportedTokens";
import { queryClient } from "@/providers/query-provider";
import {
  getAssetErc20ByChainAndSymbol,
  DEV_API_KEY,
  getAssetPriceInfo,
} from "@funkit/api-base";

const TOKEN_INFO_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const TOKEN_PRICE_STALE_TIME = 0; // 0 minutes

const fetchTokenInfo = async ({ token }: { token: Token }) => {
  return getAssetErc20ByChainAndSymbol({
    chainId: token.chainId,
    symbol: token.symbol,
    apiKey: DEV_API_KEY,
  });
};

const fetchTokenPrice = async ({
  token,
  address,
}: {
  token: Token;
  address: string;
}) => {
  return getAssetPriceInfo({
    chainId: token.chainId,
    assetTokenAddress: address,
    apiKey: DEV_API_KEY,
  });
};

const fetchTokenQuotes = async ({ token }: { token: Token | undefined }) => {
  if (!token) {
    return null;
  }

  if (token.symbol === "ETH") {
    throw new Error("test");
  }

  const tokenInfo = await queryClient.fetchQuery({
    queryKey: ["token-info", token],
    queryFn: async () => fetchTokenInfo({ token }),
    staleTime: TOKEN_INFO_STALE_TIME,
  });

  const priceQuote = await queryClient.fetchQuery({
    queryKey: ["token-price", token],
    queryFn: async () => fetchTokenPrice({ token, address: tokenInfo.address }),
    staleTime: TOKEN_PRICE_STALE_TIME,
  });

  return {
    tokenInfo,
    priceQuote,
  };
};

export const useTokenQuotes = ({
  token,
  sellAmount,
}: {
  token: Token | undefined;
  sellAmount?: string;
}) => {
  return useQuery({
    queryKey: ["token-quotes", token, sellAmount],
    queryFn: () => fetchTokenQuotes({ token }),
    staleTime: 0,
    enabled: !!token,
  });
};
