"use client";

import { useState, useEffect } from "react";

interface Verse {
  id: number;
  text: string;
  translation: string;
}

interface SurahData {
  id: number;
  name: string;
  transliteration: string;
  verses: Verse[];
}

export function useSurahData(surahId: string) {
  const [data, setData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surahId) return;

    async function fetchSurah() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/${surahId}.json`);
        if (!response.ok) throw new Error("Failed to fetch surah data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchSurah();
  }, [surahId]);

  return { data, loading, error };
}
