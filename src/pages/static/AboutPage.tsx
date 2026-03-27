import { Building2, Users, Globe, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/shared/SEOHead";

const stats = [
  { icon: Users, label: "Active Customers", value: "89,000+" },
  { icon: Building2, label: "Verified Vendors", value: "500+" },
  { icon: Globe, label: "Cities Served", value: "120+" },
  { icon: Award, label: "Products Listed", value: "50,000+" },
];

export default function AboutPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <SEOHead title="About Us - MarketHub" description="Learn about MarketHub, India's leading multi-vendor marketplace." />
      <h1 className="font-display text-2xl font-bold mb-4">About MarketHub</h1>
      <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
        <p>MarketHub is India's premier multi-vendor marketplace, connecting customers with trusted sellers across categories — from electronics and fashion to home essentials and books.</p>
        <p>Founded with a mission to democratize e-commerce, we empower small and medium businesses to reach customers nationwide while providing shoppers with a curated, trustworthy shopping experience.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card text-center">
            <CardContent className="p-4">
              <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-display font-bold text-lg">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold mb-2">Our Mission</h2>
          <p className="text-sm text-muted-foreground">To build India's most trusted marketplace where every seller can thrive and every buyer finds exactly what they need — with transparency, quality, and convenience at every step.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold mb-2">Our Values</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Customer First — every decision starts with the buyer</li>
            <li>Seller Empowerment — tools and support to grow your business</li>
            <li>Trust & Transparency — verified sellers, honest reviews</li>
            <li>Innovation — constantly improving the shopping experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
