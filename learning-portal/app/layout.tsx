import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TXL Learning & Competency Portal",
  description: "Track your learning progress through the TXL Playbook What to Learn curriculum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#0a0a0c] text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
