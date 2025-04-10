
import React from "react";
import Header from "@/components/Header";
import CreatePoll from "@/components/CreatePoll";

const CreatePollPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Create a New Poll</h1>
          <CreatePoll />
        </div>
      </main>
    </div>
  );
};

export default CreatePollPage;
