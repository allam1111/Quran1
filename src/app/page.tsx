"use client";

import React, { useState } from "react";
import { SurahSelector } from "@/components/SurahSelector";
import { VideoPreview } from "@/components/VideoPreview";
import { Controls } from "@/components/Controls";
import { RenderModal } from "@/components/RenderModal";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { Sparkles, Download } from "lucide-react";

import { Mushaf } from "@/components/Mushaf";
import { PrayerTimes } from "@/components/PrayerTimes";
import { AudioLibrary } from "@/components/AudioLibrary";
import { Navigation } from "@/components/Navigation";
import { useEditor } from "@/store/useEditor";

export default function Home() {
  const { state } = useEditor();
  const [isRenderOpen, setIsRenderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden font-arabic islamic-pattern select-none">
      {/* Fixed Top Bar: Logo + Install + Developer Credit */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/5 h-16 px-6 flex items-center justify-between flex-row">
        {/* Right Side: Logo & Name (In RTL flex-row puts first child on right) */}
        <div className="flex items-center gap-3">
          <img src="/app-logo.png" alt="قرآن" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
          <span className="text-base font-bold text-white font-arabic">قرآن</span>
        </div>

        {/* Left Side: Install & Credit */}
        <div className="flex items-center gap-4">
          <PWAInstallButton />
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <p className="text-[10px] text-white/30 font-bold tracking-wider uppercase">
            by <a href="https://www.instagram.com/youssef_osama04?igsh=MXV2Y2o5MzE0d2c1dA==" target="_blank" rel="noopener noreferrer" className="text-primary/60 hover:text-primary transition-colors">Youssef</a>
          </p>
        </div>
      </div>

      {/* Universal Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden mt-16 mb-24 md:mb-28">
        {state.view === "video" && (
          <div className="flex flex-1 overflow-hidden animate-in fade-in duration-700">
            {/* Sidebar Controls - Right side for Arabic RTL */}
            <aside className="hidden md:flex w-[380px] h-full glass border-r border-white/10 flex-col z-20 shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="text-black w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white gold-shimmer bg-clip-text">صانع الفيديوهات</h1>
                            <p className="text-[10px] text-primary/60 font-medium uppercase tracking-[0.1em]">قرآن</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar">
                    <section className="flex flex-col gap-4">
                        <h2 className="text-[11px] font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                             إعدادات السورة
                        </h2>
                        <div className="bg-white/[0.02] rounded-[1.5rem] border border-white/5 p-4">
                            <SurahSelector />
                        </div>
                    </section>

                    <section className="flex flex-col gap-4 flex-1">
                        <h2 className="text-[11px] font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                             تخصيص المشهد
                        </h2>
                        <div className="bg-white/[0.02] rounded-[1.5rem] border border-white/5 p-4 h-full">
                            <Controls />
                        </div>
                    </section>
                </div>

                {/* Action Button - Fixed at bottom */}
                <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-col gap-2">
                    <PWAInstallButton />
                    <button 
                        onClick={() => setIsRenderOpen(true)}
                        className="w-full flex items-center justify-center gap-3 bg-primary text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] group relative overflow-hidden"
                    >
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        <span>تصدير الفيديو</span>
                    </button>
                </div>
            </aside>

            {/* Main Preview Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 animate-float h-full flex items-center justify-center">
                    <VideoPreview />
                </div>
                
                {/* Mobile Floating Buttons */}
                <div className="md:hidden absolute bottom-8 right-8 flex flex-col gap-4 z-50">
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-14 h-14 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-xl flex items-center justify-center shadow-2xl"
                  >
                    <Sparkles className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setIsRenderOpen(true)}
                    className="w-14 h-14 rounded-full bg-primary text-black shadow-2xl flex items-center justify-center transition-all active:scale-95"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
            </div>

            {/* Mobile Settings Drawer */}
            <div className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ${isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsSettingsOpen(false)} />
              <div className={`absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[#0a0a0a] rounded-t-[3rem] border-t border-white/10 flex flex-col p-6 transition-transform duration-500 overflow-y-auto no-scrollbar ${isSettingsOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-8 shrink-0" />
                
                {/* PWA Install Button on Mobile */}
                <div className="mb-10">
                  <PWAInstallButton />
                </div>
                
                <section className="flex flex-col gap-4 mb-8">
                    <h2 className="text-[11px] font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                         إعدادات السورة
                    </h2>
                    <div className="bg-white/[0.02] rounded-[1.5rem] border border-white/5 p-4">
                        <SurahSelector />
                    </div>
                </section>

                <section className="flex flex-col gap-4 mb-8">
                    <h2 className="text-[11px] font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                         تخصيص المشهد
                    </h2>
                    <div className="bg-white/[0.02] rounded-[1.5rem] border border-white/5 p-4">
                        <Controls />
                    </div>
                </section>

                <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold mt-auto">
                  حفظ وإغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {state.view === "mushaf" && (
          <div className="flex-1 overflow-hidden">
            <Mushaf />
          </div>
        )}

        {state.view === "library" && (
          <div className="flex-1 overflow-hidden">
            <AudioLibrary />
          </div>
        )}

        {state.view === "prayers" && (
          <div className="flex-1 overflow-hidden">
            <PrayerTimes />
          </div>
        )}
      </main>



      {/* Render Progress Modal */}
      <RenderModal 
        isOpen={isRenderOpen} 
        onClose={() => setIsRenderOpen(false)}
      />
    </div>
  );
}
