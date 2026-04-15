"use client";

import React, { useEffect, useState } from "react";
import surahsData from "@/data/surahs.json";
import { useEditor } from "@/store/useEditor";

export function SurahSelector() {
  const { state, updateState } = useEditor();
  const [maxVerses, setMaxVerses] = useState(7);

  useEffect(() => {
    const surah = surahsData.find(s => s.id.toString() === state.surahId);
    if (surah) {
      setMaxVerses(surah.total_verses);
      let updates: Partial<{ startAyah: number; endAyah: number }> = {};

      if (state.startAyah < 1) {
        updates.startAyah = 1;
      }

      if (state.startAyah > surah.total_verses) {
        updates.startAyah = surah.total_verses;
      }

      if (state.endAyah < state.startAyah) {
        updates.endAyah = state.startAyah;
      }

      if (state.endAyah > surah.total_verses) {
        updates.endAyah = surah.total_verses;
      }

      if (Object.keys(updates).length > 0) {
        updateState(updates);
      }
    }
  }, [state.surahId, state.startAyah, state.endAyah, updateState]);

  const [startInput, setStartInput] = useState(state.startAyah.toString());
  const [endInput, setEndInput] = useState(state.endAyah.toString());

  // Sync back if global state changes (e.g. surah changed)
  useEffect(() => {
    setStartInput(state.startAyah.toString());
    setEndInput(state.endAyah.toString());
  }, [state.startAyah, state.endAyah]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">السورة</label>
        <div className="relative group">
          <select 
            value={state.surahId}
            onChange={(e) => updateState({ surahId: e.target.value })}
            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none appearance-none cursor-pointer text-sm font-bold text-white transition-all shadow-inner"
          >
            {surahsData.map((s) => (
              <option key={s.id} value={s.id.toString()} className="bg-slate-950 text-white">
                {s.id}. {s.name} ({s.transliteration})
              </option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40 group-hover:text-primary/70 transition-colors">
            <div className="w-2 h-2 border-b-2 border-l-2 border-current -rotate-45" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-widest text-white/40 mr-1 font-bold">بداية المقطع</label>
          <div className="relative group">
            <input 
              type="number" 
              min="1"
              max={maxVerses}
              value={startInput}
              onChange={(e) => {
                setStartInput(e.target.value);
                const value = parseInt(e.target.value, 10);
                if (!Number.isNaN(value) && value > 0 && value <= maxVerses) {
                  updateState({ startAyah: value });
                }
              }}
              className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-white shadow-inner"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-widest text-white/40 mr-1 font-bold">نهاية المقطع</label>
          <div className="relative group">
            <input 
              type="number" 
              min="1"
              max={maxVerses}
              value={endInput}
              onChange={(e) => {
                setEndInput(e.target.value);
                const value = parseInt(e.target.value, 10);
                if (!Number.isNaN(value) && value > 0 && value <= maxVerses) {
                  updateState({ endAyah: value });
                }
              }}
              className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-white shadow-inner"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">
          إجمالي الآيات: {state.endAyah - state.startAyah + 1}
        </p>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      
      <p className="text-[9px] text-muted-foreground text-center">سيتم إنشاء فيديو يحتوي على {state.endAyah - state.startAyah + 1} آيات متتالية</p>
    </div>
  );
}
