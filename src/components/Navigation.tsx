"use client";

import React from "react";
import { Video, BookOpen, Clock, Settings, Headphones } from "lucide-react";
import { useEditor } from "@/store/useEditor";
import { cn } from "@/lib/utils"; // If not available, I'll use a simple utility

export function Navigation() {
  const { state, updateState } = useEditor();

  const tabs = [
    { id: "mushaf" as const, label: "المصحف الشريف", icon: BookOpen },
    { id: "library" as const, label: "المكتبة الصوتية", icon: Headphones },
    { id: "prayers" as const, label: "مواقيت الصلاة", icon: Clock },
    { id: "video" as const, label: "صانع الفيديو", icon: Video },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-2xl border-t border-white/10 px-6 py-2 md:py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-around md:justify-center md:gap-12">
        {tabs.map((tab) => {
          const isActive = state.view === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => updateState({ view: tab.id })}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 transition-all duration-500 relative py-2 ${isActive ? 'text-primary' : 'text-white/40 hover:text-white/60'}`}
            >
              <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? 'bg-primary/10 scale-110' : 'bg-transparent'}`}>
                <Icon className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''}`} />
              </div>
              <span className={`text-[10px] md:text-sm font-bold font-arabic transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-60 md:opacity-100 scale-95'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-in slide-in-from-bottom-1 duration-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
