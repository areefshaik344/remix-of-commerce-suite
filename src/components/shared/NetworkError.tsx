import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function NetworkError({ message = "Something went wrong. Please try again.", onRetry }: NetworkErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <WifiOff className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="font-display font-semibold text-lg mb-1">Connection Error</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      )}
    </div>
  );
}
