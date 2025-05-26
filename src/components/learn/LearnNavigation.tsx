import React from 'react';
import { smoothScrollTo } from '../../utils/scrollUtils';

interface Zone {
  id: string;
  name: string;
}

interface Props {
  zones: Zone[];
  activeSection: string;
}

const LearnNavigation: React.FC<Props> = ({ zones, activeSection }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    smoothScrollTo(id);
  };

  // Function to get simplified name for navigation
  const getNavName = (zoneName: string): string => {
    if (zoneName.includes('1:1 Consult')) return 'Work with a Mentor';
    if (zoneName.includes('Add-on')) return 'Add-ons';
    
    // Extract the main title for zones with levels
    const levelMatch = zoneName.match(/LEVEL \d+:\s*(.*?)\s*[-–]/);
    if (levelMatch) return levelMatch[1].trim();
    
    return zoneName;
  };

  return (
    <nav className="sticky top-20 z-30 bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 md:space-x-4 overflow-x-auto">
          {zones.map((zone) => (
            <a
              key={zone.id}
              href={`#${zone.id}`}
              onClick={(e) => handleClick(e, zone.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeSection === zone.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getNavName(zone.name)}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default LearnNavigation;