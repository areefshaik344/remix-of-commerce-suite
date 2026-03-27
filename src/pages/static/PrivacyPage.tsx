import SEOHead from "@/components/shared/SEOHead";

export default function PrivacyPage() {
  return (
    <div className="container py-8 max-w-3xl">
      <SEOHead title="Privacy Policy - MarketHub" description="MarketHub's privacy policy and data protection practices." />
      <h1 className="font-display text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground mb-6">Last updated: March 1, 2025</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-display text-base font-bold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, delivery addresses, and payment information. We also collect usage data including browsing patterns, device information, and IP addresses.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">2. How We Use Your Information</h2>
          <p>Your information is used to process orders, personalize your shopping experience, communicate order updates, improve our services, and prevent fraud. We never sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">3. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits to protect your personal information.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">4. Cookies</h2>
          <p>We use cookies to maintain your session, remember preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@markethub.in to exercise these rights.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-bold text-foreground">6. Contact</h2>
          <p>For privacy-related inquiries, contact our Data Protection Officer at privacy@markethub.in or write to: 42, Bandra Kurla Complex, Mumbai 400051.</p>
        </section>
      </div>
    </div>
  );
}
