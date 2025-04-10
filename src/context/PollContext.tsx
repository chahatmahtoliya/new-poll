import React, { createContext, useContext, useState, useEffect } from "react";

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
  creatorId?: string;
  coverImage?: string | null;
};

type PollContextType = {
  polls: Poll[];
  addPoll: (poll: Omit<Poll, "id" | "createdAt">) => void;
  getPoll: (id: string) => Poll | undefined;
  vote: (pollId: string, optionId: string) => void;
  hasVoted: (pollId: string) => boolean;
  loading: boolean;
};

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePollContext = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePollContext must be used within a PollProvider");
  }
  return context;
};

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load polls from localStorage on mount
  useEffect(() => {
    const savedPolls = localStorage.getItem("polls");
    if (savedPolls) {
      // Convert string dates back to Date objects
      const parsedPolls = JSON.parse(savedPolls).map((poll: any) => ({
        ...poll,
        createdAt: new Date(poll.createdAt)
      }));
      setPolls(parsedPolls);
    } else {
      // Add some demo polls if none exist
      const demoPolls = [
        {
          id: "1",
          question: "What's your favorite programming language?",
          options: [
            { id: "1-1", text: "JavaScript", votes: 12 },
            { id: "1-2", text: "Python", votes: 9 },
            { id: "1-3", text: "TypeScript", votes: 15 },
            { id: "1-4", text: "Java", votes: 7 },
            { id: "1-5", text: "C#", votes: 5 },
          ],
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          coverImage: "https://source.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
        },
        {
          id: "2",
          question: "Which UI framework do you prefer?",
          options: [
            { id: "2-1", text: "React", votes: 18 },
            { id: "2-2", text: "Vue", votes: 10 },
            { id: "2-3", text: "Angular", votes: 6 },
            { id: "2-4", text: "Svelte", votes: 8 },
          ],
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          coverImage: "https://source.unsplash.com/photo-1561883088-039e53143d73"
        }
      ];
      setPolls(demoPolls);
      localStorage.setItem("polls", JSON.stringify(demoPolls));
    }
    setLoading(false);
  }, []);

  // Save polls to localStorage when they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("polls", JSON.stringify(polls));
    }
  }, [polls, loading]);

  // Track votes in localStorage
  const hasVoted = (pollId: string): boolean => {
    const votes = JSON.parse(localStorage.getItem("votes") || "{}");
    return !!votes[pollId];
  };

  const addPoll = (poll: Omit<Poll, "id" | "createdAt">) => {
    const newPoll: Poll = {
      ...poll,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPolls((prevPolls) => [...prevPolls, newPoll]);
  };

  const getPoll = (id: string): Poll | undefined => {
    return polls.find((poll) => poll.id === id);
  };

  const vote = (pollId: string, optionId: string) => {
    if (hasVoted(pollId)) return;

    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        
        return {
          ...poll,
          options: poll.options.map((option) => {
            if (option.id !== optionId) return option;
            return { ...option, votes: option.votes + 1 };
          }),
        };
      })
    );

    // Record this vote in localStorage
    const votes = JSON.parse(localStorage.getItem("votes") || "{}");
    votes[pollId] = optionId;
    localStorage.setItem("votes", JSON.stringify(votes));
  };

  return (
    <PollContext.Provider value={{ polls, addPoll, getPoll, vote, hasVoted, loading }}>
      {children}
    </PollContext.Provider>
  );
};
