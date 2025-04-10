
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Poll } from "@/context/PollContext";

interface ResultsChartProps {
  poll: Poll;
}

const ResultsChart: React.FC<ResultsChartProps> = ({ poll }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  // Sort options by votes (descending)
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);

  // Generate random pastel colors for each option
  const getColor = (index: number) => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-red-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-orange-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {sortedOptions.map((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{option.text}</span>
                  <span className="text-sm font-medium">
                    {option.votes} vote{option.votes !== 1 ? "s" : ""} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-6 w-full bg-secondary rounded-md overflow-hidden">
                  <div 
                    className={`h-full ${getColor(index)} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: animate ? `${percentage}%` : '0%',
                      '--bar-width': `${percentage}%`
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Total: {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsChart;
