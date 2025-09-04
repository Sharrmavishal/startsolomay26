import React, { useState } from 'react';
import { Calendar, Clock, Users, ArrowRight, Check, Shield, AlertCircle } from 'lucide-react';
import { useContent } from './ContentProvider';
import { smoothScrollTo } from '../utils/scrollUtils';

const WebinarCalendar = () => {
  const { general } = useContent();
  const [selectedDateId, setSelectedDateId] = useState('march-22');

  // Available session dates
  const availableDates = [
    {
      id: 'march-22',
      date: 'March 22, 2025',
      day: 'Saturday',
      time: '10:00 AM',
      timeZone: 'IST',
      spotsLeft: 7,
      paymentLink: 'https://hub.startsolo.in/l/f2e5a74f31',
      fillingFast: true
    },
    {
      id: 'march-29',
      date: 'March 29, 2025',
      day: 'Saturday',
      time: '10:30 AM',
      timeZone: 'IST',
      spotsLeft: 13,
      paymentLink: 'https://hub.startsolo.in/l/55dc06e942',
      fillingFast: false
    },
    {
      id: 'april-5',
      date: 'April 5, 2025',
      day: 'Saturday',
      time: '10:00 AM',
      timeZone: 'IST',
      spotsLeft: 15,
      paymentLink: 'https://hub.startsolo.in/l/48e4cc0241',
      fillingFast: false
    }
  ];

  const selectedDate = availableDates.find(date => date.id === selectedDateId);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
  };

  return (
    <section id="webinar-dates" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-light/20 text-primary-dark px-4 py-1 rounded-full mb-3 font-medium">
            RESERVE YOUR SPOT
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
            Choose Your Solo Accelerator Session Date
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a date and time that works best for your schedule
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Date Selection - Takes 3 columns */}
                <div className="md:col-span-3 space-y-3">
                  <h3 className="font-bold text-brand-navy mb-4">Available Dates</h3>
                  {availableDates.map((date) => (
                    <button
                      key={date.id}
                      onClick={() => setSelectedDateId(date.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                        selectedDateId === date.id 
                          ? 'bg-primary-light/10 border-primary' 
                          : 'bg-gray-50 border-gray-200 hover:border-primary-light'
                      } border`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-brand-navy">{date.day}, {date.date}</div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {date.time} {date.timeZone}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedDateId === date.id && (
                            <Check className="h-4 w-4 text-primary mr-2" />
                          )}
                          <div className="text-sm flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span className={date.spotsLeft < 10 ? "text-highlight font-medium" : "text-gray-500"}>
                              {date.spotsLeft} spots
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Registration Card - Takes 2 columns */}
                <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  {selectedDate && (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-brand-navy">₹99</div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                          <span className="line-through text-gray-400 mr-2">₹999</span>
                          <span className="bg-highlight/10 text-highlight px-2 py-0.5 rounded-full text-xs">
                            90% OFF
                          </span>
                        </div>
                      </div>

                      <a 
                        href={selectedDate.paymentLink}
                        className="block w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center mb-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Reserve Your Spot <ArrowRight className="ml-2 h-5 w-5" />
                      </a>

                      <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                        <Shield className="h-4 w-4 mr-1 text-tertiary" />
                        <span>100% Money-Back Guarantee</span>
                      </div>

                      {selectedDate.fillingFast && (
                        <div className="bg-highlight/10 p-2 rounded-lg flex items-center text-sm">
                          <AlertCircle className="h-4 w-4 text-highlight mr-2 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium">Hurry!</span> Only {selectedDate.spotsLeft} spots left for this session
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarCalendar;