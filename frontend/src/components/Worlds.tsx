import ForestWorldScene from "./illustrations/ForestWorldScene";
import HillNumberScene from "./illustrations/HillNumberScene";
import RiverWordScene from "./illustrations/RiverWordScene";
import CaveAddScene from "./illustrations/CaveAddScene";
import PaperReveal from "./PaperReveal";

export default function Worlds() {
  return (
    <section id="dunia" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <PaperReveal className="max-w-[65ch] mb-10 sm:mb-12">
        <h2
          style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)" }}
          className="font-bold text-[var(--color-forest)] leading-[1.25]"
        >
          Empat dunia yang tumbuh bersama anak
        </h2>
        <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] mt-3">
          Tingkat kesulitan naik pelan saat anak lancar, dan turun saat anak butuh waktu.
        </p>
      </PaperReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. Hutan Huruf */}
        <PaperReveal delay={60} className="lg:col-span-7 lg:row-span-2 flex">
          <article
            style={{
              backgroundColor: "var(--color-leaf)",
              borderRadius: "34px 20px 30px 24px",
              boxShadow: "0 6px 0 var(--color-leaf-deep)",
            }}
            className="w-full paper-card-hover border-[3px] border-[var(--color-forest)] overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 sm:p-8">
              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5 sm:p-6 max-w-lg"
                style={{
                  borderRadius: "20px 14px 22px 16px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <h3 className="text-[24px] font-bold text-[var(--color-forest)]">
                  Hutan Huruf
                </h3>
                <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] mt-1.5">
                  Kenali bentuk dan bunyi huruf A sampai Z lewat cerita dan permainan menangkap huruf.
                </p>
              </div>
            </div>
            <div className="mt-auto pt-2">
              <ForestWorldScene />
            </div>
          </article>
        </PaperReveal>

        {/* 2. Bukit Angka */}
        <PaperReveal delay={160} className="lg:col-span-5 lg:row-span-2 flex">
          <article
            style={{
              backgroundColor: "var(--color-sun)",
              borderRadius: "22px 34px 24px 32px",
              boxShadow: "0 6px 0 var(--color-sun-deep)",
            }}
            className="w-full paper-card-hover border-[3px] border-[var(--color-forest)] overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 sm:p-7">
              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5"
                style={{
                  borderRadius: "16px 22px 14px 20px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <h3 className="text-[22px] font-bold text-[var(--color-forest)]">
                  Bukit Angka
                </h3>
                <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] mt-1.5">
                  Hitung buah-buahan di kebun dari 1 sampai 20.
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <HillNumberScene />
            </div>
          </article>
        </PaperReveal>

        {/* 3. Gua Tambah */}
        <PaperReveal delay={100} className="lg:col-span-5 flex">
          <article
            style={{
              backgroundColor: "var(--color-earth)",
              borderRadius: "26px 32px 20px 28px",
              boxShadow: "0 6px 0 var(--color-earth-deep)",
            }}
            className="w-full paper-card-hover border-[3px] border-[var(--color-forest)] overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6">
              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5"
                style={{
                  borderRadius: "18px 14px 20px 14px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <h3 className="text-[22px] font-bold text-[var(--color-forest)]">
                  Gua Tambah
                </h3>
                <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] mt-1.5">
                  Kumpulkan kristal warna-warni untuk belajar penjumlahan, tanpa hafalan kaku.
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <CaveAddScene />
            </div>
          </article>
        </PaperReveal>

        {/* 4. Sungai Kata */}
        <PaperReveal delay={200} className="lg:col-span-7 flex">
          <article
            style={{
              backgroundColor: "var(--color-river)",
              borderRadius: "20px 30px 26px 34px",
              boxShadow: "0 6px 0 var(--color-river-deep)",
            }}
            className="w-full paper-card-hover border-[3px] border-[var(--color-forest)] overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6">
              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5 max-w-xl"
                style={{
                  borderRadius: "14px 22px 16px 20px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <h3 className="text-[22px] font-bold text-[var(--color-forest)]">
                  Sungai Kata
                </h3>
                <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] mt-1.5">
                  Rangkai suku kata jadi kata, lalu bantu Kiko menyeberang.
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <RiverWordScene />
            </div>
          </article>
        </PaperReveal>
      </div>
    </section>
  );
}