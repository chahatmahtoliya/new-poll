
import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Poll } from "@/context/PollContext";
import { usePollContext } from "@/context/PollContext";
import { toast } from "sonner";

interface VotingInterfaceProps {
  poll: Poll;
  onVoted: () => void;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ poll, onVoted }) => {
  const { vote, hasVoted } = usePollContext();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleVote = () => {
    if (!selectedOptionId) {
      toast.error("Please select an option");
      return;
    }

    if (hasVoted(poll.id)) {
      toast.error("You have already voted on this poll");
      return;
    }

    vote(poll.id, selectedOptionId);
    toast.success("Vote recorded!");
    onVoted();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup value={selectedOptionId || ""} onValueChange={setSelectedOptionId}>
          <div className="space-y-3">
            {poll.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 rounded-md border hover:border-primary hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="flex-grow cursor-pointer font-medium"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        <Button
          onClick={handleVote}
          className="w-full mt-6"
          disabled={!selectedOptionId || hasVoted(poll.id)}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Submit Vote
        </Button>
      </CardContent>
    </Card>
  );
};

export default VotingInterface;
