import { Token } from "./useSupportedTokens";
import { useTokenQuotes } from "./useTokenQuotes";

export const useConvertQuotes = ({
  sellToken,
  buyToken,
  sellAmount,
}: {
  sellToken: Token | undefined;
  buyToken: Token | undefined;
  sellAmount: string;
}) => {
  const sellTokenQuotes = useTokenQuotes({
    token: sellToken,
    sellAmount: sellAmount,
  });

  const buyTokenQuotes = useTokenQuotes({
    token: buyToken,
    sellAmount: sellAmount,
  });

  return {
    buyTokenQuotes,
    sellTokenQuotes,
  };
};
