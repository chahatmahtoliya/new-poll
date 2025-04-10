
import React from "react";
import Header from "@/components/Header";
import PollsList from "@/components/PollsList";
import { ArrowRight, TrendingUp, Award, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-primary pt-16 pb-20">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?polls,voting')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
              Welcome to VoteVision
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Create and share polls with real-time results. Get instant feedback from your audience on any topic.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/create" className="flex items-center gap-2">
                Create Your First Poll <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Trending Polls Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Polls</h2>
              </div>
              <Link to="/create" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <PollsList category="trending" limit={3} />
          </section>
          
          {/* Top Polls Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">Top Rated Polls</h2>
              </div>
              <Link to="/create" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <PollsList category="top" limit={3} />
          </section>
          
          {/* Latest Polls Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Latest Polls</h2>
              </div>
              <Link to="/create" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <PollsList category="latest" limit={3} />
          </section>
          
          {/* Featured Polls Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Polls</h2>
              </div>
              <Link to="/create" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <PollsList category="featured" limit={6} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
