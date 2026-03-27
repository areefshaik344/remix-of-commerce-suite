import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SEOHead({ title, description, jsonLd }: SEOHeadProps) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    if (jsonLd) {
      let script = document.querySelector('script[data-seo="jsonld"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "jsonld");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);

      return () => { script?.remove(); };
    }
  }, [title, description, jsonLd]);

  return null;
}
