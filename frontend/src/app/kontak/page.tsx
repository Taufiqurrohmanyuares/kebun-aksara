import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KontakPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-forest)]">
          Kontak
        </h1>
        <p className="text-[18px] leading-[1.6] max-w-[65ch]">
          Untuk pertanyaan seputar penggunaan aplikasi oleh orang tua maupun sekolah, hubungi kami melalui pos-el di halo@kebunaksara.id.
        </p>
        <Link
          href="/"
          className="min-h-[48px] inline-flex items-center font-bold text-[18px] text-[var(--color-forest)] underline underline-offset-4"
        >
          Kembali ke halaman utama
        </Link>
      </main>
      <Footer />
    </div>
  );
}