import React, { useEffect } from 'react';
import { useContent } from './ContentProvider';

const SEOHead: React.FC = () => {
  const { general } = useContent();

  if (!general) {
    console.warn('General content is missing from context in SEOHead.');
  }
  // Get cohort start date from CMS or use fallback
  const cohortStartDate = general?.cohortStartDate || "March 22, 2025";
  
  useEffect(() => {
    // Update document title
    document.title = "Start Solo by Diksha Sethi | Start a Profitable Solo Business, But Not Alone";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `Join the 90-minute Solo Accelerator Session to learn the proven framework that can help you launch and grow successful businesses. Just ₹99. Limited seats available. Next cohort starts ${cohortStartDate}`);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'solopreneur, solo business, entrepreneurship, start a business, online business, freelance, coaching, consulting, side hustle, branding, marketing, client acquisition, business automation, scaling a business, solopreneurship, small business growth');
    
    // Update Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: 'Launchpad Business Starter Course by Start Solo' },
      { property: 'og:description', content: 'Kickstart your solo business with Launchpad Business Starter Course by Start Solo. 4‑week, self‑paced, mentor-led by Diksha Sethi.' },
      { property: 'og:image', content: 'https://res.cloudinary.com/dnm2ejglr/image/upload/v1741527316/Training_Unoptimised_iaovgq.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://startsolo.in' }
    ];
    
    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // Update Twitter meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Launchpad Business Starter Course by Start Solo' },
      { name: 'twitter:description', content: 'Kickstart your solo business with Launchpad Business Starter Course by Start Solo. 4‑week, self‑paced, mentor-led by Diksha Sethi.' },
      { name: 'twitter:image', content: 'https://res.cloudinary.com/dnm2ejglr/image/upload/v1741527316/Training_Unoptimised_iaovgq.png' }
    ];
    
    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // Update structured data
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Start Solo Blueprint - Solo Accelerator Session",
      "description": "Learn how to build a profitable solo business without burning out in this 90-minute webinar. Get access to proven strategies that have helped 2,800+ solopreneurs succeed.",
      "startDate": `${cohortStartDate}T10:00:00+05:30`,
      "endDate": `${cohortStartDate}T11:50:00+05:30`,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://startsolo.in"
      },
      "image": "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741527316/Training_Unoptimised_iaovgq.png",
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "availability": "https://schema.org/LimitedAvailability",
        "validFrom": "2025-05-01",
        "url": "https://startsolo.in"
      },
      "performer": {
        "@type": "Person",
        "name": "Diksha Sethi",
        "jobTitle": "Founder of Start Solo",
        "description": "Communications Specialist with 18+ years of experience leading brands like Mastercard, Ford, IndiGo, SpiceJet, and Qualcomm"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Start Solo",
        "url": "https://startsolo.in",
        "description": "Helping solopreneurs build, launch, and grow their solo business"
      }
    };
    
    scriptTag.textContent = JSON.stringify(structuredData);
    
    // Update canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', 'https://startsolo.in');
    
  }, [cohortStartDate]);
  
  return null; // This component doesn't render anything visible
};

export default SEOHead;