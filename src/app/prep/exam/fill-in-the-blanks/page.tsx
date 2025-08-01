'use client';

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fillBlankCategories, Paper } from "./constants";

interface QuestionPaperCardProps {
  paper: Paper;
  className?: string;
}

function QuestionPaperCard({ paper, className }: QuestionPaperCardProps) {
  return (
    <div className={`bg-neutral-800 rounded-lg p-6 hover:bg-neutral-700 transition-colors cursor-pointer ${className || ''}`}>
      <h3 className="text-lg font-semibold text-white mb-2">{paper.title}</h3>
      <p className="text-neutral-400 text-sm">{paper.questions.length} questions</p>
    </div>
  );
}

export default function CeeExamFillBlanks() {
  const [activeCategory, setActiveCategory] = useState<string>("coding");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Category Tabs */}
      <div className="flex justify-center mb-10 overflow-x-auto">
        <div className="bg-zinc-800 rounded-full p-1 inline-flex shadow-inner">
          {Object.values(fillBlankCategories).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 sm:px-6 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300",
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
        {fillBlankCategories[activeCategory].papers.map((paper, idx) => (
          <Link key={idx} href={`/cee/exam/fill-in-the-blanks/${paper.id}`}>
            <QuestionPaperCard paper={paper} />
          </Link>
        ))}
      </div>
    </div>
  );
}
