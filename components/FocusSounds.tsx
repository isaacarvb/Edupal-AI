"use client";
import { useEffect, useRef, useState } from "react";

// Focus music for the practice screen: solemn, motivating study sounds made for
// reading — soft piano, calm strings and slow hymn chords. The music is
// generated live in the browser with the Web Audio API (no files, no downloads,
// no harsh repeats). Default is OFF; the student's choice is remembered here.
type SoundMode = "off" | "piano" | "strings" | "hymn";

const STORAGE_KEY = "edupal_sound";
const VOLUME_KEY = "edupal_sound_vol";

const MODES: { id: SoundMode; label: string }[] = [
  { id: "off", label: "🔇 Off" },
  { id: "piano", label: "🎹 Soft Piano" },
  { id: "strings", label: "🎻 Calm Strings" },
  { id: "hymn", label: "🕯️ Hymn" }
];

// Each style has its own ceiling so nothing ever blasts.
function modeMax(mode: SoundMode): number {
  if (mode === "piano") return 0.55;
  if (mode === "strings") return 0.4;
  if (mode === "hymn") return 0.5;
  return 0.3;
}

// Slow C-major progression, gentle on the ear: C – G – Am – F.
const CHORDS: number[][] = [
  [261.63, 329.63, 392.0], // C
  [196.0, 246.94, 293.66], // G
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63] // F
];

// Room-like echo built from a fading noise burst (no audio files needed).
function makeReverb(ctx: AudioContext): ConvolverNode {
  const len = Math.floor(ctx.sampleRate * 2.8);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3) * 0.5;
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

// One soft note: triangle body + quiet octave shimmer, slow attack, long decay.
function playNote(ctx: AudioContext, dest: AudioNode, freq: number, at: number, dur: number, vol: number) {
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = freq;
  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = freq * 2;
  const shGain = ctx.createGain();
  shGain.gain.value = 0.25;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), at + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(env);
  shimmer.connect(shGain);
  shGain.connect(env);
  env.connect(dest);
  o.start(at);
  o.stop(at + dur + 0.1);
  shimmer.start(at);
  shimmer.stop(at + dur + 0.1);
}

// Builds the music engine for one style. Returns a stop() that fades out.
function startEngine(ctx: AudioContext, mode: Exclude<SoundMode, "off">, master: GainNode) {
  const dry = ctx.createGain();
  dry.gain.value = 0.8;
  dry.connect(master);
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const conv = makeReverb(ctx);
  wet.connect(conv);
  conv.connect(master);

  const bus = ctx.createGain();
  bus.connect(dry);
  bus.connect(wet);

  // Warm pad: three gently detuned sines that glide between chords.
  const padGain = ctx.createGain();
  padGain.gain.value = 0.0001;
  const padLp = ctx.createBiquadFilter();
  padLp.type = "lowpass";
  padLp.frequency.value = 900;
  padGain.connect(padLp);
  padLp.connect(bus);
  const padOsc = CHORDS[0].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1) * 5;
    o.connect(padGain);
    o.start();
    return o;
  });
  const padLevel = mode === "strings" ? 0.14 : mode === "hymn" ? 0.05 : 0.06;
  padGain.gain.linearRampToValueAtTime(padLevel, ctx.currentTime + 3);

  let chordIdx = 0;
  const timers: number[] = [];
  const CHORD_SECONDS = mode === "strings" ? 10 : 8;

  function nextChord() {
    chordIdx = (chordIdx + 1) % CHORDS.length;
    const c = CHORDS[chordIdx];
    const t = ctx.currentTime;
    padOsc.forEach((o, i) => o.frequency.linearRampToValueAtTime(c[i], t + 2.5));
    if (mode === "hymn") {
      // Block chord, low and slow — like a quiet chapel.
      [0, 1, 2].forEach((i) => playNote(ctx, bus, c[i] / 2, t + 0.1, 6.5, 0.09));
    }
    if (mode === "piano") {
      // First gentle note of the chord, high and soft.
      const tones = [c[0] * 2, c[1] * 2, c[2] * 2, c[0] * 4];
      const f = tones[Math.floor(Math.random() * tones.length)];
      playNote(ctx, bus, f, t + 0.5 + Math.random(), 3, 0.12 * (0.7 + Math.random() * 0.3));
    }
  }
  nextChord();
  timers.push(window.setInterval(nextChord, CHORD_SECONDS * 1000));

  // Piano keeps a soft, unhurried conversation between chord changes.
  if (mode === "piano") {
    timers.push(
      window.setInterval(() => {
        const c = CHORDS[chordIdx];
        const tones = [c[0] * 2, c[1] * 2, c[2] * 2];
        const f = tones[Math.floor(Math.random() * tones.length)];
        playNote(ctx, bus, f, ctx.currentTime + 0.05, 2.8, 0.1 * (0.6 + Math.random() * 0.4));
      }, 2600)
    );
  }

  return {
    stop() {
      timers.forEach((t) => clearInterval(t));
      const t = ctx.currentTime;
      padGain.gain.cancelScheduledValues(t);
      padGain.gain.setValueAtTime(padGain.gain.value, t);
      padGain.gain.linearRampToValueAtTime(0.0001, t + 0.5);
      padOsc.forEach((o) => {
        try { o.stop(t + 0.7); } catch { /* already stopped */ }
      });
    }
  };
}

export default function FocusSounds() {
  const [mode, setMode] = useState<SoundMode>("off");
  const [vol, setVol] = useState(0.6);
  const [open, setOpen] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const engineRef = useRef<{ stop: () => void } | null>(null);
  const modeRef = useRef<SoundMode>("off");

  function stopAudio() {
    engineRef.current?.stop();
    engineRef.current = null;
    masterRef.current = null; // nodes fade themselves out; GC collects them
  }

  function startAudio(m: SoundMode, volume: number) {
    stopAudio();
    if (m === "off") return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!ctxRef.current) ctxRef.current = new AC();
      const ctx = ctxRef.current;
      const master = ctx.createGain();
      master.gain.value = volume * modeMax(m);
      master.connect(ctx.destination);
      masterRef.current = master;
      engineRef.current = startEngine(ctx, m, master);
      if (ctx.state === "suspended") void ctx.resume();
    } catch { /* audio unavailable — practice continues in peace */ }
  }

  // Restore the remembered choice. Browsers block audio before the first tap,
  // so if the context is suspended we start it on the student's first tap.
  // (Old saved values like "rain" no longer exist → treated as off.)
  useEffect(() => {
    let saved: SoundMode = "off";
    let volume = 0.6;
    try {
      const m = localStorage.getItem(STORAGE_KEY) as SoundMode | null;
      if (m && MODES.some((x) => x.id === m)) saved = m;
      const v = Number(localStorage.getItem(VOLUME_KEY));
      if (Number.isFinite(v) && v > 0 && v <= 1) volume = v;
    } catch { /* private mode: keep defaults */ }
    setVol(volume);
    if (saved !== "off") {
      setMode(saved);
      modeRef.current = saved;
      startAudio(saved, volume);
      const kick = () => { void ctxRef.current?.resume(); };
      document.addEventListener("pointerdown", kick);
      document.addEventListener("keydown", kick);
      return () => {
        document.removeEventListener("pointerdown", kick);
        document.removeEventListener("keydown", kick);
        stopAudio();
        void ctxRef.current?.close();
        ctxRef.current = null;
      };
    }
    return () => {
      stopAudio();
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  function pick(m: SoundMode) {
    modeRef.current = m;
    setMode(m);
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, m); } catch { /* ignore */ }
    if (m === "off") stopAudio();
    else startAudio(m, vol);
  }

  function changeVol(v: number) {
    setVol(v);
    try { localStorage.setItem(VOLUME_KEY, String(v)); } catch { /* ignore */ }
    if (masterRef.current) masterRef.current.gain.value = v * modeMax(modeRef.current);
  }

  const active = mode !== "off";

  return (
    <>
      {open && (
        <div style={{ position: "fixed", left: 16, bottom: 80, zIndex: 190, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 12, width: 244, boxShadow: "0 8px 24px rgb(0 0 0 / 0.18)", color: "#1E242E" }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>🎧 Focus music</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {MODES.map((m) => (
              <button key={m.id} onClick={() => pick(m.id === mode ? "off" : m.id)}
                style={{ fontSize: 13, padding: "6px 10px", borderRadius: 999, cursor: "pointer",
                  border: "1px solid " + (m.id === mode ? "#0F766E" : "#CBD5E1"),
                  background: m.id === mode ? "#0F766E" : "#fff",
                  color: m.id === mode ? "#fff" : "#1E242E", fontWeight: m.id === mode ? 800 : 500 }}>
                {m.label}
              </button>
            ))}
          </div>
          <label style={{ display: "block", fontSize: 12, color: "#5F6E7F", marginTop: 10 }}>
            Volume
            <input type="range" min={10} max={100} value={Math.round(vol * 100)}
              onChange={(e) => changeVol(Number(e.target.value) / 100)}
              style={{ width: "100%", accentColor: "#0F766E", marginTop: 4 }} />
          </label>
          <div style={{ fontSize: 11, color: "#5F6E7F", marginTop: 4 }}>Gentle study music. Plays on this screen only.</div>
        </div>
      )}
      <button aria-label="Focus music" onClick={() => setOpen((o) => !o)}
        style={{ position: "fixed", left: 16, bottom: 16, zIndex: 190, width: 52, height: 52, borderRadius: 999,
          border: "2px solid #1E242E", background: active ? "#0F766E" : "#fff", color: active ? "#fff" : "#1E242E",
          fontSize: 22, cursor: "pointer", boxShadow: "4px 4px 0 #1E242E" }}>
        {active ? "🎵" : "🔇"}
      </button>
    </>
  );
}
