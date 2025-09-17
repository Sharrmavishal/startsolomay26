import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund';
}

const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const policies = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Feb 24, 2025",
      content: `
# Privacy Policy

**Last Updated: Feb 24, 2025**

This Privacy Policy describes how Start Solo ("we," "us," or "our") collects, uses, and shares your personal information when you visit our website, register for our webinars, or purchase our courses.

## Information We Collect

### Personal Information

We may collect the following types of personal information:

- **Contact Information**: Name, email address, phone number
- **Account Information**: Username, password
- **Payment Information**: Credit card details, billing address
- **Profile Information**: Professional background, goals, preferences
- **Communication**: Messages sent to us via contact forms or email

### Usage Information

We automatically collect certain information about your device and how you interact with our website:

- **Device Information**: IP address, browser type, operating system
- **Usage Data**: Pages visited, time spent on pages, links clicked
- **Location Information**: General location based on IP address

## How We Use Your Information

We use your personal information for the following purposes:

- To provide and maintain our services
- To process and fulfill your purchases
- To send you important information about our services
- To communicate with you about webinars, courses, and other offerings
- To improve our website and services
- To comply with legal obligations

## How We Share Your Information

We may share your personal information with:

- **Service Providers**: Companies that help us deliver our services (payment processors, email service providers, etc.)
- **Legal Requirements**: When required by law or to protect our rights

We do not sell your personal information to third parties.

## Your Rights

Depending on your location, you may have certain rights regarding your personal information, including:

- The right to access your personal information
- The right to correct inaccurate information
- The right to delete your personal information
- The right to restrict or object to processing
- The right to data portability

To exercise these rights, please contact us at privacy@startsolo.in.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## Contact Us

If you have any questions about this Privacy Policy, please contact us:

Email: privacy@startsolo.in
Address: Start Solo, C2, Sector 1, Block C, Sector 1, Noida, Uttar Pradesh 201301`
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "Feb 24, 2025",
      content: `
# Terms of Service

**Last Updated: Feb 24, 2025**

Please read these Terms of Service ("Terms") carefully before using the Start Solo website or any of our services.

## Acceptance of Terms

By accessing or using our website, registering for webinars, or purchasing courses, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.

## Services

Start Solo provides educational content, webinars, courses, and resources for solopreneurs. We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.

## User Accounts

When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

## Payment and Refunds

### Payment

All prices are listed in Indian Rupees (INR) unless otherwise specified. By making a purchase, you authorize us to charge the payment method you provide.

### Refunds

For the Solo Accelerator Session, we offer a 100% money-back guarantee if you attend the full session and don't feel it was worth your time.

For course purchases, refund policies will be specified at the time of purchase. Generally, we offer a 30-day money-back guarantee for our courses.

## Intellectual Property

All content on our website and in our courses, including text, graphics, logos, images, audio, video, and software, is the property of Start Solo and is protected by copyright and other intellectual property laws.

You may not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any of our materials without our express written consent.

## User Content

By submitting content to our website or services (such as comments, testimonials, or forum posts), you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.

## Limitation of Liability

To the maximum extent permitted by law, Start Solo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of or inability to access or use our services.

## Governing Law

These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.

## Changes to Terms

We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on our website and updating the "Last Updated" date.

## Contact Us

If you have any questions about these Terms, please contact us:

Email: legal@startsolo.in
Address: Start Solo, C2, Sector 1, Block C, Sector 1, Noida, Uttar Pradesh 201301`
    },
    refund: {
      title: "Refund Policy",
      lastUpdated: "Feb 24, 2025",
      content: `
# Refund Policy

**Last Updated: Feb 24, 2025**

At Start Solo, we want you to be completely satisfied with your investment in your learning journey. This refund policy outlines our commitment to fairness and transparency in all our offerings.

## Solo Accelerator Session (₹99)

### Money-Back Guarantee

We offer a 100% money-back guarantee for our Solo Accelerator Session under the following conditions:

- You attend the full 90-minute session
- You feel the session didn't provide value as promised
- You request a refund within 24 hours of attending the session

In addition to refunding your registration fee, we'll also provide complimentary access to our "Solo Business Starter Kit" (₹1,997 value) as a gesture of goodwill.

### How to Request a Refund

To request a refund for the Solo Accelerator Session:

1. Email us at hello@startsolo.in within 24 hours of attending the session
2. Include your registration details and reason for the refund
3. We'll process your refund within 5-7 business days

## Start Solo Course

### 30-Day Money-Back Guarantee

For our comprehensive Start Solo course, we offer a 30-day money-back guarantee:

- You must have completed less than 30% of the course content
- You must request the refund within 30 days of purchase
- You must provide detailed feedback about why the course didn't meet your expectations

### Refund Exclusions

Refunds are not available for:

- Course purchases made using special discount codes
- Bundle purchases or promotional offers
- After accessing more than 30% of the course content
- After the 30-day guarantee period has expired

### How to Request a Course Refund

1. Email hello@startsolo.in with subject line "Course Refund Request"
2. Include your purchase details and reason for refund
3. Our team will review your request within 48 hours
4. Approved refunds will be processed within 7-10 business days

## Additional Terms

- Refunds will be issued to the original payment method used for purchase
- Processing times may vary depending on your payment provider
- Any bonus materials or downloads must be deleted upon refund
- We reserve the right to deny refund requests that don't meet our criteria

## Contact Us

If you have any questions about our refund policy, please contact us:

- Email: hello@startsolo.in
- WhatsApp: Join our Support Hub
- Contact Form: Visit our Support Page
- Address: Start Solo, C2, Sector 1, Block C, Sector 1, Noida, Uttar Pradesh 201301

We're committed to ensuring your satisfaction and will work with you to resolve any concerns about our products or services.`
    }
  };

  const selectedPolicy = policies[type];

  return (
    <div className="min-h-screen bg-[color:var(--color-gray-50)] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[color:var(--color-gray-100)]">
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[color:var(--color-gray-900)] mb-2">{selectedPolicy.title}</h1>
                <p className="text-[color:var(--color-gray-900)]">Last Updated: {selectedPolicy.lastUpdated}</p>
              </div>
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: selectedPolicy.content
                    .replace(/# (.*)/g, '<h1 class="text-3xl font-bold mb-6">$1</h1>')
                    .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
                    .split('\n\n').join('<br><br>')
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;