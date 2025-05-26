import React from 'react';
import { MessageCircle, Users, FileText, Video, Calendar, ArrowRight, Bell } from 'lucide-react';
import { useContent } from './ContentProvider';
import { smoothScrollTo } from '../utils/scrollUtils';

const WhatsAppHubSection = () => {
  const { whatsappHub } = useContent();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
  };

  const features = [
    {
      icon: "Users",
      title: "Community Support",
      description: "Connect with fellow solopreneurs"
    },
    {
      icon: "Bell",
      title: "Event Updates",
      description: "Get notified about upcoming sessions"
    },
    {
      icon: "Video",
      title: "Expert Sessions",
      description: "Access exclusive speaker content"
    },
    {
      icon: "FileText",
      title: "Free Resources",
      description: "Templates, guides & tools"
    }
  ];

  // Function to render the correct icon component
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="h-5 w-5 text-white" />;
      case 'Bell': return <Bell className="h-5 w-5 text-white" />;
      case 'Video': return <Video className="h-5 w-5 text-white" />;
      case 'FileText': return <FileText className="h-5 w-5 text-white" />;
      default: return <MessageCircle className="h-5 w-5 text-white" />;
    }
  };

  return (
    <section id="whatsapp-hub" className="py-12 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full mb-4 font-medium">
            EXCLUSIVE COMMUNITY ACCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Start Solo Hub on WhatsApp</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with like-minded solopreneurs and get exclusive resources
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="md:flex">
              {/* Left Section */}
              <div className="md:w-1/2 bg-[#25D366] text-white p-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  <h3 className="text-xl font-bold">Start Solo Hub</h3>
                </div>
                <p className="text-white/90 mb-6">
                  Join our thriving WhatsApp community for support, resources, and growth opportunities.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        {renderIcon(feature.icon)}
                        <h4 className="ml-2 font-bold text-sm">{feature.title}</h4>
                      </div>
                      <p className="text-white/80 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Section */}
              <div className="md:w-1/2 p-6 bg-gray-50">
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Join Now - It's Free!</h4>
                  <p className="text-gray-600 text-sm">
                    Get instant access to our community and resources. All session participants and course students are automatically invited to join.
                  </p>
                </div>

                <div className="space-y-3">
                  <a 
                    href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-4 py-3 rounded-md hover:bg-[#128C7E] transition flex items-center justify-center w-full"
                    data-tracking="whatsapp-hub-join-button"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Join WhatsApp Hub
                  </a>
                  <a 
                    href="#webinar-dates"
                    onClick={handleClick}
                    className="bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-dark transition flex items-center justify-center w-full"
                    data-tracking="whatsapp-hub-session-button"
                  >
                    Register for Session <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppHubSection;