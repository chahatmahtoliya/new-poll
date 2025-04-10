
import React from "react";
import { Link } from "react-router-dom";
import { BarChart2, ArrowRight, Clock, TrendingUp, Star, Award } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Poll } from "@/context/PollContext";

// Helper function to format dates
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Generate a random background color or gradient for each poll card
const getBgStyle = (id: string, category?: string) => {
  const gradients = [
    "bg-gradient-to-br from-primary/10 to-purple-100",
    "bg-gradient-to-br from-blue-50 to-indigo-100",
    "bg-gradient-to-br from-amber-50 to-yellow-100",
    "bg-gradient-to-br from-rose-50 to-pink-100",
    "bg-gradient-to-br from-emerald-50 to-green-100",
  ];
  
  // Use the poll ID to deterministically select a background style
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
};

// Generate category-specific badge content
const getCategoryBadge = (category?: string) => {
  switch (category) {
    case "trending":
      return { icon: <TrendingUp className="h-3 w-3 mr-1" />, text: "Trending", className: "bg-gradient-to-r from-orange-500 to-pink-500 text-white" };
    case "top":
      return { icon: <Star className="h-3 w-3 mr-1" />, text: "Top Rated", className: "bg-gradient-to-r from-amber-400 to-amber-600 text-white" };
    case "featured":
      return { icon: <Award className="h-3 w-3 mr-1" />, text: "Featured", className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" };
    default:
      return null;
  }
};

// Generate a placeholder image based on poll id and category
const getPlaceholderImage = (id: string, question: string, category?: string) => {
  // Use parts of the id to generate a unique but consistent image for each poll
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  let imageCategories = ['abstract', 'business', 'animals', 'nature', 'technology'];
  
  // Add more specific categories based on poll category type
  if (category === "trending") {
    imageCategories = ['people', 'business', 'technology', 'event', 'news'];
  } else if (category === "top") {
    imageCategories = ['award', 'success', 'achievement', 'winner', 'popular'];
  } else if (category === "featured") {
    imageCategories = ['highlight', 'featured', 'special', 'premium', 'modern'];
  }
  
  const imageCategory = imageCategories[hash % imageCategories.length];
  
  // Extract keywords from the question to get more relevant images
  const keywords = question.split(' ')
    .filter(word => word.length > 3)
    .slice(0, 2)
    .join(',');
  
  return `https://source.unsplash.com/random/600x400/?${imageCategory},${encodeURIComponent(keywords)}`;
};

interface PollItemProps {
  poll: Poll;
  category?: "trending" | "top" | "latest" | "featured";
}

const PollItem: React.FC<PollItemProps> = ({ poll, category }) => {
  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  // Get category badge if applicable
  const badge = getCategoryBadge(category);
  
  // Determine image source: use coverImage if available, otherwise use placeholder
  const imageSource = poll.coverImage || getPlaceholderImage(poll.id, poll.question, category);
  
  return (
    <Card className={`h-full hover:shadow-xl transition-all duration-300 poll-option animate-fade-in ${getBgStyle(poll.id, category)} border hover:-translate-y-1`}>
      <CardHeader className="pb-0 relative">
        {badge && (
          <Badge variant="secondary" className={`absolute top-4 right-4 z-10 flex items-center px-2 py-1 ${badge.className}`}>
            {badge.icon}
            <span>{badge.text}</span>
          </Badge>
        )}
        <AspectRatio ratio={16/9} className="bg-muted rounded-md overflow-hidden mb-3 shadow-sm">
          <img 
            src={imageSource} 
            alt={poll.question}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
          />
        </AspectRatio>
        <CardTitle className="text-lg font-bold tracking-tight line-clamp-2 hover:text-primary transition-colors">
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-3">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(poll.createdAt)}</span>
        </div>
        <div className="mt-1 flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </span>
          <Badge variant="outline" className="ml-auto">
            {poll.options.length} options
          </Badge>
        </div>
        
        {/* Preview of top options */}
        {poll.options.length > 0 && (
          <div className="mt-3 space-y-2">
            {poll.options.slice(0, 2).map((option, index) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              return (
                <div key={option.id} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium truncate">{option.text}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full hover:bg-primary hover:text-white transition-colors">
          <Link to={`/poll/${poll.id}`} className="flex items-center justify-center">
            <span>Vote Now</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollItem;
