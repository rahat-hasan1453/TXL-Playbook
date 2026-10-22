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
        className="bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
