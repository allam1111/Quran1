"use client";

import React from "react";
import { 
  AbsoluteFill, 
  interpolate, 
  useCurrentFrame, 
  useVideoConfig, 
  Video,
  Audio,
  Sequence,
  Easing,
  staticFile
} from "remotion";

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  const videoExtensions = /\.(mp4|webm|mov|ogg|m4v|3gp|flv|avi)(\?.*|#.*)?$/i;
  return videoExtensions.test(url) || url.includes("pexels.com/video") || url.includes("vimeo.com/external") || url.includes("videos.pexels.com");
};

/**
 * Resolve a media source for Remotion:
 * - If it's a URL (starts with http), use it directly
 * - If it's a relative path, use staticFile() which serves from public/
 * - If it's an absolute path, use it directly (local files)
 */
function resolveMedia(src?: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {
    return src;
  }
  // For local files: use staticFile to serve from public/
  return staticFile(src);
}

interface Verse {
  id: number;
  text: string;
  translation: string;
  audio: string; // per-verse audio URL or local path
}

interface MainVideoProps {
  surahName: string;
  verses: Verse[];
  backgroundUrl: string;
  audioUrl?: string;
  textColor: string;
  fontSize: number;
}

export const MainVideo: React.FC<MainVideoProps> = ({
  surahName,
  verses = [],
  backgroundUrl,
  textColor = "#ffffff",
  fontSize = 60
}) => {
  const { durationInFrames } = useVideoConfig();

  const resolvedBg = resolveMedia(backgroundUrl);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 1. Background Layer */}
      <AbsoluteFill style={{ backgroundColor: 'black' }} />
      {resolvedBg && (
        isVideoUrl(backgroundUrl) ? (
          <Video 
            src={resolvedBg}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: 0.5
            }}
            muted
            loop
            crossOrigin="anonymous"
            onError={(e) => console.error("Video Background Error:", e)}
          />
        ) : (
          <AbsoluteFill style={{
            backgroundImage: `url(${resolvedBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
          }} />
        )
      )}
      
      {/* 2. Overlays */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent, rgba(0,0,0,0.5))'
      }} />

      {/* 3. Sequential Verse Content & Audio */}
      <AbsoluteFill>
        {verses.map((verse, index) => {
          const verseDuration = Math.floor(durationInFrames / (verses.length || 1));
          const startFrame = index * verseDuration;
          // Last verse gets any remaining frames to avoid rounding issues
          const actualDuration = index === verses.length - 1 
            ? durationInFrames - startFrame 
            : verseDuration;
          
          const resolvedAudio = resolveMedia(verse.audio);
          
          return (
            <Sequence key={verse.id} from={startFrame} durationInFrames={actualDuration}>
              {/* Audio for this specific verse */}
              {resolvedAudio && <Audio src={resolvedAudio} />}
              
              <VerseComponent 
                verse={verse} 
                surahName={surahName} 
                textColor={textColor} 
                fontSize={fontSize} 
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VerseComponent = ({ verse, surahName, textColor, fontSize }: { verse: Verse, surahName: string, textColor: string, fontSize: number }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    
    // Pro Fix: Ensure fade frames don't overlap if the duration is too short
    const fadeFrames = Math.min(15, Math.floor(durationInFrames / 3));
    
    const opacity = interpolate(
        frame, 
        [0, fadeFrames, Math.max(fadeFrames + 1, durationInFrames - fadeFrames), durationInFrames], 
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    
    const scale = interpolate(
        frame,
        [0, durationInFrames],
        [1, 1.08],
        { easing: Easing.out(Easing.quad) }
    );

    return (
        <div style={{ 
            height: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px', 
            opacity, 
            transform: `scale(${scale})`,
            padding: '100px',
            textAlign: 'center'
        }}>
            <div style={{ 
                color: '#D4AF37', 
                fontSize: '24px', 
                fontWeight: 700,
                letterSpacing: '8px',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(212,175,55,0.3)'
            }}>
                {surahName}
            </div>

            <p style={{ 
                color: textColor, 
                fontSize: `${fontSize * 1.6}px`, 
                fontFamily: 'serif',
                direction: 'rtl',
                textAlign: 'center',
                width: '100%',
                lineHeight: 1.5,
                textShadow: '0 15px 45px rgba(0,0,0,0.9)',
                margin: 0
            }}>
                {verse.text}
            </p>

            <div style={{ 
                width: '160px', 
                height: '4px', 
                background: 'linear-gradient(to right, transparent, #D4AF37, #D4AF37, transparent)', 
                opacity: 0.8
            }} />

            <p style={{ 
                color: 'white', 
                fontSize: '38px', 
                opacity: 0.95,
                fontWeight: 500,
                textAlign: 'center',
                width: '100%',
                lineHeight: 1.4,
                textShadow: '0 5px 20px rgba(0,0,0,0.6)'
            }}>
                {verse.translation}
            </p>
        </div>
    );
}
