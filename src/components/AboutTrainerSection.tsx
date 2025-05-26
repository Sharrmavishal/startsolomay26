import React, { useEffect, useState, useRef } from 'react';
import { Award, BookOpen, Users, Briefcase, ArrowRight } from 'lucide-react';

const AboutTrainerSection = () => {
  const cloudinaryUrl = "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741333944/Meet_The_Trainer_800x800_faq7bw.png";
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Generate a unique timestamped URL to force fresh loading
    const timestampedUrl = `${cloudinaryUrl}?t=${new Date().getTime()}-${Math.random()}`;

    console.log('Updating imageSrc to:', timestampedUrl);
    
    // Directly update the image src in the DOM
    if (imgRef.current) {
      imgRef.current.src = timestampedUrl;
    }
    setKey(prevKey => prevKey + 1); // Force React to re-mount the image
  }, []);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary-light/20 text-primary-dark px-4 py-1 rounded-full mb-4 font-medium">
            LEARN FROM THE BEST
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Your Trainer & Expert Speakers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from industry leaders, innovators, and challengers who bring real-world expertise to help you launch, grow, and thrive as a solopreneur.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 relative">
                <img
                  key={key} // Forces re-mounting of the image
                  ref={imgRef}
                  src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" // Temporary 1x1 transparent placeholder
                  alt="Diksha Sethi - Communications Specialist"
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '1/1' }}
                  loading="eager"
                />
              </div>
              <div className="md:w-3/5 p-8 md:p-10">
                <div className="inline-block bg-primary-light/20 text-primary-dark px-3 py-1 rounded-full mb-3 text-sm font-medium">
                  YOUR LEAD TRAINER
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Diksha Sethi</h3>
                <p className="text-primary font-medium mb-4">Founder, Start Solo</p>

                <p className="text-gray-700 mb-6">
                  Meet Diksha Sethi—Communications Specialist, brand whisperer, and solopreneur champion. With 18 years of experience leading brands like Mastercard, Ford, IndiGo, SpiceJet, and Qualcomm, she's navigated boardrooms, crisis war rooms, and major brand launches.
                </p>

                <p className="text-gray-700 mb-6">
                  Corporate life, however, couldn't contain her curiosity. She built <strong>Different Strokes</strong>, an award-winning podcast, became a certified corporate trainer coaching 2,800+ professionals, and deepened her expertise as an NLP and Gestalt practitioner, counseling therapist, and mental health advocate.
                </p>

                <p className="text-gray-700 mb-6">
                  Now, as Co-founder of <strong>Start Solo</strong>, she's on a mission to help solopreneurs <strong>learn, launch, and grow—minus the fluff, plus all the fun.</strong> If you're ready to bet on yourself, Diksha's got your back.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">18+ years of proven agency leadership expertise</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">Empowered 2,800+ solopreneurs</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">High impact 20,000 training hours clocked and counting</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">Award-winning podcaster & NLP practitioner</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                  <p className="italic text-gray-700 mb-3">
                    "I believe in our motto 'Start Solo—but not alone.' My mission is to help people look beyond the 9-to-5 and explore their passion leading to financial freedom. Start Solo is that community that incubates, mentors, and supports solopreneurs all through the way."
                  </p>
                  <p className="font-medium text-gray-900">— Diksha Sethi</p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="https://hub.startsolo.in/l/f2e5a74f31" 
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
                  >
                    Register for Session <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a 
                    href="#redirect to the course curriculum section" 
                    className="inline-flex items-center border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary-light/10 transition"
                  >
                    View Course Curriculum <ArrowRight className="ml-2 h-5 w-5" />
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

export default AboutTrainerSection;
