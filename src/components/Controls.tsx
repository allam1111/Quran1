"use client";

import React, { useMemo, useState } from "react";
import { useEditor } from "@/store/useEditor";
import { usePexelsBackgrounds, PexelsMediaItem } from "@/hooks/usePexelsBackgrounds";

const RECITERS = [
  { id: "afasy", name: "مشاري العفاسي" },
  { id: "abdulbasit", name: "عبد الباسط عبد الصمد" },
  { id: "maher", name: "ماهر المعيقلي" },
  { id: "menshawi", name: "محمد صديق المنشاوي" },
  { id: "ghamadi", name: "سعد الغامدي" },
  { id: "hudhaify", name: "علي الحذيفي" },
  { id: "husary", name: "محمود خليل الحصري" },
  { id: "shuraym", name: "سعود الشريم" },
  { id: "sudais", name: "عبد الرحمن السديس" },
  { id: "qatami", name: "ناصر القطامي" },
  { id: "dussary", name: "ياسر الدوسري" },
  { id: "ajamy", name: "أحمد العجمي" },
  { id: "abbad", name: "فارس عباد" },
  { id: "tablawy", name: "محمد محمود الطبلاوي" },
];

const FALLBACK_BACKGROUNDS: PexelsMediaItem[] = [
  {
    type: "image",
    src: "https://images.pexels.com/photos/10510781/pexels-photo-10510781.jpeg",
    poster: "https://images.pexels.com/photos/10510781/pexels-photo-10510781.jpeg",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/1810648/pexels-photo-1810648.jpeg",
    poster: "https://images.pexels.com/photos/1810648/pexels-photo-1810648.jpeg",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/1688075/pexels-photo-1688075.jpeg",
    poster: "https://images.pexels.com/photos/1688075/pexels-photo-1688075.jpeg",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/3457842/pexels-photo-3457842.jpeg",
    poster: "https://images.pexels.com/photos/3457842/pexels-photo-3457842.jpeg",
  },
];

export function Controls() {
  const [activeTab, setActiveTab] = useState("bg");
  const [search, setSearch] = useState("islamic landscape");
  const [query, setQuery] = useState("islamic landscape");
  const { state, updateState } = useEditor();
  const { media, loading, error } = usePexelsBackgrounds(query);

  const displayMedia = useMemo(() => {
    return media.length > 0 ? media : FALLBACK_BACKGROUNDS;
  }, [media]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
        {[
          { id: "bg", label: "الخلفية" },
          { id: "reciter", label: "القاريء" },
          { id: "style", label: "الخط" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-3 text-[10px] font-bold rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white/60'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-3xl bg-black/20 border border-white/5 p-4 relative overflow-hidden group min-h-[300px]">
        <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
        
        {activeTab === "bg" && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="مثلاً: طبيعة، مكة، نجوم..."
                className="flex-1 rounded-2xl border border-white/5 bg-black/40 px-5 py-4 text-sm text-white outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              />
              <button
                onClick={() => setQuery(search || "islamic landscape")}
                className="rounded-2xl bg-white/5 px-6 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all border border-white/5"
              >
                بحث
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Loading Media</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                {displayMedia.slice(0, 16).map((item, index) => (
                  <button
                    key={`${item.src}-${index}`}
                    onClick={() => updateState({ backgroundUrl: item.src })}
                    className={`relative aspect-[9/16] overflow-hidden rounded-[1.5rem] border-2 transition-all duration-500 group/item ${state.backgroundUrl === item.src ? 'border-primary shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-[0.98]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                      />
                    ) : (
                      <img
                        src={`${item.src}?auto=compress&cs=tinysrgb&dpr=2&h=400&w=300`}
                        alt="bg"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                      />
                    )}
                    <div className={`absolute inset-0 bg-black/20 group-hover/item:bg-transparent transition-colors duration-500 ${state.backgroundUrl === item.src ? 'bg-transparent' : ''}`} />
                    {item.type === "video" && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-md border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        HD
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reciter" && (
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-8 duration-700">
            {RECITERS.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => updateState({ reciterId: reciter.id })}
                className={`w-full rounded-2xl border p-5 text-right transition-all duration-500 group/rec ${state.reciterId === reciter.id ? 'border-primary bg-primary/5 text-primary shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/5 bg-white/[0.01] text-white/40 hover:bg-white/[0.03] hover:text-white/80'}`}
              >
                <div className="flex items-center justify-between">
                   <div className={`w-2 h-2 rounded-full transition-all ${state.reciterId === reciter.id ? 'bg-primary scale-125' : 'bg-white/10 group-hover/rec:bg-white/30'}`} />
                   <span className="text-sm font-bold font-arabic">{reciter.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "style" && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/30 px-1">لوحة الألوان</span>
              <div className="flex flex-wrap gap-4">
                {[
                  '#ffffff', '#FFD700', '#D4AF37', '#00FFC2', '#00E5FF', 
                  '#3B82F6', '#A855F7', '#EC4899', '#F43F5E', '#FF5C5C', 
                  '#F59E0B', '#22C55E'
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateState({ textColor: color })}
                    style={{ backgroundColor: color }}
                    className={`h-10 w-10 rounded-full border-2 transition-all duration-500 ${state.textColor === color ? 'border-white scale-110 ring-8 ring-primary/10 shadow-lg shadow-black/40' : 'border-white/10 hover:scale-110'}`}
                  />
                ))}
                <div className="relative group/cp">
                  <input
                    type="color"
                    value={state.textColor}
                    onChange={(e) => updateState({ textColor: e.target.value })}
                    className="h-10 w-10 rounded-full border-2 border-white/10 bg-transparent cursor-pointer overflow-hidden opacity-0 absolute inset-0 z-10"
                  />
                  <div 
                    className="h-10 w-10 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold transition-all group-hover/cp:scale-110 shadow-lg"
                    style={{ background: 'conic-gradient(from 45deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)' }}
                  >
                    <span className="text-white drop-shadow-md">+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6 rounded-3xl bg-black/40 border border-white/5 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">
                <span>حجم النص</span>
                <span className="text-white px-3 py-1 bg-white/5 rounded-full border border-white/10">{state.fontSize}PX</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={state.fontSize}
                onChange={(e) => updateState({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-primary h-1.5 rounded-full appearance-none bg-white/5 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-5 p-6 rounded-3xl bg-black/40 border border-white/5 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">
                <span>سمك الخط</span>
                <span className="text-white px-3 py-1 bg-white/5 rounded-full border border-white/10">{state.fontWeight}</span>
              </div>
              <input
                type="range"
                min="100"
                max="900"
                step="100"
                value={state.fontWeight}
                onChange={(e) => updateState({ fontWeight: parseInt(e.target.value, 10) })}
                className="w-full accent-primary h-1.5 rounded-full appearance-none bg-white/5 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[9px] text-white/20 font-bold">
                <span>رفيع</span>
                <span>عادي</span>
                <span>سميك</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
