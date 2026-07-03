import { useEffect } from 'react';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  canonicalUrl,
  schemaType = 'LocalBusiness',
  config = {} 
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title || config.seo?.metaTitle || 'Palki Banquet | Premium Luxury Venue';

    // 2. Helper to set/update meta tag
    const updateMetaTag = (name, content, attrName = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Update Standard Meta Tags
    updateMetaTag('description', description || config.seo?.metaDescription || '');
    updateMetaTag('keywords', keywords || config.seo?.metaKeywords || '');
    updateMetaTag('robots', 'index, follow');

    // 4. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl || window.location.href);

    // 5. Update Open Graph (Facebook) Tags
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:title', title || config.seo?.metaTitle || '', 'property');
    updateMetaTag('og:description', description || config.seo?.metaDescription || '', 'property');
    updateMetaTag('og:image', ogImage || config.seo?.ogImage || '', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:site_name', config.businessName || 'Palki Banquet', 'property');

    // 6. Update Twitter Cards Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || config.seo?.metaTitle || '');
    updateMetaTag('twitter:description', description || config.seo?.metaDescription || '');
    updateMetaTag('twitter:image', ogImage || config.seo?.ogImage || '');

    // 7. Inject JSON-LD Schema
    const removeExistingSchema = (id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };

    // Remove old schemas
    removeExistingSchema('seo-schema-localbusiness');
    removeExistingSchema('seo-schema-faq');

    // Generate Local Business Schema
    if (schemaType === 'LocalBusiness' && config.contact) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-schema-localbusiness';
      
      const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        "name": config.businessName || "Palki Banquet",
        "image": ogImage || config.seo?.ogImage || "",
        "@id": window.location.origin + "#venue",
        "url": window.location.origin,
        "telephone": config.contact.phoneFormatted || "+919836929210",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": config.contact.address + ", " + config.contact.landmark,
          "addressLocality": "Munshirhat, J.B. Pur",
          "addressRegion": "Howrah, West Bengal",
          "postalCode": "711410",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 22.598583,
          "longitude": 87.986349
        },
        "priceRange": "$$",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "10:00",
            "closes": "22:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday", "Sunday"],
            "opens": "09:00",
            "closes": "23:00"
          }
        ],
        "sameAs": [
          config.socialLinks?.facebook || "",
          config.socialLinks?.instagram || "",
          config.socialLinks?.youtube || ""
        ].filter(Boolean)
      };

      script.text = JSON.stringify(localBusinessSchema);
      document.head.appendChild(script);
    }

    // Generate FAQ Schema
    if (config.faqs && config.faqs.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-schema-faq';

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": config.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };

      script.text = JSON.stringify(faqSchema);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, ogImage, canonicalUrl, schemaType, config]);

  return null;
}
