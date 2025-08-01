// app/cee/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  CheckSquare,
  Award,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  subItems: {
    label: string;
    to: string;
    icon: React.ReactNode;
  }[];
}

export default function CeeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, arr) => ({
      label: path.replace(/-/g, " "),
      path: "/" + arr.slice(0, index + 1).join("/"),
    }));

  const navigationItems: NavItem[] = [
    {
      label: "CEE Exam Prep",
      to: "/cee/exam",
      icon: <BookOpen size={16} />,
      subItems: [
        { label: "Videos", to: "/cee/exam/videos", icon: <Video size={14} /> },
        { label: "Reading", to: "/cee/exam/reading", icon: <FileText size={14} /> },
        { label: "MCQs", to: "/cee/exam/mcqs", icon: <CheckSquare size={14} /> },
        { label: "Fill Blanks", to: "/cee/exam/fill-in-the-blanks", icon: <HelpCircle size={14} /> },
      ],
    },
    {
      label: "CEE Interview Prep",
      to: "/cee/interview",
      icon: <Award size={16} />,
      subItems: [
        { label: "Guide", to: "/cee/interview/guide", icon: <ChevronRight size={14} /> },
      ],
    },
  ];

  const toggleExpand = (path: string) => {
    setExpandedItem((prev) => (prev === path ? null : path));
  };

//   const isCeeHome = pathname === "/cee";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-white pt-16">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="bg-zinc-800/80 backdrop-blur-sm shadow-lg rounded-xl px-6 py-4 border border-zinc-700/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-md bg-zinc-700/50 hover:bg-zinc-700 transition-colors cursor-pointer md:hidden"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                CEE Portal
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-zinc-700/30 px-3 py-1.5 rounded-md text-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-zinc-300">Ready for Exam</span>
              </div>
            </div>
          </div>
        </header>

        <div className={cn("flex flex-col md:flex-row", sidebarOpen ? "md:gap-6" : "")}>
          {/* Sidebar */}
          <aside
            className={cn(
              "transition-all duration-300 ease-in-out",
              sidebarOpen ? "w-full md:w-64 opacity-100 mb-4 md:mb-0" : "hidden opacity-0 overflow-hidden"
            )}
          >
            <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-700/50 p-4 md:sticky md:top-6">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const isExpanded = expandedItem === item.to;
                  const isActive = pathname.startsWith(item.to);

                  return (
                    <div key={item.to} className="mb-3">
                      <div className="flex items-center cursor-pointer" onClick={() => toggleExpand(item.to)}>
                        <Link
                          href={item.to}
                          className={cn(
                            "flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive || isExpanded
                              ? "bg-blue-600 text-white shadow"
                              : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                        {item.subItems.length > 0 && (
                          <span className="p-1 hover:bg-zinc-700/50 rounded-md ml-1">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-1 pl-2 border-l border-zinc-700/50">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.to}
                              href={subItem.to}
                              className={cn(
                                "block px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2",
                                pathname === subItem.to
                                  ? "bg-blue-500/20 text-blue-400 shadow-sm"
                                  : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
                              )}
                            >
                              {subItem.icon}
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Breadcrumbs */}
            <div className="bg-zinc-800/60 backdrop-blur-sm mb-4 px-4 py-2 rounded-lg border border-zinc-700/50 overflow-x-auto">
              <div className="flex items-center text-sm text-zinc-400 whitespace-nowrap">
                <Link href="/" className="hover:text-zinc-200 transition-colors">
                  <Home size={14} />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    <span className="mx-2 text-zinc-600">/</span>
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-zinc-200">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.path} className="hover:text-zinc-200 transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rendered Children */}
            <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-700/50 p-4 sm:p-6 md:p-8 min-h-[70vh]">
              {children}
            </div>
          </main>
        </div>
      </div>
   
    </div>
  );
}
