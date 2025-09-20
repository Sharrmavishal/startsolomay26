import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund';
}

const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const policies = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "January 20, 2025",
      content: `
# Privacy Policy

**Last Updated: January 20, 2025**

At Start Solo, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, register for our webinars, purchase our courses, or interact with our services.

## Information We Collect

We collect information that you voluntarily provide to us when you register, create an account, make purchases, or communicate with us. This includes your name, email address, phone number, professional background, payment information, and any messages or feedback you send us.

We also collect information during mentorship sessions, including session recordings (with your consent), notes from mentoring conversations, and feedback on your progress and goals.

We automatically collect certain information about your device and usage when you visit our website, including your IP address, browser type, pages visited, and general location based on your IP address.

## How We Use Your Information

We use your personal information to provide and maintain our educational services, process payments, deliver course materials, and provide customer support. We also use it to send you important updates about our services, notify you about new courses and offerings, and share relevant educational content.

For mentorship services, we use session recordings and notes to improve our mentorship program, track your progress, and provide personalized guidance. We analyze website usage to improve our services, personalize your experience, and ensure the security and integrity of our platform. We comply with applicable laws and regulations and protect our rights and prevent fraud.

## How We Share Your Information

We may share your personal information with trusted third-party service providers who assist us with payment processing, email marketing, website hosting, and analytics. We may also disclose your information when required by law, to protect our rights, or in the event of a business transfer.

**We do not sell, rent, or trade your personal information to third parties for marketing purposes.**

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, and malicious attacks. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.

## Your Rights and Choices

Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information. You can also opt out of marketing communications and manage your notification preferences. To exercise these rights, please contact us at privacy@startsolo.in.

## Cookies and Data Retention

We use cookies and similar technologies to remember your preferences, analyze website traffic, and ensure website functionality. You can control cookie settings through your browser preferences. We retain your personal information for as long as necessary to provide our services, comply with legal requirements, and support business operations.

## International Data Transfers and Children's Privacy

Your information may be transferred to and processed in countries other than your own, with appropriate safeguards in place. Our services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.

## Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Email**: privacy@startsolo.in
**Address**: Start Solo, C2, Sector 1, Block C, Sector 1, Noida, Uttar Pradesh 201301
**Phone**: Available through our support channels

We are committed to addressing your privacy concerns promptly and transparently.`
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "January 20, 2025",
      content: `
# Terms of Service

**Last Updated: January 20, 2025**

Welcome to Start Solo! These Terms of Service ("Terms") govern your use of our website, services, and educational programs. Please read these Terms carefully before accessing or using our services.

## Acceptance of Terms

By accessing our website, registering for webinars, purchasing courses, or using any of our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services.

## Description of Services

Start Solo provides comprehensive educational services for aspiring and current solopreneurs, including educational content, community access, mentorship programs, resources and tools, and support services. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.

## Mentorship Services

### Educational Nature and Individual Responsibility

Our mentorship services are designed to provide guidance, insights, and educational support to help you develop your entrepreneurial skills and business knowledge. While we provide valuable guidance and support, the ultimate success of your business endeavors depends on your individual efforts, market conditions, and various external factors.

Business success is influenced by numerous factors including market conditions, economic trends, competition, and industry changes that are beyond anyone's control. We provide strategic advice and recommendations, but you retain full responsibility for how you choose to implement these suggestions in your specific business context.

### Business Decision Autonomy and Professional Consultation

All business decisions remain entirely yours, and we encourage you to use our guidance as one input among many in your decision-making process. We recommend consulting with qualified professionals (accountants, lawyers, financial advisors) for specific legal, financial, or tax matters.

As with any business venture, there are inherent risks, and we encourage you to assess these risks carefully before making significant business decisions. Business success often requires ongoing learning, adaptation, and refinement of strategies based on real-world experience.

### Mentorship Session Terms

We strive to accommodate your schedule while maintaining high-quality mentorship experiences for all participants. Sessions may be recorded (with your consent) to help us improve our mentorship program and ensure consistent quality. We maintain strict confidentiality regarding your business information and expect the same professional discretion from you. We understand that business schedules can be unpredictable and offer flexible rescheduling with reasonable notice.

## Course Services

### Educational Content and Individual Application

Our course materials are designed for educational purposes and represent general business principles and strategies. The effectiveness of course content depends on how you adapt and apply the principles to your specific business situation. Business strategies that work in one market or time period may need adjustment for different conditions.

Business practices and market conditions evolve, and we encourage you to stay updated with current trends and best practices. For specific legal, financial, or regulatory matters, we recommend consulting with qualified professionals in those fields.

### Course Implementation Terms

Course completion and application of materials is entirely at your own pace and discretion. Course materials may be updated periodically to reflect current best practices and market conditions. When participating in course-related communities or forums, you agree to maintain professional and respectful communication. Course materials are for your personal use in building your business, not for redistribution or commercial training purposes.

## User Accounts and Registration

When you create an account with us, you must provide accurate, current, and complete information, maintain and update your information as necessary, and keep your account credentials secure and confidential. You are responsible for all activities that occur under your account and must comply with all applicable laws and regulations. We reserve the right to suspend or terminate your account if you violate these Terms.

## Payment Terms and Refunds

All prices are listed in Indian Rupees (INR) unless otherwise specified. Payment must be made in full before accessing course materials. We accept various payment methods including credit cards, debit cards, and digital wallets.

Our refund policies vary by service. For Launchpad: The Start Solo Business Starter Course, we offer a 3-day money-back guarantee with detailed feedback required. For other services, refund policies will be specified at the time of purchase. Processing time is typically 7-10 business days for approved refunds.

## Intellectual Property Rights

All content on our website and in our courses, including text, graphics, logos, images, audio, video, software, and course materials, is the exclusive property of Start Solo and is protected by copyright, trademark, and other intellectual property laws.

You may access and use our content for personal, non-commercial purposes and download materials specifically provided for download. You may not reproduce, distribute, or create derivative works without written permission, use our content for commercial purposes without authorization, remove copyright notices, or share login credentials with others.

## User-Generated Content

By submitting content to our platform, you grant us a non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and distribute your content. Your submitted content must be original, comply with applicable laws, and not contain harmful or inappropriate material. We reserve the right to review, moderate, and remove content that violates these Terms.

## Prohibited Activities

You agree not to use our services for any unlawful purpose, attempt to gain unauthorized access to our systems, interfere with our services, use automated systems to access our content, share false information, or harass other users.

## Disclaimers and Limitations

We strive to provide reliable service but cannot guarantee uninterrupted access to our platform or error-free operation of our systems. While we provide high-quality educational content, we cannot guarantee specific business outcomes or financial results.

To the maximum extent permitted by law, Start Solo shall not be liable for indirect, incidental, or consequential damages, loss of profits, revenue, or business opportunities, loss of data, or any damages exceeding the amount paid for our services.

## Indemnification and Privacy

You agree to indemnify and hold harmless Start Solo from any claims, damages, or expenses arising from your use of our services, violation of these Terms, or submission of inappropriate content. Our collection and use of your personal information is governed by our Privacy Policy.

## Governing Law and Dispute Resolution

These Terms shall be governed by the laws of India. Any disputes shall be resolved through good faith negotiation, mediation if negotiation fails, or binding arbitration as a last resort.

## Changes to Terms

We reserve the right to modify these Terms at any time. We will notify you of material changes by posting updated Terms on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated Terms.

## Severability

If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.

## Contact Information

If you have any questions about these Terms of Service, please contact us:

**Email**: legal@startsolo.in
**Address**: Start Solo, C2, Sector 1, Block C, Sector 1, Noida, Uttar Pradesh 201301
**Support**: Available through our website contact form

We are committed to addressing your concerns and questions promptly and professionally.`
    },
    refund: {
      title: "Refund Policy",
      lastUpdated: "January 20, 2025",
      content: `
# Refund Policy

**Last Updated: January 20, 2025**

At Start Solo, we want you to be completely satisfied with your investment in your learning journey. This refund policy outlines our commitment to fairness and transparency in all our offerings.

## Launchpad: The Start Solo Business Starter Course

We offer a 3-day money-back guarantee for our Launchpad course. You must request the refund within 3 days of purchase and provide detailed feedback about why the course didn't meet your expectations.

To request a refund, email us at hello@startsolo.in with your purchase details. We'll review your request within 2-3 business days and process approved refunds within 7-10 business days.

## Refund Exclusions and Additional Terms

Refunds are not available for course purchases made using special discount codes, bundle purchases, or after the guarantee period has expired. We reserve the right to deny refund requests that appear to be fraudulent or abusive.

Refunds will be issued to the original payment method used for purchase. Processing times may vary depending on your payment provider. Any bonus materials or downloads must be deleted upon refund, and we reserve the right to deny refund requests that don't meet our criteria.

## Contact Us

If you have any questions about our refund policy, please contact us at hello@startsolo.in. We're committed to ensuring your satisfaction and will work with you to resolve any concerns about our products or services.`
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
              
              <div className="prose max-w-none text-[color:var(--color-gray-900)] leading-relaxed">
                <div dangerouslySetInnerHTML={{ 
                  __html: selectedPolicy.content
                    .replace(/# (.*)/g, '<h1 class="text-3xl font-bold text-[color:var(--color-navy)] mb-6 mt-8 first:mt-0">$1</h1>')
                    .replace(/## (.*)/g, '<h2 class="text-xl font-semibold text-[color:var(--color-navy)] mt-6 mb-3">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-lg font-medium text-[color:var(--color-navy)] mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[color:var(--color-navy)]">$1</strong>')
                    .replace(/- (.*)/g, '<li class="ml-6 mb-2 list-disc">$1</li>')
                    .replace(/(\d+)\. (.*)/g, '<li class="ml-6 mb-2 list-decimal">$2</li>')
                    .split('\n\n').map(paragraph => {
                      if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<li')) {
                        return paragraph;
                      }
                      return `<p class="mb-4 leading-relaxed">${paragraph.trim()}</p>`;
                    }).join('')
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