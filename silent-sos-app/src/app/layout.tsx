import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silent SOS — Discreet Personal Safety & Emergency Dispatch",
  description:
    "Send silent, non-verbal emergency alerts with permission-based live GPS telemetry to your trusted contacts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-obsidian text-slate-100 antialiased selection:bg-rose-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

