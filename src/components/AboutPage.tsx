import React, { useState } from 'react';
import { ArrowLeft, Mail, MapPin, MessageCircle, BookOpen, Users, Award, Briefcase, ChevronRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-brand-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center text-brand-yellow hover:text-brand-yellow-dark mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>
          
          <div className="card-brand shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl heading-brand mb-4">About Start Solo</h1>
              <p className="text-xl text-brand-steel mb-8">
                Helping solopreneurs build profitable businesses without burnout
              </p>

              {/* Tab Navigation */}
              <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'story', label: 'Our Story' },
                  { id: 'mission', label: 'Mission' },
                  { id: 'approach', label: 'Our Approach' },
                  { id: 'values', label: 'Values' },
                  { id: 'team', label: 'Team' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'bg-brand-yellow text-brand-white'
                        : 'bg-brand-gray-50 text-brand-steel hover:bg-brand-gray-50-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <p className="text-brand-steel">
                    Start Solo was founded with a simple mission: to help aspiring entrepreneurs build profitable solo businesses without the burnout that often comes with it.
                  </p>
                  
                  <div className="bg-brand-yellow-light/10 p-8 rounded-lg border border-brand-yellow/20">
                    <h3 className="text-xl font-bold text-brand-navy mb-4">Unlock Your Potential with Our Comprehensive Support</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-brand-yellow/10 p-2 rounded-lg mr-3">
                            <BookOpen className="h-5 w-5 text-brand-yellow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy">Bootcamps</h3>
                            <p className="text-brand-steel">Expert-led on-ground training sessions - <a href="/solosprint-bootcamp" className="text-brand-yellow hover:text-brand-yellow-dark">learn more</a></p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-brand-yellow/10 p-2 rounded-lg mr-3">
                            <Users className="h-4 w-4 text-brand-yellow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy">Community Forum</h3>
                            <p className="text-brand-steel">Connect with peers and experts</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-brand-yellow/10 p-2 rounded-lg mr-3">
                            <Award className="h-4 w-4 text-brand-yellow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy">Mentorships</h3>
                            <p className="text-brand-steel">Personalized guidance from industry experts</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-brand-yellow/10 p-2 rounded-lg mr-3">
                            <Briefcase className="h-5 w-5 text-brand-yellow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy">Resource Library</h3>
                            <p className="text-brand-steel">Access to a wealth of learning materials</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-brand-yellow/10 p-2 rounded-lg mr-3">
                            <ChevronRight className="h-5 w-5 text-brand-yellow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy">Exclusive Tools</h3>
                            <p className="text-brand-steel">Get access to specialized complementary tools for success</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-brand-yellow/10 p-2 rounded-lg mr-3">
                            <MessageCircle className="h-5 w-5 text-brand-yellow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy">Marketplace</h3>
                            <p className="text-brand-steel">Discover opportunities and resources, build your network</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Story Tab */}
              {activeTab === 'story' && (
                <div className="space-y-6">
                  <p className="text-brand-steel">
                    After years in the corporate world, founder Diksha Sethi discovered a better way to work—one that provides both financial freedom and flexibility.
                  </p>
                  <p className="text-brand-steel">
                    Her journey involved numerous mistakes, wasted resources, and near failures. However, through persistence, she launched Start Solo to bring together her years of experience as a trainer and mentor working with diverse audiences.
                  </p>
                  
                  <div className="card-brand p-6 mt-8">
                    <h3 className="font-bold text-brand-navy mb-4">Her Journey Highlights</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-brand-yellow text-brand-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                          1
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-brand-navy">Corporate Experience</h4>
                          <p className="text-brand-steel">Led branding for Mastercard, Ford, Qualcomm, IndiGo</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-brand-yellow text-brand-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                          2
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-brand-navy">Training Excellence</h4>
                          <p className="text-brand-steel">20,000+ high-impact training hours delivered</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-brand-yellow text-brand-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                          3
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-brand-navy">Community Growth</h4>
                          <p className="text-brand-steel">Built a thriving community and network of motivated professionals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mission Tab */}
              {activeTab === 'mission' && (
                <div className="space-y-8">
                  <div className="bg-brand-yellow/10 p-6 rounded-lg border border-brand-yellow/20">
                    <h3 className="text-xl font-bold text-brand-navy mb-3">Our Mission</h3>
                    <p className="text-brand-steel">
                      To empower 100,00,00 professionals to build profitable solo businesses with financial freedom and work-life balance by 2030.
                    </p>
                  </div>
                  
                  <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                    <h3 className="font-bold text-brand-navy mb-3">Goals</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                        <span className="text-brand-steel">Empower professionals to become successful solopreneurs</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                        <span className="text-brand-steel">Create a supportive community of like-minded individuals</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                        <span className="text-brand-steel">Promote sustainable business practices</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Approach Tab */}
              {activeTab === 'approach' && (
                <div className="space-y-6">
                  <p className="text-brand-steel">
                    We believe that building a solo business shouldn't be complicated. Our approach is based on proven principles that work.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-4">Simplicity</h3>
                      <p className="text-brand-steel">
                        Cutting through the noise and focusing on what works
                      </p>
                    </div>
                    
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-4">Sustainability</h3>
                      <p className="text-brand-steel">
                        Building systems to grow without burnout
                      </p>
                    </div>
                    
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-4">Community</h3>
                      <p className="text-brand-steel">
                        Providing support so solopreneurs never feel alone
                      </p>
                    </div>
                    
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-4">Results-Driven</h3>
                      <p className="text-brand-steel">
                        Focusing on practical strategies that deliver real results
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Values Tab */}
              {activeTab === 'values' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-3">Transparency</h3>
                      <p className="text-brand-steel">
                        Honest about what works and what doesn't
                      </p>
                    </div>
                    
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-3">Practicality</h3>
                      <p className="text-brand-steel">
                        Focused on actionable strategies, not just theory
                      </p>
                    </div>
                    
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-3">Integrity</h3>
                      <p className="text-brand-steel">
                        Only recommending what we truly believe in
                      </p>
                    </div>
                    
                    <div className="bg-brand-gray-50 p-6 rounded-lg border border-brand-gray-200">
                      <h3 className="font-bold text-brand-navy mb-3">Empowerment</h3>
                      <p className="text-brand-steel">
                        Providing tools for success on your own terms
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-brand-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-[300px] overflow-hidden">
                        <img 
                          src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361534/Diksha_800x600_tztawn.png"
                          alt="Diksha Sethi"
                          className="w-full h-full object-cover object-[center_25%]"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-brand-navy mb-1">Diksha Sethi</h3>
                        <p className="text-brand-yellow font-medium mb-3">Founder & Lead Trainer</p>
                        <ul className="space-y-2 text-brand-steel">
                          <li className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                            <span>Communications specialist with 18+ years of experience</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                            <span>Led branding for Mastercard, Ford, Qualcomm, Indigo</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                            <span>20,000+ training hours clocked and counting</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-brand-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-[300px] overflow-hidden">
                        <img 
                          src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361539/vishal_800x600_uatsxz.png"
                          alt="Vishal Sharma"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-brand-navy mb-1">Vishal Sharma</h3>
                        <p className="text-brand-yellow font-medium mb-3">AI Solopreneur & Marketing Strategist</p>
                        <ul className="space-y-2 text-brand-steel">
                          <li className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                            <span>Digital marketing expert with two decades of proven brand marketing experience</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                            <span>Expertise in business strategy and technology solutions</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-brand-yellow mr-2 mt-0.5" />
                            <span>Specializes in scaling businesses and improving operational efficiency</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-yellow/10 p-8 rounded-lg border border-brand-yellow/20 text-center">
                    <h3 className="text-xl font-bold text-brand-navy mb-4">Join Our Journey</h3>
                    <p className="text-brand-steel mb-6">
                      We aim to redefine success for solopreneurs. Whether starting out or scaling up, join our community.
                    </p>
                    <a 
                      href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
                      className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Join WhatsApp Hub
                      </span>
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-brand-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-brand-yellow mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-brand-navy mb-1">Office Address</h4>
                      <p className="text-brand-steel">
                        C2, Sector 1, Block C<br />
                        Sector 1, Noida<br />
                        Uttar Pradesh 201301
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-brand-yellow mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-brand-navy mb-1">Email</h4>
                      <a href="mailto:hello@startsolo.in" className="text-brand-yellow hover:text-brand-yellow-dark transition">
                        hello@startsolo.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;