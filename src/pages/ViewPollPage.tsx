
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import Header from "@/components/Header";
import VotingInterface from "@/components/VotingInterface";
import ResultsChart from "@/components/ResultsChart";
import { usePollContext } from "@/context/PollContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ViewPollPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPoll, hasVoted } = usePollContext();
  const [showResults, setShowResults] = useState(false);
  
  const poll = getPoll(id || "");
  
  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Poll Not Found</h1>
            <p className="mb-6">The poll you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Polls
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleSharePoll = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Poll link copied to clipboard!");
  };

  // Check if user has already voted on this poll
  const userVoted = hasVoted(poll.id);
  
  // Show results if user has voted or explicitly wants to see results
  const displayResults = showResults || userVoted;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Polls
          </Button>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{poll.question}</CardTitle>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" onClick={handleSharePoll}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!displayResults && (
                <div className="mb-3 text-sm text-muted-foreground">
                  Select an option below and submit your vote
                </div>
              )}
            </CardContent>
          </Card>
          
          {displayResults ? (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <ResultsChart poll={poll} />
              
              {!userVoted && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Back to Voting
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
              <VotingInterface 
                poll={poll} 
                onVoted={() => setShowResults(true)} 
              />
              
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => setShowResults(true)}
                >
                  Skip voting and view results
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewPollPage;
