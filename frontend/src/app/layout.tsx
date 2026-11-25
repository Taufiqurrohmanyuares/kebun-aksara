import type { Metadata } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

const andika = Andika({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-andika",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kebun Aksara — Aplikasi belajar membaca dan berhitung untuk anak",
  description:
    "Kiko si kelinci menemani anak usia 4-8 tahun belajar huruf, angka, dan kata dalam sesi 10 menit sehari. Tanpa iklan dan tanpa skor yang menghukum.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={andika.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}