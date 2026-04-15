"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, List, Search, Headphones, Repeat, Shuffle, ChevronDown, User } from "lucide-react";
import surahsData from "@/data/surahs.json";

const RECITERS = [
  { id: "afs", name: "مشاري العفاسي", server: "server8.mp3quran.net/afs" },
  { id: "basit", name: "عبد الباسط عبد الصمد", server: "server7.mp3quran.net/basit" },
  { id: "maher", name: "ماهر المعيقلي", server: "server12.mp3quran.net/maher" },
  { id: "minsh", name: "محمد صديق المنشاوي", server: "server6.mp3quran.net/minsh" },
  { id: "s_gmd", name: "سعد الغامدي", server: "server7.mp3quran.net/s_gmd" },
  { id: "husr", name: "محمود خليل الحصري", server: "server13.mp3quran.net/husr" },
  { id: "shur", name: "سعود الشريم", server: "server7.mp3quran.net/shur" },
  { id: "sds", name: "عبد الرحمن السديس", server: "server11.mp3quran.net/sds" },
  { id: "yasser", name: "ياسر الدوسري", server: "server11.mp3quran.net/yasser" },
  { id: "ajm", name: "أحمد العجمي", server: "server10.mp3quran.net/ajm" },
  { id: "frs_a", name: "فارس عباد", server: "server8.mp3quran.net/frs_a" },
];

export function AudioLibrary() {
  const [currentSurah, setCurrentSurah] = useState(surahsData[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showList, setShowList] = useState(false);
  const [showReciters, setShowReciters] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedReciter = localStorage.getItem("audio_library_reciter_id");
    const savedShuffle = localStorage.getItem("audio_library_shuffle");
    const savedRepeat = localStorage.getItem("audio_library_repeat");

    if (savedReciter) {
      const r = RECITERS.find(x => x.id === savedReciter);
      if (r) setSelectedReciter(r);
    }
    if (savedShuffle) setIsShuffle(savedShuffle === "true");
    if (savedRepeat) setIsRepeat(savedRepeat === "true");
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("audio_library_reciter_id", selectedReciter.id);
      localStorage.setItem("audio_library_shuffle", String(isShuffle));
      localStorage.setItem("audio_library_repeat", String(isRepeat));
    }
  }, [selectedReciter, isShuffle, isRepeat, mounted]);

  // Sync audio source with current selection
  useEffect(() => {
    if (audioRef.current) {
      const id = currentSurah.id.toString().padStart(3, '0');
      const newSrc = `https://${selectedReciter.server}/${id}.mp3`;
      if (audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;
      }
    }
  }, [currentSurah, selectedReciter]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); }
    else { audioRef.current.play().catch(() => {}); }
  };

  const playSurah = (surah: any) => {
    setCurrentSurah(surah);
    setShowList(false);
    if (audioRef.current) {
      const id = surah.id.toString().padStart(3, '0');
      audioRef.current.src = `https://${selectedReciter.server}/${id}.mp3`;
      audioRef.current.play().catch(() => {});
    }
  };

  const nextSurah = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * surahsData.length);
      playSurah(surahsData[randomIndex]);
    } else {
      const nextIndex = currentSurah.id; // currentSurah.id is 1-indexed, next index is surah.id which is currentSurah.id
      if (nextIndex < 114) {
        playSurah(surahsData[nextIndex]);
      } else {
        playSurah(surahsData[0]); // Loop back to Fatiha
      }
    }
  };

  const prevSurah = () => {
    const prevIndex = currentSurah.id - 2; 
    if (prevIndex >= 0) {
      playSurah(surahsData[prevIndex]);
    } else {
      playSurah(surahsData[113]); // Go to Nas
    }
  };

  const changeReciter = (reciter: typeof RECITERS[0]) => {
    setSelectedReciter(reciter);
    setShowReciters(false);
    if (audioRef.current) {
      const id = currentSurah.id.toString().padStart(3, '0');
      audioRef.current.src = `https://${reciter.server}/${id}.mp3`;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  const fmt = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const filteredSurahs = surahsData.filter(s => 
    s.name.includes(search) || s.transliteration.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#050505] overflow-hidden relative font-arabic">
      
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Controls */}
      <header className="shrink-0 p-6 flex items-center justify-between relative z-20">
        <button onClick={() => setShowReciters(!showReciters)}
          className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all">
          <User className="w-4 h-4 text-primary" />
          <span className="text-white text-sm font-bold">{selectedReciter.name}</span>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </button>
        <button onClick={() => setShowList(!showList)}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white backdrop-blur-xl">
          <List className="w-5 h-5" />
        </button>
      </header>

      {/* Main Player */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 overflow-y-auto no-scrollbar overscroll-contain py-10">
        
        {/* Cover Art */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-40" />
          <div 
            className="aspect-[3/4] w-56 md:w-72 bg-[#050505] rounded-[2.5rem] border-l-[8px] border-[#d4af37] shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center justify-center p-3"
            style={{
                backgroundImage: "url('/library-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-4 border-2 border-[#d4af37]/15 rounded-[1.5rem]" />
            <div className="relative z-10 w-28 h-28 border border-[#d4af37]/20 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-md">
              <span className="text-3xl font-bold text-black font-arabic">{currentSurah.name}</span>
            </div>
            {isPlaying && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-[3px] h-4 items-end">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-[3px] bg-primary rounded-full animate-bounce" 
                    style={{ height: `${8 + Math.random()*8}px`, animationDelay: `${i*0.12}s`, animationDuration: '0.6s' }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Surah Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">سورة {currentSurah.name}</h2>
          <p className="text-primary/50 text-[10px] font-bold uppercase tracking-[0.2em]">{currentSurah.transliteration} • {selectedReciter.name}</p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-lg mb-6">
          <input type="range" min="0" max="100" value={progress} onChange={handleSeek}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" />
          <div className="flex justify-between mt-3 text-[10px] text-white/30 font-mono font-bold tracking-wider">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-10">
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition-all ${isShuffle ? 'text-primary' : 'text-white/20'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          
          <button onClick={prevSurah} className="text-white/50 hover:text-white active:scale-90 transition-all">
            <SkipBack className="w-7 h-7" />
          </button>
          
          <button onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_15px_40px_rgba(212,175,55,0.3)] hover:scale-110 active:scale-95 transition-all">
            {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1" />}
          </button>
          
          <button onClick={nextSurah} className="text-white/50 hover:text-white active:scale-90 transition-all">
            <SkipForward className="w-7 h-7" />
          </button>
          
          <button 
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition-all ${isRepeat ? 'text-primary' : 'text-white/20'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Reciter Selection Dropdown */}
      {showReciters && (
        <div className="fixed inset-0 z-50" onClick={() => setShowReciters(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div className="absolute top-24 left-6 right-6 md:left-auto md:right-auto md:w-[400px] md:top-20 md:left-6 bg-[#0a0a0a] border border-white/10 rounded-3xl p-4 max-h-[60vh] overflow-y-auto no-scrollbar shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-primary text-sm font-bold mb-4 px-4 pt-2">اختر القارئ</h3>
            {RECITERS.map(r => (
              <button key={r.id} onClick={() => changeReciter(r)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl mb-1 transition-all ${selectedReciter.id === r.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/60 hover:bg-white/5'}`}>
                <span className="font-bold text-sm">{r.name}</span>
                {selectedReciter.id === r.id && <div className="w-2 h-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Surah List Sheet */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${showList ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowList(false)} />
        <div className={`absolute bottom-0 left-0 right-0 h-[80vh] bg-[#0a0a0a] rounded-t-[3rem] border-t border-white/10 flex flex-col p-6 pb-28 transition-transform duration-500 ${showList ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6" />
          <div className="relative mb-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن سورة..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white outline-none focus:border-primary/50 text-right" />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain space-y-2">
            {filteredSurahs.map(surah => (
              <button key={surah.id} onClick={() => playSurah(surah)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${currentSurah.id === surah.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${currentSurah.id === surah.id ? 'bg-primary text-black' : 'bg-white/5 text-white/40'}`}>
                    {surah.id}
                  </div>
                  <span className={`text-sm font-bold ${currentSurah.id === surah.id ? 'text-primary' : 'text-white'}`}>{surah.transliteration}</span>
                </div>
                <span className={`text-xl ${currentSurah.id === surah.id ? 'text-primary' : 'text-white/50'}`}>{surah.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <audio ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={nextSurah}
      />
    </div>
  );
}
