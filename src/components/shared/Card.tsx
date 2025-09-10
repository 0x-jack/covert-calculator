import { cn } from "@/lib/utils";

export const Card = ({
  children,
  title,
  hasError,
}: {
  children: React.ReactNode;
  title: string;
  hasError?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-6 shadow-lg",
        hasError && "border-red-500"
      )}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-white/80">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
};
