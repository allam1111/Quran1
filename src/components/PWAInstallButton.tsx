"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "other">("other");

  useEffect(() => {
    // Platform detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) setPlatform("ios");

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("PWA prompt deferred");
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem("pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone || localStorage.getItem("pwa_installed") === "true") {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        localStorage.setItem("pwa_installed", "true");
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: show instructions
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-primary/90 text-black px-3 py-1.5 rounded-lg transition-all hover:bg-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/10 font-bold text-[10px] font-arabic"
      >
        <Download className="w-3 h-3" />
        <span>تثبيت</span>
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowInstructions(false)} />
            <div className="relative bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] max-w-sm w-full animate-in zoom-in duration-300 text-right overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <h3 className="text-xl font-bold text-white mb-6 font-arabic text-center">تثبيت تطبيق "قرآن"</h3>
                
                <div className="space-y-6 text-sm text-white/70 leading-relaxed font-arabic">
                    {platform === "ios" ? (
                        <>
                            <div className="flex items-center gap-3 justify-end">
                                <span>اضغط على زر <strong>المشاركة (Share)</strong> في المتصفح</span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">📤</div>
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <span>اختر <strong>إضافة إلى الشاشة الرئيسية</strong></span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">➕</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 justify-end">
                                <span>اضغط على <strong>القائمة (⋮)</strong> في المتصفح</span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">⋮</div>
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <span>اختر <strong>تثبيت التطبيق (Install)</strong></span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">📲</div>
                            </div>
                        </>
                    )}
                    <div className="pt-4 border-t border-white/5 text-center text-[10px] text-primary/60 font-medium">
                        سيظهر التطبيق كأيقونة على شاشتك للاستخدام السريع
                    </div>
                </div>

                <button 
                    onClick={() => setShowInstructions(false)}
                    className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition-all border border-white/5 text-xs"
                >
                    حسناً، فهمت
                </button>
            </div>
        </div>
      )}
    </>
  );
}
