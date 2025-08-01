// app/cee/exam/page.tsx
"use client";

import Link from "next/link";
import { Video, BookOpen, CheckSquare, HelpCircle } from "lucide-react";

const examSections = [
  {
    name: "Videos",
    path: "/cee/exam/videos",
    icon: <Video size={16} />,
    description: "Watch instructional videos about CEE topics",
  },
  {
    name: "Reading",
    path: "/cee/exam/reading",
    icon: <BookOpen size={16} />,
    description: "Access comprehensive reading materials",
  },
  {
    name: "MCQs",
    path: "/cee/exam/mcqs",
    icon: <CheckSquare size={16} />,
    description: "Practice with multiple choice questions",
  },
  {
    name: "Fill Blanks",
    path: "/cee/exam/fill-in-the-blanks",
    icon: <HelpCircle size={16} />,
    description: "Complete Fill in the blanks exercises",
  },
];

export default function CeeExamHomePage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {examSections.map((section) => (
        <Link
          key={section.path}
          href={section.path}
          className="bg-zinc-700/50 hover:bg-zinc-700/80 border border-zinc-600/50 rounded-lg p-4 transition-all hover:shadow-md hover:shadow-blue-900/20 group"
        >
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-md bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30">
              {section.icon}
            </span>
            <div>
              <h3 className="font-medium text-white mb-1 group-hover:text-blue-300 transition-colors text-base sm:text-lg">
                {section.name}
              </h3>
              <p className="text-sm text-zinc-400">{section.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
