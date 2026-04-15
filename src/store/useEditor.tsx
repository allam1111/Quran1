"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface EditorState {
  view: "video" | "mushaf" | "prayers" | "library";
  surahId: string;
  startAyah: number;
  endAyah: number;
  backgroundUrl: string;
  reciterId: string;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  bookmark?: { surahId: string; ayahId: number };
}

interface EditorContextType {
  state: EditorState;
  updateState: (updates: Partial<EditorState>) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>({
    view: "video",
    surahId: "1",
    startAyah: 1,
    endAyah: 7,
    backgroundUrl: "https://videos.pexels.com/video-files/4458517/4458517-hd_1080_1920_25fps.mp4",
    reciterId: "afasy",
    textColor: "#ffffff",
    fontSize: 50,
    fontWeight: 700,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage only on client after mount
    const saved = localStorage.getItem("quran_editor_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save to localStorage whenever state changes, but only after loading initial state
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("quran_editor_state", JSON.stringify(state));
    }
  }, [state, mounted]);

  const updateState = (updates: Partial<EditorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <EditorContext.Provider value={{ state, updateState }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used within EditorProvider");
  return context;
}
