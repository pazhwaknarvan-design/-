import React from 'react';

interface KaraLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  showSubtitle?: boolean;
}

export default function KaraLogo({
  className = '',
  size = 'md',
  showText = true,
  showSubtitle = true,
}: KaraLogoProps) {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    custom: '',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* SVG Icon */}
      <svg
        viewBox="0 0 200 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} select-none`}
      >
        <defs>
          {/* Main Gold Gradient */}
          <linearGradient id="goldGradient" x1="0" y1="0" x2="200" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFECA6" />
            <stop offset="25%" stopColor="#E5B85A" />
            <stop offset="50%" stopColor="#C69233" />
            <stop offset="75%" stopColor="#E5B85A" />
            <stop offset="100%" stopColor="#9B6E18" />
          </linearGradient>

          {/* Hair Highlight Gradient */}
          <linearGradient id="hairHighlight" x1="100" y1="50" x2="160" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFECA6" />
            <stop offset="50%" stopColor="#DCA945" />
            <stop offset="100%" stopColor="#7B500C" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. THE CROWN (تاج طلایی) */}
        <g id="crown" transform="translate(0, -5)">
          {/* Base of the crown */}
          <path
            d="M80 50 C90 52 110 52 120 50 L123 46 C113 48 87 48 77 46 Z"
            fill="url(#goldGradient)"
          />
          {/* Main Crown Spikes */}
          <path
            d="M 77 46 
               L 70 33 
               L 83 38 
               L 89 22 
               L 97 34 
               L 100 12 
               L 103 34 
               L 111 22 
               L 117 38 
               L 130 33 
               L 123 46 
               C 113 48 87 48 77 46 Z"
            fill="url(#goldGradient)"
          />
          {/* Crown Jewels (small circles on peak tips) */}
          <circle cx="70" cy="31" r="1.5" fill="#FFECA6" />
          <circle cx="89" cy="20" r="2" fill="#FFECA6" />
          <circle cx="100" cy="10" r="2.5" fill="#FFECA6" />
          <circle cx="111" cy="20" r="2" fill="#FFECA6" />
          <circle cx="130" cy="31" r="1.5" fill="#FFECA6" />
        </g>

        {/* 2. THE 'K' LETTER WITH INTEGRATED LADY PROFILE */}
        <g id="letter-k-and-lady">
          {/* Vertical stem of 'K' with beautiful serif brackets */}
          {/* Left vertical bar */}
          <path
            d="M 45 60 L 75 60 L 70 65 L 70 125 L 75 130 L 45 130 L 50 125 L 50 65 Z"
            fill="url(#goldGradient)"
          />

          {/* Diagonal connecting stroke and bottom-right leg */}
          <path
            d="M 70 95 
               C 80 92 90 85 98 75 
               L 120 55 
               L 123 60 
               C 110 75 95 90 85 98
               C 92 105 105 118 122 130
               L 135 132
               C 120 132 105 125 93 113
               L 70 95 Z"
            fill="url(#goldGradient)"
          />

          {/* Elegant Lady's Profile integrated into the right side */}
          {/* Face silhouette (Nose, Lips, Chin, Neck) */}
          <path
            d="M 120 70
               C 123 71, 126 73, 128 75
               C 130 77, 131 79, 132 82
               C 133 83, 134 84, 135 84.5
               C 136 85, 137 84, 136 86
               C 135 87.5, 133 88, 134 89
               C 135 90, 137 90.5, 135 92.5
               C 133.5 94, 131 94, 130 95
               C 128 96, 125 102, 124 105
               C 123 108, 124 112, 126 114
               C 122 111, 118 106, 117 100
               C 116 93, 118 88, 119 82
               C 120 76, 119 72, 120 70 Z"
            fill="url(#goldGradient)"
          />

          {/* Flowing golden hair strands outlining her face and back */}
          <path
            d="M 103 62
               C 110 63, 118 67, 123 73
               C 128 79, 130 87, 129 95
               C 127 103, 122 110, 118 116
               C 114 122, 111 127, 111 130
               C 113 125, 117 119, 121 113
               C 125 107, 128 100, 128 92
               C 128 84, 125 76, 119 70
               C 114 65, 108 63, 103 62 Z"
            fill="url(#goldGradient)"
            opacity="0.85"
          />
          
          <path
            d="M 109 72
               C 113 74, 118 78, 120 84
               C 122 90, 121 96, 118 102
               C 115 108, 111 113, 109 116
               C 112 111, 115 105, 116 99
               C 117 93, 116 87, 113 81
               C 111 77, 107 74, 105 73 Z"
            fill="url(#goldGradient)"
            opacity="0.7"
          />

          {/* Her closed eye (peaceful line) */}
          <path
            d="M 123 80 Q 125 82 127 80"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* 3. "KARA" TEXT (متن کارا) */}
      {showText && (
        <span className="text-xl md:text-2xl font-bold tracking-[0.2em] bg-gradient-to-r from-[#ffe59e] via-[#e5b85a] to-[#bfa054] bg-clip-text text-transparent font-serif mt-2 select-none uppercase">
          KARA
        </span>
      )}

      {/* 4. SUBTITLE "مرکز خدمات دیجیتال" (زیرنویس فارسی) */}
      {showText && showSubtitle && (
        <span className="text-[10px] md:text-xs text-[#e5b85a]/80 font-medium tracking-wide mt-1 select-none font-sans block">
          مرکز خدمات دیجیتال
        </span>
      )}
    </div>
  );
}
