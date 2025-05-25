import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stroke Insight Analyzer",
  description:
    "Stroke Insight Analyzer is a full-stack web application for analyzing stroke risk from Excel datasets. Upload your patient data, run advanced machine learning predictions, and visualize stroke trends and risk factors with interactive charts.",
  keywords: [
    "stroke analysis",
    "stroke prediction",
    "machine learning",
    "healthcare analytics",
    "Excel medical data",
    "risk visualization",
    "Next.js",
    "Python backend",
    "data science",
    "medical AI",
  ],
  authors: [{ name: "Tien Dat", url: "https://github.com/TienDatCactus" }],
  creator: "Tien Dat",
  icons: {
    icon: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
    shortcut: "/favicon_io/favicon-32x32.png",
  },
  openGraph: {
    title: "Stroke Insight Analyzer",
    description:
      "Analyze stroke risk and trends from your medical Excel files using AI-powered predictions and interactive visualizations.",
    url: "stroke-analysis.vercel.app",
    siteName: "Stroke Insight Analyzer",
    images: [
      {
        url: "/images/pexels-diva-32171480.png",
        width: 1200,
        height: 630,
        alt: "Stroke Insight Analyzer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} 
         ${poppins.variable} font-poppins 
          antialiased relative h-full w-full bg-background`}
      >
        <div className="-z-10 absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
