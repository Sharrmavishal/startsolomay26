import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

// This component would display a list of blog posts
const BlogList: React.FC = () => {
  // In a real implementation, this would fetch blog posts from your CMS
  const blogPosts = [
    {
      id: 1,
      title: "5 Myths About Solo Businesses That Are Holding You Back",
      date: "May 1, 2025",
      excerpt: "Discover the common misconceptions about solo entrepreneurship that might be preventing you from starting or scaling your business.",
      author: "Diksha Sethi",
      slug: "solo-business-myths",
      featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      title: "3 Client Acquisition Strategies That Actually Work for Solopreneurs",
      date: "May 10, 2025",
      excerpt: "Learn three proven client acquisition strategies that are particularly effective for solo entrepreneurs with limited time and resources.",
      author: "Diksha Sethi",
      slug: "client-acquisition-strategies",
      featuredImage: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      title: "How to Create Systems That Scale Your Solo Business",
      date: "May 15, 2025",
      excerpt: "Discover how to build effective systems that allow your solo business to grow without requiring more of your time.",
      author: "Diksha Sethi",
      slug: "systems-for-scaling",
      featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    }
  ];
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, strategies, and practical advice for solopreneurs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                
                <a 
                  href={`/blog/${post.slug}`} 
                  className="text-primary font-medium flex items-center hover:text-primary-dark transition"
                >
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#webinar-dates" 
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition inline-flex items-center"
          >
            Join Our Solo Accelerator Session <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogList;