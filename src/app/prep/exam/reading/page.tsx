'use client';

import { useState } from "react";
// import ReadingCard from "@/components/ReadingCard";
import { cn } from "@/lib/utils";
import ComingSoon from "./CompingSoon";

type Reading = {
  title: string;
  description: string;
  link: string;
  author: string;
};

type Category = {
  id: string;
  title: string;
  readings: Reading[];
};

type Categories = Record<string, Category>;

export default function CeeExamReading() {
  const [activeCategory, setActiveCategory] = useState<string>("coding");

  const categories: Categories = {
    coding: {
      id: "coding",
      title: "Ability to Code",
      readings: [
        {
          title: "Clean Code Basics",
          description: "Learn how to write clean, readable, and maintainable code.",
          link: "https://www.freecodecamp.org/news/clean-coding-for-beginners/",
          author: "freeCodeCamp"
        },
        {
          title: "What is an Algorithm?",
          description: "Understand how algorithms work and how to use them.",
          link: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
          author: "GeeksforGeeks"
        }
      ]
    },
    language: {
      id: "language",
      title: "Language Reasoning",
      readings: [
        {
          title: "Verbal Ability Practice",
          description: "Sharpen your language reasoning and comprehension skills.",
          link: "https://www.indiabix.com/verbal-ability/questions-and-answers/",
          author: "IndiaBix"
        },
        {
          title: "Critical Reading Tips",
          description: "Improve reading comprehension for verbal sections.",
          link: "https://blog.prepscholar.com/sat-reading-tips",
          author: "PrepScholar"
        }
      ]
    },
    analytical: {
      id: "analytical",
      title: "Analytical Reasoning",
      readings: [
        {
          title: "Analytical Reasoning Concepts",
          description: "Get familiar with pattern recognition and logic games.",
          link: "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
          author: "IndiaBix"
        },
        {
          title: "Critical Thinking Guide",
          description: "Understand how to break down and evaluate arguments.",
          link: "https://www.skillsyouneed.com/learn/critical-thinking.html",
          author: "SkillsYouNeed"
        }
      ]
    },
    aptitude: {
      id: "aptitude",
      title: "Aptitude",
      readings: [
        {
          title: "Quant Tricks",
          description: "Learn quick tricks to solve aptitude questions faster.",
          link: "https://www.careerride.com/Aptitude-questions.aspx",
          author: "CareerRide"
        },
        {
          title: "Aptitude Topic-wise Theory",
          description: "In-depth topic theory and solved examples.",
          link: "https://byjus.com/quantitative-aptitude/",
          author: "BYJU'S"
        }
      ]
    }
  };

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

      {/* Reading Cards (Uncomment when needed) */}
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories[activeCategory].readings.map((reading, idx) => (
          <ReadingCard reading={reading} key={idx} />
        ))}
      </div>
      */}

      <ComingSoon />
    </div>
  );
}
