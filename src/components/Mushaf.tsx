"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Book, Headphones, ChevronRight, Search, LayoutGrid, X, Volume2 } from "lucide-react";
import { useEditor } from "@/store/useEditor";
import surahsData from "@/data/surahs.json";
import { getAudioUrl } from "@/lib/quranUtils";

export function Mushaf() {
  const { state, updateState } = useEditor();
  const [selectedSurah, setSelectedSurah] = useState<string | null>(null);
  const [surahContent, setSurahContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!selectedSurah) return;
    async function fetchSurah() {
      setLoading(true);
      setSurahContent(null);
      try {
        // Updated URL with fields=text_uthmani to ensure the Arabic text is returned
        const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah}?language=ar&words=false&fields=text_uthmani&translations=131&per_page=500`);
        const data = await response.json();
        
        if (!data.verses || data.verses.length === 0) throw new Error("No verses found");

        const formattedVerses = data.verses.map((v: any) => ({
            id: v.verse_number,
            text: v.text_uthmani || v.text_indopak || "نص الآية غير متوفر", // Fallback text
            translation: v.translations?.[0]?.text.replace(/<[^>]*>?/gm, '') || ""
        }));

        const sData = surahsData.find(s => s.id.toString() === selectedSurah);
        setSurahContent({
            name: sData?.name,
            transliteration: sData?.transliteration,
            verses: formattedVerses
        });
      } catch (err) {
        console.error("Failed to fetch surah", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurah();
  }, [selectedSurah]);

  const toggleAudio = (ayahId: number) => {
    if (playingAyah === ayahId) {
      audioRef.current?.pause();
      setPlayingAyah(null);
    } else {
      setPlayingAyah(ayahId);
      if (audioRef.current) {
        audioRef.current.src = getAudioUrl(Number(selectedSurah), ayahId, state.reciterId);
        audioRef.current.play().catch(e => console.error("Audio blocked", e));
      }
    }
  };

  const filteredSurahs = surahsData.filter(s => 
    s.name.includes(search) || s.transliteration.toLowerCase().includes(search.toLowerCase())
  );

  if (!selectedSurah) {
    return (
      <div className="flex flex-col h-full bg-[#050505] animate-in fade-in duration-500 overflow-hidden">
        {/* Compact Header with Search */}
        {/* Redundant header hidden as requested to use the new fixed top bar instead */}
        {/* <header className="p-6 md:px-12 border-b border-white/5 bg-[#050505]/40 backdrop-blur-xl shrink-0">
             ... header content ...
        </header> */}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar overscroll-contain">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
                
                {/* Continue Reading Bookmark Section */}
                {state.bookmark && (
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                 <Book className="w-8 h-8" />
                            </div>
                            <div className="text-right">
                                <h4 className="text-primary font-bold text-sm uppercase tracking-widest">وردك الحالي (متابعة القراءة)</h4>
                                <p className="text-2xl font-bold text-white font-arabic">سورة {surahsData.find(s => s.id.toString() === state.bookmark?.surahId)?.name} - آية {state.bookmark.ayahId}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedSurah(state.bookmark?.surahId || "1")}
                            className="bg-primary text-black px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                        >
                            انتقل للآية الآن
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                    {filteredSurahs.map((surah) => (
                        <button 
                            key={surah.id}
                            onClick={() => setSelectedSurah(surah.id.toString())}
                            className={`group relative flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1 active:scale-95 ${state.bookmark?.surahId === surah.id.toString() ? 'ring-2 ring-primary rounded-xl' : ''}`}
                        >
                             <div 
                                className="aspect-[3/4.2] w-full bg-transparent rounded-xl border-l-4 border-[#d4af37]/40 shadow-xl relative overflow-hidden flex flex-col items-center justify-center p-3"
                                style={{
                                    backgroundImage: "url('/mushaf-cover.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-2 border border-[#d4af37]/10 rounded-lg" />
                                <div className="relative z-10 w-16 h-16 border border-[#d4af37]/20 rounded-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm group-hover:border-[#d4af37]/60 transition-all">
                                    <span className="text-lg font-bold text-black font-arabic">{surah.name}</span>
                                </div>
                                <div className="absolute bottom-4 text-center">
                                    <p className="text-[#d4af37]/40 text-[9px] font-bold uppercase tracking-widest">{surah.id}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] animate-in slide-in-from-left duration-700 relative overflow-hidden">
      <header className="shrink-0 p-4 md:p-6 bg-black/40 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between z-40">
          <button 
            onClick={() => setSelectedSurah(null)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="text-center">
              <h2 className="text-xl font-bold text-white font-arabic gold-shimmer bg-clip-text">سورة {surahContent?.name || "..."}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Book className="w-5 h-5" />
          </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-16 pb-48 no-scrollbar scroll-smooth overscroll-contain">
          <div className="max-w-3xl mx-auto">
            {loading ? (
                 <div className="flex flex-col items-center justify-center p-20 gap-6">
                    <div className="w-12 h-12 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col gap-12 md:gap-20">
                    {surahContent?.verses.map((verse: any) => (
                        <div 
                            key={verse.id} 
                            id={`verse-${verse.id}`}
                            className={`group cursor-pointer relative transition-all duration-700 p-6 rounded-3xl ${playingAyah === verse.id ? 'bg-primary/[0.05]' : 'hover:bg-white/[0.01]'}`}
                        >
                            <div className="flex items-center justify-between mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => updateState({ bookmark: { surahId: selectedSurah, ayahId: verse.id } })}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${state.bookmark?.surahId === selectedSurah && state.bookmark?.ayahId === verse.id ? 'bg-primary border-primary text-black' : 'border-white/10 text-white/40 hover:bg-white/10'}`}
                                >
                                    <Book className="w-3 h-3" />
                                    <span>{state.bookmark?.surahId === selectedSurah && state.bookmark?.ayahId === verse.id ? 'تم حفظ الورد' : 'حفظ كورد حالي'}</span>
                                </button>
                                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">آية {verse.id}</div>
                            </div>

                            <p 
                                onClick={() => toggleAudio(verse.id)}
                                className={`text-right text-3xl md:text-5xl leading-[2.2] transition-all duration-700 ${playingAyah === verse.id ? 'text-primary drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02]' : 'text-white font-arabic'}`}
                            >
                                {verse.text}
                            </p>
                            
                            <div onClick={() => toggleAudio(verse.id)} className={`mt-8 overflow-hidden transition-all duration-700 ${playingAyah === verse.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative text-right">
                                    <p className="text-base text-white/40 leading-relaxed font-arabic">
                                        {verse.translation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
      </div>

      {/* Audio Player Bar */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[95%] max-w-xl z-50 transition-all duration-700 ${playingAyah ? 'translate-y-0 opacity-100 shadow-2xl' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-4 flex items-center justify-between backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-right">
                      <p className="text-sm font-bold text-white font-arabic">آية {playingAyah} - سورة {surahContent?.name}</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={() => toggleAudio(playingAyah!)} className="p-3 bg-primary rounded-2xl text-black hover:scale-105 transition-all"><Pause className="w-5 h-5" /></button>
                  <button onClick={() => setPlayingAyah(null)} className="p-3 bg-white/5 rounded-2xl text-white/40"><X className="w-5 h-5" /></button>
              </div>
          </div>
      </div>

      <audio ref={audioRef} onEnded={() => {
            if (playingAyah && playingAyah < (surahContent?.verses.length || 0)) {
                toggleAudio(playingAyah + 1);
                document.getElementById(`verse-${playingAyah + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else { setPlayingAyah(null); }
      }} />
    </div>
  );
}
