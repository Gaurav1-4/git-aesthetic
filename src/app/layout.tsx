import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitAesthetic - The 1-Click GitHub Profile Engine",
  description:
    "Design, customize, and automatically deploy high-end animated GitHub profiles in 1 click.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0d1117] text-neutral-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
