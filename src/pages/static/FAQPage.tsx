import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/shared/SEOHead";

const faqs = [
  { q: "How do I place an order?", a: "Browse products, add them to your cart, and proceed to checkout. Choose your delivery address, payment method, and confirm your order." },
  { q: "What payment methods are accepted?", a: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and cash on delivery." },
  { q: "How can I track my order?", a: "Go to My Orders from your profile menu and click on any order to see the full tracking timeline with real-time status updates." },
  { q: "What is your return policy?", a: "Most products can be returned within 30 days of delivery. Initiate a return from your order detail page and our team will process it within 3-5 business days." },
  { q: "How do I become a seller on MarketHub?", a: "Click on 'Sell on MarketHub' and fill out the vendor registration form. Our team reviews applications within 2-3 business days." },
  { q: "Is my payment information secure?", a: "Yes! We use industry-standard encryption and PCI-compliant payment gateways to protect your financial data." },
  { q: "How do I apply a coupon code?", a: "During checkout, enter your coupon code in the 'Coupon code' field in the order summary section and click 'Apply'." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled before they are shipped. Go to My Orders, select the order, and click 'Cancel Order'." },
];

export default function FAQPage() {
  return (
    <div className="container py-8 max-w-3xl">
      <SEOHead title="FAQ - MarketHub" description="Frequently asked questions about shopping on MarketHub." />
      <h1 className="font-display text-2xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-sm text-muted-foreground mb-6">Find answers to common questions about shopping, orders, and more.</p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
