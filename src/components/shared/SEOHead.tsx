// SEO metadata helper
export default function SEOHead({ title, description }: { title?: string; description?: string }) {
  if (title) document.title = title;
  return null;
}
