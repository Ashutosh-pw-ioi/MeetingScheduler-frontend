"use client";

import React, { useState } from "react";
import VideoCard from "./VideoCard";
import { cn } from "@/lib/utils";
import categories from "./categories.json";

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  url?: string;
  author: string;
  [key: string]: any; // Optional: adjust based on actual video structure
}

interface Category {
  id: string;
  title: string;
  videos: Video[];
}

const typedCategories: Record<string, Category> = categories;

export default function CeeExamVideos() {
  const [activeCategory, setActiveCategory] = useState<string>("coding");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-800 rounded-full p-1 inline-flex shadow-inner overflow-x-auto max-w-full scrollbar-hide space-x-2">
          {Object.values(typedCategories).map((category) => (
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

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {typedCategories[activeCategory]?.videos.map((video, idx) => (
          <VideoCard video={video} key={idx} />
        ))}
      </div>
    </div>
  );
}
