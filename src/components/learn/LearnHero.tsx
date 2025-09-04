import React from 'react';

interface HeroContent {
  title: string;
  subtitle: string;
}

interface Props {
  content: HeroContent;
}

const LearnHero: React.FC<Props> = ({ content }) => {
  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
      {/* Hero Image */}
      <img
        src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1743180328/Learn_page_content_ewd61z.png"
        alt="Start Solo Learning Journey"
        className="w-full h-full object-cover"
      />
      
      {/* Text Overlay */}
      <div className="absolute inset-0 bg-brand-gradient-learnhero flex items-center justify-center text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-brand-white/90">
            {content.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnHero;