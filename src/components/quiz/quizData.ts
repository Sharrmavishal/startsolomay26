import { QuizQuestion, QuizOption, QuizAnswer, QuizResult } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'work-state',
    text: "What best describes your current work state?",
    options: [
      { text: "I'm between things and exploring options", points: 5 },
      { text: "I have a full-time job but think about a solo project often", points: 10 },
      { text: "I freelance or consult occasionally", points: 15 },
      { text: "I run my own thing, part-time or full-time", points: 20 }
    ]
  },
  {
    id: 'idea-clarity',
    text: "How clear are you on the idea you'd like to build?",
    options: [
      { text: "I'm still searching for a direction", points: 5 },
      { text: "I have 2-3 vague ideas but nothing solid", points: 10 },
      { text: "I've shortlisted a real idea but haven't tested it", points: 15 },
      { text: "I have a validated idea or even a few paying clients", points: 20 },
      { text: "My idea is working and I want to grow it", points: 25 }
    ]
  },
  {
    id: 'payment-history',
    text: "When was the last time someone paid you for your skill/service?",
    options: [
      { text: "Never", points: 0 },
      { text: "Once or twice, informally", points: 5 },
      { text: "Recently, but not regularly", points: 10 },
      { text: "I get paid clients every month", points: 15 }
    ]
  },
  {
    id: 'biggest-barrier',
    text: "Which of these feels like your biggest barrier right now?",
    options: [
      { text: "I don't know where or how to start", points: 0 },
      { text: "I'm scared to put my idea out", points: 5 },
      { text: "I don't get consistent clients", points: 10 },
      { text: "I want to scale and systemize", points: 15 },
      { text: "I want to bounce back from a break", points: 5 }
    ]
  },
  {
    id: 'public-promotion',
    text: "Have you ever pitched or promoted your skill publicly (e.g., online or in person)?",
    options: [
      { text: "No, I don't feel ready", points: 0 },
      { text: "Once or twice", points: 5 },
      { text: "I've posted/talked about it a few times", points: 10 },
      { text: "I promote weekly with clear positioning", points: 15 }
    ]
  },
  {
    id: 'client-pipeline',
    text: "How would you describe your client pipeline?",
    options: [
      { text: "I have none", points: 0 },
      { text: "Mostly friends or referrals", points: 5 },
      { text: "I've DM'd/emailed a few prospects", points: 10 },
      { text: "I have a clear outreach process that brings leads", points: 15 }
    ]
  },
  {
    id: 'pricing-comfort',
    text: "What is your current level of comfort with pricing?",
    options: [
      { text: "I've never charged before", points: 0 },
      { text: "I undercharge or feel unsure asking", points: 5 },
      { text: "I have a basic idea but no packages", points: 10 },
      { text: "I charge confidently and have 2–3 pricing tiers", points: 15 }
    ]
  },
  {
    id: 'restart',
    text: "Have you ever restarted work after a break or transition?",
    options: [
      { text: "Yes, I've taken a long break and want to start again", points: 0 },
      { text: "No, I've been working consistently", points: 0 }
    ]
  }
];

export const quizResults: QuizResult[] = [
  {
    stage: "Stage 0: Still Thinking",
    persona: "\"Pre-Idea Explorer\"",
    summary: "You're at the exciting stage of exploring possibilities. Let's turn your potential into a clear direction with expert guidance.",
    description: "This is the perfect time to explore and validate ideas with structured guidance.",
    helpText: "🌱 What can help you right now: Get idea clarity with our 2-day micro-lessons and personal mentor guidance.",
    courses: [
      {
        name: "Idea Spark + Mentorship",
        price: 999,
        originalPrice: 1199,
        description: "Spark your first viable business idea with 2-day WhatsApp video micro-lessons + 1:1 mentor call",
        curriculum: [
          "Day 1: Identify skills, passions, and natural strengths",
          "Day 2: Match your skill with a market need using our Idea Validation Framework",
          "1:1 mentor call to validate and prioritise your best idea",
          "Bonus: \"From Confusion to Clarity\" Roadmap (PDF)"
        ],
        cta: "Start With Spark + Mentorship",
        ctaUrl: "https://hub.startsolo.in/l/26c5108365"
      }
    ]
  },
  {
    stage: "Stage 1: Curious",
    persona: "\"I have an idea but...\"",
    summary: "You've got an idea brewing - now let's turn it into a real income stream with a structured approach.",
    description: "This is the perfect time to validate and structure your idea into an offer that sells.",
    helpText: "🚀 What can help you right now: Transform your idea into an income-ready offer with our 5-day sprint and mentor guidance.",
    courses: [
      {
        name: "Idea to Income + Mentorship",
        price: 1399,
        originalPrice: 1599,
        description: "Convert your idea into an income-ready offer with our 5-day WhatsApp video sprint + 1:1 mentor call",
        curriculum: [
          "Day 1: Define your niche and ideal client",
          "Day 2: Create your first offer (problem, promise, price)",
          "Day 3: Position your offer to communicate value",
          "Day 4: Map out your first-client strategy",
          "Day 5: Prepare to deliver your offer confidently",
          "1:1 mentor call to refine pitch, audience, and pricing",
          "Bonus: Client Acquisition Toolkit"
        ],
        cta: "Join the Sprint + Mentor Boost",
        ctaUrl: "https://hub.startsolo.in/l/566f67ea6e"
      }
    ]
  },
  {
    stage: "Stage 2: Builder",
    persona: "\"I want to build a memorable brand\"",
    summary: "You're ready to build a strong brand and consistent client base. Let's create systems that attract and convert.",
    description: "This is the time to build a brand that sticks, sells, and scales.",
    helpText: "🔧 What can help you right now: Create a brand that converts with our complete brand building system.",
    courses: [
      {
        name: "Brand Builder Sprint (Complete Edition)",
        price: 2999,
        originalPrice: 3599,
        description: "Build a brand that sticks, sells, and scales with our 4-day WhatsApp video course + 2 Live Mentor Sessions",
        curriculum: [
          "Day 1: Brand Pillars → Niche, messaging, voice, and persona",
          "Day 2: Content Framework → Plug-and-play content system",
          "Day 3: Client Conversion System → Set up funnel & messaging",
          "Day 4: Trust Loops & Growth Hacks → Proof and visibility",
          "2 LIVE mentor sessions for content and pitch refinement",
          "Custom 90-Day Brand Roadmap"
        ],
        cta: "Build your brand authority",
        ctaUrl: "https://hub.startsolo.in/l/b055d7df8f"
      }
    ]
  },
  {
    stage: "Stage 3: Scaler",
    persona: "\"I want to scale solo\"",
    summary: "You've got something that works - now let's help you scale without the chaos or burnout.",
    description: "It's time to systematize and scale your solo business intelligently.",
    helpText: "🔄 What can help you right now: Create systems that scale your impact and income without burning out.",
    courses: [
      {
        name: "Solo Scaler + Mentorship",
        price: 3499,
        originalPrice: 3999,
        description: "Systematise and scale your solo business with our 5-day WhatsApp course + 1:1 mentor call",
        curriculum: [
          "Day 1: Audit current systems & income blockers",
          "Day 2: Implement automation tools (Calendly, Notion, CRM)",
          "Day 3: Create a referral and repeat business engine",
          "Day 4: Design scalable offers (group coaching, courses, retainers)",
          "Day 5: Troubleshooting session- LIVE",
          "1:1 mentor call to create your custom scale plan"
        ],
        cta: "Start Scaling Smart",
        ctaUrl: "https://hub.startsolo.in/l/200500053e"
      }
    ]
  },
  {
    stage: "Stage 4: Relaunch",
    persona: "\"I want to make a comeback\"",
    summary: "You're ready to restart with confidence. Let's turn your experience into a strong comeback.",
    description: "This is your time to relaunch your career or venture after a break - with clarity and support.",
    helpText: "💫 What can help you right now: Get back in the game with our structured relaunch program and dedicated mentor support.",
    courses: [
      {
        name: "Career Re-launcher + Mentorship",
        price: 4499,
        originalPrice: 4999,
        description: "Relaunch your career or venture with our 5-day WhatsApp journey + 2 LIVE mentor calls",
        curriculum: [
          "Day 1: Rediscover monetizable skills",
          "Day 2: Rebuild confidence & gather proof",
          "Day 3: Explore flexible and pay-worthy options",
          "Day 4: Positioning and pricing post-break",
          "Day 5: Create your comeback roadmap",
          "2 LIVE mentor calls for confidence and client attraction"
        ],
        cta: "Rebuild your comeback story",
        ctaUrl: "https://hub.startsolo.in/l/bf5a9a4de1"
      }
    ]
  }
];

export const getQuizResult = (score: number, answers: Record<string, QuizAnswer>): QuizResult => {
  const normalizedScore = Math.round((score / 100) * 100);
  
  const restartAnswer = answers['restart'];
  const hasSelectedRestart = restartAnswer?.selectedIndex === 0;
  
  console.log('Quiz Debug:', {
    rawScore: score,
    normalizedScore,
    answers,
    restart: {
      answer: restartAnswer,
      selectedIndex: restartAnswer?.selectedIndex,
      hasSelectedRestart
    }
  });
  
  if (hasSelectedRestart) {
    return {
      ...quizResults[4],
      description: "You've indicated you're returning after a break. That changes everything — and we've got a path just for that. Whether you're starting fresh or picking up where you left off, it's about building forward with clarity.",
      summary: "You're on a comeback journey — and that deserves special attention.",
      helpText: `Your overall score is ${normalizedScore}%. We recommend focusing on your relaunch journey.`
    };
  }
  
  if (normalizedScore >= 80) {
    return quizResults[3];
  }
  if (normalizedScore >= 60) {
    return quizResults[2];
  }
  if (normalizedScore >= 35) {
    return quizResults[1];
  }
  return quizResults[0];
};