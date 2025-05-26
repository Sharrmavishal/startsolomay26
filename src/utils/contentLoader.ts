// This file loads content from JSON files
// In a real implementation, this would fetch data from the CMS

// Import content files
import generalSettings from '../content/settings/general.json';
import headerSettings from '../content/settings/header.json';
import heroContent from '../content/sections/hero.json';
import webinarDatesContent from '../content/sections/webinarDates.json';
import webinarInfoContent from '../content/sections/webinarInfo.json';
import featuredInContent from '../content/sections/featuredIn.json';
import instructorContent from '../content/sections/instructor.json';
import courseContent from '../content/sections/course.json';
import testimonialsContent from '../content/sections/testimonials.json';
import journeyContent from '../content/sections/journey.json';
import whatsappHubContent from '../content/sections/whatsappHub.json';
import guaranteeContent from '../content/sections/guarantee.json';
import faqContent from '../content/sections/faq.json';
import ctaContent from '../content/sections/cta.json';
import footerContent from '../content/sections/footer.json';
import brandingSettings from '../content/settings/branding.json';
import seoSettings from '../content/settings/seo.json';

// Define types for content
export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  cohortStartDate: string;
  currentCohort: number;
  nextCohort: number;
  nextCohortStartDate: string;
  countdown: {
    enabled: boolean;
    message: string;
    buttonText: string;
  };
}

export interface HeaderSettings {
  logoText: string;
  navLinks: Array<{
    label: string;
    url: string;
    external?: boolean;
  }>;
  ctaButton: {
    text: string;
    url: string;
    trackingId?: string;
  };
  whatsappButton: {
    text: string;
    url: string;
    trackingId?: string;
  };
  mobileMenu: {
    ctaText: string;
    whatsappText: string;
  };
}

export interface HeroSection {
  highlight: string;
  heading: string;
  subheading: string;
  keyPoints: string[];
  primaryButton: {
    text: string;
    url: string;
    trackingId?: string;
  };
  secondaryButton: {
    text: string;
    url: string;
    trackingId?: string;
  };
  videoId: string | null;
  previewImage: string;
  sessionDuration: string;
  sessionPrice: string;
  originalPrice: string;
  participantsCount: string;
  cardFeatures: Array<{
    icon: string;
    text: string;
  }>;
}

export interface BrandingSettings {
  primaryColor: {
    default: string;
    light: string;
    dark: string;
  };
  secondaryColor: {
    default: string;
    light: string;
    dark: string;
  };
  accentColor: {
    default: string;
    light: string;
    dark: string;
  };
  tertiaryColor: {
    default: string;
    light: string;
    dark: string;
  };
  highlightColor: {
    default: string;
    light: string;
    dark: string;
  };
  richColor: {
    default: string;
    light: string;
    dark: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
  };
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  twitterCard: string;
  gaId: string;
  eventDate: string;
  eventEndDate: string;
}

// Export content getters
export const getGeneralSettings = (): GeneralSettings => generalSettings;
export const getHeaderSettings = (): HeaderSettings => headerSettings;
export const getHeroContent = (): HeroSection => heroContent;
export const getWebinarDatesContent = () => webinarDatesContent;
export const getWebinarInfoContent = () => webinarInfoContent;
export const getFeaturedInContent = () => featuredInContent;
export const getInstructorContent = () => instructorContent;
export const getCourseContent = () => courseContent;
export const getTestimonialsContent = () => testimonialsContent;
export const getJourneyContent = () => journeyContent;
export const getWhatsappHubContent = () => whatsappHubContent;
export const getGuaranteeContent = () => guaranteeContent;
export const getFaqContent = () => faqContent;
export const getCtaContent = () => ctaContent;
export const getFooterContent = () => footerContent;
export const getBrandingSettings = (): BrandingSettings => brandingSettings;
export const getSEOSettings = (): SEOSettings => seoSettings;

// Get all content in one call
export const getContent = () => {
  return {
    general: generalSettings,
    header: headerSettings,
    hero: heroContent,
    webinarDates: webinarDatesContent,
    webinarInfo: webinarInfoContent,
    featuredIn: featuredInContent,
    instructor: instructorContent,
    course: courseContent,
    testimonials: testimonialsContent,
    journey: journeyContent,
    whatsappHub: whatsappHubContent,
    guarantee: guaranteeContent,
    faq: faqContent,
    cta: ctaContent,
    footer: footerContent,
    branding: brandingSettings,
    seo: seoSettings
  };
};

// Helper function to format markdown content (simple implementation)
export const formatMarkdown = (text: string): string => {
  // Simple markdown formatting for bold text
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};