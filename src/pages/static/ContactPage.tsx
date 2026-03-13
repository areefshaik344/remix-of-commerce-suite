import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEOHead } from "@/components/shared/SEOHead";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container py-8 max-w-4xl">
      <SEOHead title="Contact Us - MarketHub" description="Get in touch with the MarketHub team." />
      <h1 className="font-display text-2xl font-bold mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name</Label><Input placeholder="Your name" required /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@example.com" required /></div>
                </div>
                <div className="space-y-2"><Label>Subject</Label><Input placeholder="How can we help?" required /></div>
                <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Tell us more..." rows={5} required /></div>
                <Button type="submit" disabled={loading} className="gap-2">
                  <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "support@markethub.in" },
            { icon: Phone, label: "Phone", value: "+91 1800-123-4567" },
            { icon: MapPin, label: "Office", value: "42, Bandra Kurla Complex, Mumbai 400051" },
          ].map(item => (
            <Card key={item.label} className="shadow-card">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2"><item.icon className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
