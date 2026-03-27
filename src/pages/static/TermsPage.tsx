import SEOHead from "@/components/shared/SEOHead";

export default function TermsPage() {
  return (
    <div className="container py-8 max-w-3xl">
      <SEOHead title="Terms of Service - MarketHub" description="Terms and conditions for using the MarketHub marketplace." />
      <h1 className="font-display text-2xl font-bold mb-2">Terms of Service</h1>
      <p className="text-xs text-muted-foreground mb-6">Last updated: March 1, 2025</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-display text-base font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using MarketHub, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">2. Account Registration</h2>
          <p>You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and all activities under your account.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">3. Orders & Payments</h2>
          <p>All orders are subject to product availability and payment confirmation. Prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to cancel orders in cases of pricing errors or suspected fraud.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">4. Returns & Refunds</h2>
          <p>Products may be returned within 30 days of delivery subject to our return policy. Refunds are processed within 5-7 business days after the returned item is received and inspected.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">5. Vendor Obligations</h2>
          <p>Vendors must provide accurate product descriptions, maintain adequate stock, and fulfill orders within the committed timeline. MarketHub reserves the right to suspend vendors who violate these obligations.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">6. Intellectual Property</h2>
          <p>All content on MarketHub, including logos, designs, and text, is owned by MarketHub or its content suppliers. Unauthorized reproduction or distribution is prohibited.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">7. Limitation of Liability</h2>
          <p>MarketHub acts as a marketplace facilitator. We are not liable for the quality, safety, or legality of products sold by third-party vendors on our platform.</p>
        </section>
      </div>
    </div>
  );
}
