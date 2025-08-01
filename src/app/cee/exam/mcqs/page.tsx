'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import abilityToCode from './abilityToCode.json';
import languageReasoning from './languageReasoning.json';
import analyticalReasoning from './analyticalReasoning.json';
import aptitude from './aptitude.json';

export default function CeeExamMCQs() {
  const [activeCategory, setActiveCategory] = useState("coding");
  const router = useRouter();

  // Types
  interface Question {
    id: string | number;
    question: string;
    options: string[];
    answer: string;
    scenarioRef?: string;
  }

  interface Scenario {
    id: string;
    title: string;
    description: string;
  }

  interface Paper {
    id: string;
    title: string;
    questions: Question[];
    scenarios?: Scenario[];
  }

  interface Category {
    id: string;
    title: string;
    papers: Paper[];
  }

  interface Categories {
    [key: string]: Category;
  }

  // Categories
  const categories: Categories = {
    coding: { id: "coding", title: "Ability to Code", papers: abilityToCode },
    language: { id: "language", title: "Language Reasoning", papers: languageReasoning },
    reasoning: { id: "reasoning", title: "Analytical Reasoning", papers: analyticalReasoning },
    aptitude: { id: "aptitude", title: "Aptitude", papers: aptitude },
  };

  const handlePaperClick = (paper: Paper) => {
    router.push(`/cee/exam/mcqs/${paper.id}`);
  };

  // QuestionPaperCard component
  function QuestionPaperCard({ paper, onClick, className }: {
    paper: Paper;
    onClick: () => void;
    className?: string;
  }) {
    return (
      <div 
        onClick={onClick}
        className={cn(
          "bg-zinc-800 rounded-lg p-6 cursor-pointer hover:bg-zinc-700 transition-colors border border-zinc-700",
          className
        )}
      >
        <h3 className="text-lg font-semibold text-white mb-2">{paper.title}</h3>
        <p className="text-zinc-400 text-sm">
          {paper.questions.length} questions
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-800 rounded-full p-1 inline-flex shadow-inner overflow-x-auto max-w-full scrollbar-hide space-x-2">
          {Object.values(categories).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "whitespace-nowrap px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300",
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              )}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Question Papers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories[activeCategory].papers.map((paper, idx) => (
          <QuestionPaperCard
            key={idx}
            paper={paper}
            onClick={() => handlePaperClick(paper)}
            className="w-full max-w-xs mx-auto"
          />
        ))}
      </div>
    </div>
  );
}