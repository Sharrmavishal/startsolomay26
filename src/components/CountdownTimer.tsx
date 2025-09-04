import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [currentSessionDate, setCurrentSessionDate] = useState('');
  const [currentPaymentLink, setCurrentPaymentLink] = useState('');

  // Available session dates with their payment links
  const sessionDates = [
    {
      date: "March 22, 2025",
      time: "10:00 AM",
      paymentLink: "https://hub.startsolo.in/l/f2e5a74f31"
    },
    {
      date: "March 29, 2025",
      time: "11:00 AM",
      paymentLink: "https://hub.startsolo.in/l/55dc06e942"
    },
    {
      date: "April 5, 2025",
      time: "11:00 AM",
      paymentLink: "https://hub.startsolo.in/l/48e4cc0241"
    }
  ];

  useEffect(() => {
    const getCurrentSession = () => {
      const now = new Date().getTime();
      
      for (let i = 0; i < sessionDates.length; i++) {
        const sessionDateTime = new Date(`${sessionDates[i].date} ${sessionDates[i].time}`).getTime();
        if (now < sessionDateTime) {
          setCurrentSessionDate(sessionDates[i].date);
          setCurrentPaymentLink(sessionDates[i].paymentLink);
          return sessionDateTime;
        }
      }
      
      // If all dates have passed, use the last date
      const lastSession = sessionDates[sessionDates.length - 1];
      setCurrentSessionDate(lastSession.date);
      setCurrentPaymentLink(lastSession.paymentLink);
      return new Date(`${lastSession.date} ${lastSession.time}`).getTime();
    };

    const calculateTimeLeft = () => {
      const targetDate = getCurrentSession();
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        // If current session is over, recalculate for next session
        const newTargetDate = getCurrentSession();
        const newDifference = newTargetDate - now;
        
        setTimeLeft({
          days: Math.floor(newDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((newDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((newDifference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((newDifference % (1000 * 60)) / 1000)
        });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };
    
    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = currentPaymentLink;
  };

  return (
    <div className="bg-rich text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="flex items-center mb-4 md:mb-0 md:mr-6">
            <AlertCircle className="h-5 w-5 mr-2 text-primary-light animate-pulse" />
            <span className="font-medium">
              Hurry! Registration closes in {timeLeft.days} days for {currentSessionDate} session!
            </span>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="bg-rich-light text-primary-light rounded-md px-3 py-2 text-xl font-bold">{timeLeft.days}</div>
                <div className="text-xs mt-1">Days</div>
              </div>
              <div className="text-center">
                <div className="bg-rich-light text-primary-light rounded-md px-3 py-2 text-xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-rich-light text-primary-light rounded-md px-3 py-2 text-xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs mt-1">Minutes</div>
              </div>
              <div className="text-center">
                <div className="bg-rich-light text-primary-light rounded-md px-3 py-2 text-xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs mt-1">Seconds</div>
              </div>
            </div>
          </div>
          
          <a 
            href={currentPaymentLink}
            onClick={handleClick}
            className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold md:ml-6 mt-4 md:mt-0 relative overflow-hidden group hover:shadow-lg z-0"
            aria-label="Reserve your spot for the Solo Accelerator Session"
            data-tracking="countdown-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
              Reserve Your Spot <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;