import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "قرآن",
    template: "%s | قرآن"
  },
  description: "استوديو احترافي لتصميم فيديوهات القرآن الكريم، الاستماع للمشايخ، متابعة مواقيت الصلاة، وقراءة الورد اليومي. كل ما تحتاجه في تطبيق واحد وبجودة عالية.",
  authors: [{ name: "قرآن" }],
  creator: "قرآن",
  publisher: "قرآن",
  keywords: [
    "قرآن", "قرآن كريم", "فيديوهات قرآن", "صانع فيديوهات القرآن", "تطبيق قرآن", 
    "مواقيت الصلاة", "المكتبة الصوتية", "العفاسي", "المنشاوي", "تصميم قرآن", "Video Editor",
    "Quran", "Quran Studio", "Quran Video Maker", "Prayer Times", "Islamic App", "Holy Quran"
  ],
  openGraph: {
    title: "قرآن",
    description: "استوديو احترافي لتصميم فيديوهات القرآن الكريم، الاستماع للمشايخ، ومتابعة مواقيت الصلاة.",
    siteName: "قرآن",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "قرآن",
    description: "صمم فيديوهات القرآن الخاصة بك وتابع وردك اليومي بسهولة.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "قرآن",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { EditorProvider } from "@/store/useEditor";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <EditorProvider>
          {children}
        </EditorProvider>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful');
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
