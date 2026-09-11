import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MausamSetu Platform | MoES & AtmosIQ',
  description: 'Autonomous Meteorological Agent, Tactical GIS Command Deck & Disaster Mitigation System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-[#090d16] text-slate-100 antialiased overflow-hidden h-[100dvh]">
        {children}
      </body>
    </html>
  );
}
