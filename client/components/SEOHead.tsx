import { useEffect } from "react";
import { Quote } from "@shared/api";

interface SEOHeadProps {
  quotes?: Quote[];
  randomQuote?: Quote | null;
  searchQuery?: string;
}

export function SEOHead({ quotes = [], randomQuote, searchQuery }: SEOHeadProps) {
  useEffect(() => {
    // Enhanced structured data for better Google ranking
    const websiteStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AnimeQuotes",
      "alternateName": ["Anime Quotes", "Best Anime Quotes", "Inspirational Anime Quotes"],
      "description": "The ultimate collection of anime quotes from popular series. Find motivation and inspiration from over 1000 quotes from your favorite anime characters.",
      "url": "https://animequotes.sbs",
      "sameAs": [
        "https://twitter.com/animequotes",
        "https://facebook.com/animequotes",
        "https://instagram.com/animequotes"
      ],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://animequotes.sbs/?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AnimeQuotes",
        "url": "https://animequotes.sbs",
        "logo": {
          "@type": "ImageObject",
          "url": "https://animequotes.sbs/logo.png",
          "width": 512,
          "height": 512
        }
      }
    };

    // Collection structured data
    const collectionStructuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": searchQuery ? `Anime Quotes: ${searchQuery}` : "Best Anime Quotes Collection",
      "description": searchQuery 
        ? `Find anime quotes related to "${searchQuery}". Discover inspirational quotes from anime characters.`
        : "Comprehensive collection of the best anime quotes from popular series like Naruto, One Piece, Attack on Titan, and more.",
      "url": searchQuery 
        ? `https://animequotes.sbs/?search=${encodeURIComponent(searchQuery)}`
        : "https://animequotes.sbs",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Anime Quotes Collection",
        "description": "Curated collection of inspiring quotes from anime characters",
        "numberOfItems": quotes.length,
        "itemListElement": quotes.slice(0, 20).map((quote, index) => ({
          "@type": "Quotation",
          "position": index + 1,
          "text": quote.quote,
          "url": `https://animequotes.sbs/quote/${quote._id}`,
          "spokenByCharacter": {
            "@type": "Person",
            "name": quote.character
          },
          "isPartOf": {
            "@type": "CreativeWork",
            "name": quote.anime,
            "@type": "TVSeries"
          },
          "keywords": [quote.tag, "anime quotes", quote.anime, quote.character].filter(Boolean).join(", "),
          "inLanguage": "en",
          "genre": ["Animation", "Anime"],
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/LikeAction",
            "userInteractionCount": quote.likes || 0
          }
        }))
      }
    };

    // Featured quote structured data
    const featuredQuoteData = randomQuote ? {
      "@context": "https://schema.org",
      "@type": "Quotation",
      "text": randomQuote.quote,
      "spokenByCharacter": {
        "@type": "Person",
        "name": randomQuote.character
      },
      "isPartOf": {
        "@type": "TVSeries",
        "name": randomQuote.anime,
        "genre": "Animation"
      },
      "url": `https://animequotes.sbs/quote/${randomQuote._id}`,
      "keywords": [randomQuote.tag, "featured anime quote", randomQuote.anime].filter(Boolean).join(", "),
      "inLanguage": "en"
    } : null;

    // Breadcrumb structured data
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://animequotes.sbs"
        },
        ...(searchQuery ? [{
          "@type": "ListItem",
          "position": 2,
          "name": `Search: ${searchQuery}`,
          "item": `https://animequotes.sbs/?search=${encodeURIComponent(searchQuery)}`
        }] : [])
      ]
    };

    // Remove existing structured data
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      if (script.id?.startsWith('structured-data')) {
        script.remove();
      }
    });

    // Add all structured data
    const structuredDatasets = [
      { id: 'structured-data-website', data: websiteStructuredData },
      { id: 'structured-data-collection', data: collectionStructuredData },
      { id: 'structured-data-breadcrumb', data: breadcrumbData }
    ];

    if (featuredQuoteData) {
      structuredDatasets.push({ id: 'structured-data-featured', data: featuredQuoteData });
    }

    structuredDatasets.forEach(({ id, data }) => {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    // Dynamic meta tag updates for better SEO
    if (randomQuote) {
      // Update meta description with featured quote
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `"${randomQuote.quote}" - ${randomQuote.character} from ${randomQuote.anime}. Discover 1000+ inspirational anime quotes from popular series like Naruto, One Piece, Attack on Titan and more.`
        );
      }

      // Update Open Graph description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', 
          `Featured Quote: "${randomQuote.quote}" - ${randomQuote.character}. Find inspiration from the best anime quotes collection.`
        );
      }
    }

    // Update title for search queries
    if (searchQuery) {
      document.title = `${searchQuery} - Anime Quotes | AnimeQuotes.sbs`;
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${searchQuery} - Anime Quotes | AnimeQuotes`);
      }
    } else {
      document.title = "AnimeQuotes - Best Anime Quotes Collection | 1000+ Inspirational Quotes";
    }

    return () => {
      // Cleanup structured data on unmount
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        if (script.id?.startsWith('structured-data')) {
          script.remove();
        }
      });
    };
  }, [quotes, randomQuote, searchQuery]);

  return null;
}
