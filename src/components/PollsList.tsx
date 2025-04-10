
import React from "react";
import { usePollContext } from "@/context/PollContext";
import PollItem from "@/components/PollItem";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PollsListProps {
  category?: "trending" | "top" | "latest" | "featured";
  limit?: number;
}

const PollsList: React.FC<PollsListProps> = ({ category = "latest", limit }) => {
  const { polls, loading } = usePollContext();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit || 6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-6">Create your first poll to get started!</p>
          <Button asChild>
            <Link to="/create" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create New Poll
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filter and sort polls based on category
  let filteredPolls = [...polls];
  
  switch (category) {
    case "trending":
      // Sort by most votes in the last week
      filteredPolls.sort((a, b) => {
        const aTotalVotes = a.options.reduce((sum, option) => sum + option.votes, 0);
        const bTotalVotes = b.options.reduce((sum, option) => sum + option.votes, 0);
        return bTotalVotes - aTotalVotes;
      });
      break;
    case "top":
      // Sort by highest total votes
      filteredPolls.sort((a, b) => {
        const aTotalVotes = a.options.reduce((sum, option) => sum + option.votes, 0);
        const bTotalVotes = b.options.reduce((sum, option) => sum + option.votes, 0);
        return bTotalVotes - aTotalVotes;
      });
      break;
    case "latest":
      // Sort by newest
      filteredPolls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "featured":
      // For demo, shuffle the polls to simulate featured content
      filteredPolls = filteredPolls
        .sort(() => 0.5 - Math.random())
        .filter(poll => {
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
          return totalVotes > 0; // Only include polls with votes for featured
        });
      break;
    default:
      filteredPolls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Apply limit if provided
  if (limit && limit > 0) {
    filteredPolls = filteredPolls.slice(0, limit);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPolls.map((poll) => (
        <PollItem key={poll.id} poll={poll} category={category} />
      ))}
    </div>
  );
};

export default PollsList;
