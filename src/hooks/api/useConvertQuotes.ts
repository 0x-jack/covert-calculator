import { useQuery } from "@tanstack/react-query";
import { Token } from "./useSupportedTokens";

const fetchConvertQuotes = async ({
  sellToken,
  buyToken,
  sellAmount,
}: {
  sellToken: Token | undefined;
  buyToken: Token | undefined;
  sellAmount: string;
}) => {
  if (!sellToken || !buyToken || !sellAmount) {
    return null;
  }
  console.log("fetching convert quotes", sellToken, buyToken, sellAmount);
  //   return apiRequest("/convert-quotes", {
  //     method: "POST",
  //     body: { sellToken, buyToken, sellAmount },
  //   });

  return null;
};

export const useConvertQuotes = ({
  sellToken,
  buyToken,
  sellAmount,
}: {
  sellToken: Token | undefined;
  buyToken: Token | undefined;
  sellAmount: string;
}) => {
  return useQuery({
    queryKey: ["convert-quotes", sellToken, buyToken, sellAmount],
    queryFn: () => fetchConvertQuotes({ sellToken, buyToken, sellAmount }),
    staleTime: 0,
    gcTime: 0,
    enabled: !!sellToken && !!buyToken && !!sellAmount,
    // refetchInterval: 10000,
  });
};
