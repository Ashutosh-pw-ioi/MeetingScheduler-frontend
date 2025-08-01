// app/cee/exam/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Video, BookOpen, CheckSquare, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

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

export default function CeeExamLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isExamHome = pathname === "/cee/exam";

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      {/* Exam Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">CEE Examination</h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
          Prepare for your CEE with our comprehensive study materials and practice tests.
        </p>
      </div>

      {isExamHome ? (
        // Render the landing page content inside page.tsx
        children
      ) : (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="bg-zinc-700/30 rounded-lg px-3 py-2 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2">
              {examSections.map((section) => {
                const isActive = pathname === section.path;
                return (
                  <Link
                    key={section.path}
                    href={section.path}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    )}
                  >
                    {section.icon}
                    {section.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section Content */}
          <div className="bg-zinc-700/20 rounded-lg p-4 border border-zinc-600/30">{children}</div>
        </div>
      )}
    </div>
  );
}
