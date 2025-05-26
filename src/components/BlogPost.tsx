import React from 'react';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPostProps {
  slug: string;
}

// This component would display a single blog post
const BlogPost: React.FC<BlogPostProps> = ({ slug }) => {
  // In a real implementation, this would fetch the specific blog post from your CMS
  const post = {
    title: "5 Myths About Solo Businesses That Are Holding You Back",
    date: "May 1, 2025",
    content: `
# 5 Myths About Solo Businesses That Are Holding You Back

When it comes to starting a solo business, there's no shortage of advice, opinions, and warnings. Unfortunately, much of what you hear isn't actually true—and these myths might be holding you back from taking the leap or scaling your existing business.

Let's debunk some of the most common misconceptions about solo entrepreneurship.

## Myth #1: You Need a Lot of Money to Start

Many aspiring entrepreneurs believe they need significant capital to launch a business. The reality? Many successful solo businesses start with minimal investment.

With digital tools, free resources, and lean startup methodologies, you can test your business idea without breaking the bank. Focus on validating your concept and generating revenue before investing heavily in infrastructure or marketing.

## Myth #2: You Need to Work 80+ Hours a Week

The image of the hustling entrepreneur working around the clock has been glorified in business culture. But sustainable success doesn't require burnout.

In fact, many successful solopreneurs work fewer hours than they did in their corporate jobs. The key is working smarter, not harder—focusing on high-impact activities, automating repetitive tasks, and setting clear boundaries.

## Myth #3: You Need to Be an Expert in Everything

Feeling like you need to master marketing, sales, accounting, legal matters, and your actual service offering before starting? This perfectionism keeps many potential entrepreneurs stuck.

The truth is that you only need to be good at your core offering. For everything else, you can learn as you go, use templates and tools, or outsource when necessary. Start with what you know, and build from there.

## Myth #4: Solo Businesses Can't Scale

Many believe that solo businesses are inherently limited in their growth potential. This couldn't be further from the truth.

Solo doesn't mean small. With the right systems, automation, and occasional contractors or partners, solo businesses can generate significant revenue without adding permanent staff. Many seven-figure businesses are run by a single person with the right leverage points.

## Myth #5: You Need a Unique, Revolutionary Idea

Waiting for that completely original, never-been-done-before business idea? You might be waiting forever.

Most successful businesses aren't based on revolutionary concepts but on better execution, improved customer experience, or serving a specific niche more effectively. Your unique perspective and approach are often differentiation enough.

## Moving Forward: What You Actually Need

Instead of getting caught up in these myths, focus on what truly matters for solo business success:

- **A clear value proposition**: Know exactly how you help your clients or customers
- **A validated market**: Ensure people are willing to pay for your solution
- **Simple systems**: Create repeatable processes that save you time
- **Consistent action**: Small steps taken regularly beat sporadic massive efforts
- **Community support**: Connect with other solopreneurs for advice and encouragement

Remember, the perfect time to start is now. Don't let these myths keep you from building the business and life you want.
    `,
    author: "Diksha Sethi",
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tags: ["solo business", "entrepreneurship", "myths", "mindset"]
  };
  
  // Function to convert markdown to HTML (simplified version)
  const renderMarkdown = (markdown: string) => {
    // In a real implementation, you would use a proper markdown parser
    // This is just a simplified example
    return { __html: markdown
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .split('\n\n').join('<br><br>')
    };
  };
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <a 
            href="/blog" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to all posts
          </a>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="h-80 overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex items-center text-gray-500 mb-8">
                <div className="flex items-center mr-6">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{post.author}</span>
                </div>
              </div>
              
              <div className="prose max-w-none" dangerouslySetInnerHTML={renderMarkdown(post.content)} />
              
              <div className="mt-12 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <span className="text-gray-700 mr-2">Tags:</span>
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">Share:</span>
                    <button className="text-gray-500 hover:text-primary mx-1">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-primary text-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Solo Journey?</h2>
            <p className="mb-6">
              Join our 90-minute Solo Accelerator Session and discover the proven framework that has helped 2,800+ solopreneurs build successful businesses.
            </p>
            <a 
              href="#webinar-dates" 
              className="inline-block bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-100 transition font-medium"
            >
              Reserve Your Spot Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;