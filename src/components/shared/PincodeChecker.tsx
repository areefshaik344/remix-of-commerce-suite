import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Check, X, Truck } from "lucide-react";

const deliverablePincodes: Record<string, { city: string; days: number }> = {
  "400001": { city: "Mumbai", days: 2 },
  "400002": { city: "Mumbai", days: 2 },
  "560001": { city: "Bangalore", days: 3 },
  "560066": { city: "Bangalore (Whitefield)", days: 3 },
  "110001": { city: "Delhi", days: 2 },
  "411001": { city: "Pune", days: 3 },
  "500001": { city: "Hyderabad", days: 4 },
  "600001": { city: "Chennai", days: 3 },
  "700001": { city: "Kolkata", days: 4 },
  "380001": { city: "Ahmedabad", days: 4 },
  "302001": { city: "Jaipur", days: 5 },
  "226001": { city: "Lucknow", days: 5 },
};

export function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{ available: boolean; city?: string; days?: number } | null>(null);

  const handleCheck = () => {
    if (pincode.length !== 6) return;
    const match = deliverablePincodes[pincode];
    if (match) {
      setResult({ available: true, city: match.city, days: match.days });
    } else {
      setResult({ available: false });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Delivery</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter pincode"
          value={pincode}
          onChange={e => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setResult(null); }}
          maxLength={6}
          className="w-36"
        />
        <Button variant="outline" size="sm" onClick={handleCheck} disabled={pincode.length !== 6}>
          Check
        </Button>
      </div>
      {result && (
        <div className={`flex items-center gap-2 text-xs rounded-md p-2 ${
          result.available ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}>
          {result.available ? (
            <>
              <Check className="h-3 w-3" />
              <span>Delivery available to {result.city}</span>
              <span className="ml-auto flex items-center gap-1">
                <Truck className="h-3 w-3" /> {result.days} days
              </span>
            </>
          ) : (
            <>
              <X className="h-3 w-3" />
              <span>Delivery not available for this pincode</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
