import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Course {
  title: string;
  subtitle?: string;
  hook: string;
  summary: string;
  price: number;
  originalPrice?: number;
  priceNote?: string;
  curriculum?: string[];
  ctaText: string;
  ctaUrl: string;
}

interface Zone {
  id: string;
  name: string;
  description: string;
  courses: Course[];
}

interface Props {
  zone: Zone;
  id: string;
}

const CourseZone: React.FC<Props> = ({ zone, id }) => {
  // Extract level number and name
  const levelMatch = zone.name.match(/Stage (\d+):\s*(.*)/);
  const hasLevel = levelMatch !== null;
  const levelNumber = hasLevel ? levelMatch[1] : '';
  const mainTitle = hasLevel ? levelMatch[2] : zone.name;

  return (
    <section id={id} data-section={id} className="scroll-mt-32">
      <div className="text-center mb-12">
        {hasLevel ? (
          <div className="mb-4">
            <span className="text-sm font-medium text-primary">Stage {levelNumber}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{mainTitle}</h2>
          </div>
        ) : (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{zone.name}</h2>
        )}
        <p className="text-xl text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
          {zone.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {zone.courses.map((course, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                  {course.subtitle && (
                    <span className="block text-lg text-primary mt-1">
                      {course.subtitle}
                    </span>
                  )}
                </h3>
                <p className="text-primary font-medium mb-2">{course.hook}</p>
                <p className="text-gray-600 mb-4">{course.summary}</p>
                
                {course.curriculum && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <ul className="space-y-2">
                      {course.curriculum.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{course.price.toLocaleString()}
                      </span>
                      {course.originalPrice && (
                        <span className="text-base text-gray-500 line-through decoration-2">
                          ₹{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <span className="text-sm text-highlight font-medium mt-1">
                        Save ₹{(course.originalPrice - course.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <a
                    href={course.ctaUrl}
                    className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {course.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
                {course.priceNote && (
                  <p className="text-sm text-gray-600 mt-2">{course.priceNote}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseZone;