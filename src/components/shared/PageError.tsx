import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({ message = "Failed to load data", onRetry }: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <WifiOff className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="font-display text-lg font-bold mb-1">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </Button>
      )}
    </div>
  );
}

interface InlineErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function InlineError({ message = "Failed to load", onRetry }: InlineErrorProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
      <p className="text-sm text-destructive flex-1">{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="text-destructive shrink-0">
          Retry
        </Button>
      )}
    </div>
  );
}
