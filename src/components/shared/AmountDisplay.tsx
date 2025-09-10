import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

export const AmountDisplay = ({
  value,
  isPending,
  isFetching,
  prefix,
  suffix,
  className,
}: {
  value: string;
  isPending: boolean;
  isFetching: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}) => {
  let content = null;
  if (isPending) {
    content = <Skeleton className="h-[20px] w-[100px]" />;
  } else {
    content = (
      <div className={cn("text-sm text-muted-foreground/90 px-2", className)}>
        {prefix} {value} {suffix}{" "}
        {isFetching && (
          <Loader2 className="w-3 h-3 inline-block animate-spin" />
        )}
      </div>
    );
  }

  return <div className="h-[20px] w-full">{content}</div>;
};
