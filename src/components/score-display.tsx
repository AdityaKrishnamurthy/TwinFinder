"use client";

import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  
  const [animatedScore, setAnimatedScore] = React.useState(0);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);
  
  const displayScore = React.useMemo(() => {
    if (score < 30) return 0;
    if (score > 60) return 100; // Show 1 as 100% for the progress circle
    return score;
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  const scoreText = React.useMemo(() => {
    if (score < 30) return '0';
    if (score > 60) return '1';
    return `${Math.round(displayScore)}%`;
  }, [score, displayScore]);


  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
        <circle
          className="text-card"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-accent"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">
          {scoreText}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          ({Math.round(score)}% match)
        </span>
        <span className="text-sm text-muted-foreground mt-1">Similarity</span>
      </div>
    </div>
  );
}
