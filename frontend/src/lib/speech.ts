// Web Speech API & Web Audio Manager untuk Maskot Kiko

type SpeakingListener = (isSpeaking: boolean) => void;
const listeners: Set<SpeakingListener> = new Set();
let isCurrentlySpeaking = false;

function notifySpeaking(state: boolean) {
  isCurrentlySpeaking = state;
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      // Abaikan jika listener sudah di-unmount
    }
  });
}

export function onKikoSpeakingChange(callback: SpeakingListener): () => void {
  listeners.add(callback);
  callback(isCurrentlySpeaking);
  return () => {
    listeners.delete(callback);
  };
}

export function speakIndonesian(text: string, force = false): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  if (force) {
    window.speechSynthesis.cancel();
    notifySpeaking(false);
  }

  if (!text || text.trim().length === 0) return;

  const cleanText = text.replace(/[*_#]/g, "").trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "id-ID";
  utterance.rate = 0.9; // Sedikit lebih santai untuk anak usia dini
  utterance.pitch = 1.2; // Nada ramah & ceria

  // Cari suara Bahasa Indonesia jika tersedia di browser
  const voices = window.speechSynthesis.getVoices();
  const indonesianVoice = voices.find(
    (v) => v.lang.startsWith("id") || v.lang.includes("ID")
  );
  if (indonesianVoice) {
    utterance.voice = indonesianVoice;
  }

  utterance.onstart = () => {
    notifySpeaking(true);
  };

  utterance.onend = () => {
    notifySpeaking(false);
  };

  utterance.onerror = () => {
    notifySpeaking(false);
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    notifySpeaking(false);
  }
}

// Efek audio sintetis ramah anak (Web Audio API - tanpa aset eksternal & tanpa suara hukuman)
export type KikoSoundType =
  | "happy"
  | "encourage"
  | "correct"
  | "giggle"
  | "retry"
  | "celebrate";

export function playKikoSound(type: KikoSoundType): void {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "celebrate") {
      // Arpeggio perayaan kemenangan ceria (C5 -> E5 -> G5 -> C6)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.5, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === "correct" || type === "happy") {
      // Akord ceria naik (C5 -> E5 -> G5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "retry" || type === "encourage") {
      // Zero Punishment: nada lembut penuh penyemangat (bukan buzzer negatif)
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(493.88, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Nada kelinci tertawa kecil (giggle)
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.08);
      osc.frequency.setValueAtTime(650, now + 0.16);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Abaikan jika browser membatasi autoplay audio
  }
}

