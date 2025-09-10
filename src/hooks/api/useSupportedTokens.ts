import { useQuery } from "@tanstack/react-query";

export interface Token {
  symbol: string;
  name: string;
  chainId: string;
}

const fetchSupportedTokens = async (): Promise<Token[]> => {
  return [
    {
      symbol: "USDC",
      name: "USD Coin",
      chainId: "1",
    },
    {
      symbol: "USDT",
      name: "Tether",
      chainId: "137",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      chainId: "8453",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      chainId: "1",
    },
    {
      symbol: "FAIL",
      name: "Fail",
      chainId: "1",
    },
  ];
};

export const useSupportedTokens = () => {
  return useQuery({
    queryKey: ["supported-tokens"],
    queryFn: fetchSupportedTokens,
  });
};
