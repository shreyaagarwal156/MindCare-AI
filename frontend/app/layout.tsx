import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "MindCare AI — Premium AI Mental Health Assistant",
  description: "Experience modern, HIPAA-compliant mental health support driven by custom BERT sequence classifiers and Llama 3.2 models. Real-time mood analysis, clinical summaries, and personalized support.",
  openGraph: {
    title: "MindCare AI — Premium AI Mental Health Companion",
    description: "Get real-time mood analysis, clinically styled report compiling, and direct crisis overrides using our advanced hybrid LLM mental health workspace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
