"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, MapPin, Bell, BellOff, Volume2, Settings2, User, Check, Play, Pause } from "lucide-react";

interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

const MUEZZINS = [
  { id: "haram", name: "أذان الحرم المكي", file: "/adhan/الحرم المكي.mp3" },
  { id: "naqshandi", name: "الشيخ سيد النقشبندي", file: "/adhan/الشيخ سيد النقشبندى.p3.mp3" },
  { id: "rifat", name: "الشيخ محمد رفعت", file: "/adhan/الشيخ محمد رفعت.mp3" },
];

export function PrayerTimes() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  
  // Per-prayer configuration
  const [configs, setConfigs] = useState<Record<string, { enabled: boolean; muezzin: string }>>({
    Fajr: { enabled: true, muezzin: "makkah" },
    Dhuhr: { enabled: true, muezzin: "cairo" },
    Asr: { enabled: true, muezzin: "cairo" },
    Maghrib: { enabled: true, muezzin: "madinah" },
    Isha: { enabled: true, muezzin: "afasy" },
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingTest, setIsPlayingTest] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimes() {
      try {
        const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5");
        const data = await res.json();
        setTimes(data.data.timings);
      } catch (err) {
        console.error("Failed to fetch prayer times", err);
      }
    }
    fetchTimes();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerNamesAr: Record<string, string> = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  };

  const handleToggle = (id: string) => {
    setConfigs(prev => ({
        ...prev,
        [id]: { ...prev[id], enabled: !prev[id].enabled }
    }));
  };

  const handleChangeMuezzin = (prayerId: string, muezzinId: string) => {
    setConfigs(prev => ({
        ...prev,
        [prayerId]: { ...prev[prayerId], muezzin: muezzinId }
    }));
  };

  const testAdhan = (muezzinId: string) => {
     if (isPlayingTest === muezzinId) {
        audioRef.current?.pause();
        setIsPlayingTest(null);
     } else {
        const m = MUEZZINS.find(x => x.id === muezzinId);
        if (m && audioRef.current) {
            audioRef.current.src = m.file; // Fixed: from m.url to m.file
            audioRef.current.play().catch(e => console.error("Adhan preview failed", e));
            setIsPlayingTest(muezzinId);
        }
     }
  };

  const getNextPrayer = () => {
    if (!times) return null;
    const now = new Date();
    const list = Object.entries(prayerNamesAr).map(([id, name]) => {
      const [h, m] = (times[id as keyof PrayerTimes] as string).split(':').map(Number);
      const d = new Date(now);
      d.setHours(h, m, 0, 0);
      return { id, name, date: d };
    });

    let next = list.find(p => p.date > now);
    if (!next) {
      next = { ...list[0], date: new Date(list[0].date.getTime() + 24 * 60 * 60 * 1000) };
    }

    const diff = next.date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { 
      ...next, 
      remaining: `${hours}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}` 
    };
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 md:p-12 animate-in slide-in-from-right duration-700 overflow-y-auto no-scrollbar overscroll-contain pb-32">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-12">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10">
            <div className="text-right">
                <div className="flex items-center gap-2 text-primary/60 mb-2 justify-end">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">توقيت القاهرة، مصر</span>
                </div>
                <h1 className="text-5xl font-bold text-white font-mono tracking-tighter">
                   {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h1>
            </div>

            {nextPrayer && (
              <div className="flex-1 flex flex-col items-center px-8 border-x border-white/5">
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-1">الصلاة القادمة: {nextPrayer.name}</p>
                <p className="text-white text-3xl font-mono font-bold tracking-widest">
                  -{nextPrayer.remaining}
                </p>
              </div>
            )}

            <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4">
                <div className="text-right">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">اليوم</p>
                    <p className="text-white font-bold">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>
        </div>

        {/* Prayers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {times && Object.entries(prayerNamesAr).map(([id, name]) => {
                const time = times[id as keyof PrayerTimes];
                const config = configs[id];
                const activeMuezzin = MUEZZINS.find(m => m.id === config.muezzin);

                return (
                    <div key={id} className={`relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 transition-all duration-500 overflow-hidden ${activeSettings === id ? 'ring-2 ring-primary/50' : ''}`}>
                        <div className="flex items-center justify-between mb-6">
                            <button 
                                onClick={() => setActiveSettings(activeSettings === id ? null : id)}
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                            >
                                <Settings2 className="w-5 h-5" />
                            </button>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-white font-arabic">{name}</h3>
                                <p className="text-primary text-3xl font-mono font-bold mt-1">{time}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleToggle(id)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${config.enabled ? 'bg-primary' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.enabled ? 'right-7' : 'right-1'}`} />
                                </button>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{config.enabled ? 'On' : 'Off'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/30 truncate max-w-[150px]">
                                <span className="text-[11px] font-bold font-arabic">{activeMuezzin?.name}</span>
                                <User className="w-3 h-3" />
                            </div>
                        </div>

                        {/* Settings Overlay Dropdown */}
                        {activeSettings === id && (
                            <div className="absolute inset-0 bg-black/95 backdrop-blur-md p-6 z-10 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                    <button onClick={() => setActiveSettings(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                                    <h4 className="text-sm font-bold font-arabic text-primary">إعدادات أذان {name}</h4>
                                </div>
                                <div className="space-y-2 overflow-y-auto max-h-[180px] no-scrollbar">
                                    {MUEZZINS.map((m) => (
                                        <div key={m.id} className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleChangeMuezzin(id, m.id)}
                                                className={`flex-1 flex items-center justify-between p-3 rounded-xl transition-all ${config.muezzin === m.id ? 'bg-primary/20 border border-primary/40 text-primary' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                            >
                                                {config.muezzin === m.id && <Check className="w-4 h-4" />}
                                                <span className="text-xs font-bold font-arabic">{m.name}</span>
                                            </button>
                                            <button 
                                                onClick={() => testAdhan(m.id)}
                                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40"
                                            >
                                                {isPlayingTest === m.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

      </div>
      <audio ref={audioRef} onEnded={() => setIsPlayingTest(null)} />
    </div>
  );
}

function X({ className, ...props }: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}
