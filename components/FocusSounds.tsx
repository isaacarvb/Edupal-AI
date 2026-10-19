"use client";
import { useEffect, useRef, useState } from "react";

// Focus sounds for the practice screen. The audio is generated in the browser
// with the Web Audio API (rain / brown / white noise) — no music files, no
// downloads, works offline. Default is OFF so nothing surprises anyone; the
// student's choice is remembered on this device.
type SoundMode = "off" | "rain" | "brown" | "white";

const STORAGE_KEY = "edupal_sound";
const VOLUME_KEY = "edupal_sound_vol";

const MODES: { id: SoundMode; label: string }[] = [
  { id: "off", label: "🔇 Off" },
  { id: "rain", label: "🌧 Rain" },
  { id: "brown", label: "🌊 Brown" },
  { id: "white", label: "💨 White" }
];

// Each noise gets its own ceiling so "White" never blasts and "Brown" is heard.
function modeMax(mode: SoundMode): number {
  if (mode === "brown") return 0.5;
  if (mode === "white") return 0.16;
  return 0.35; // rain
}

function makeNoiseBuffer(ctx: AudioContext, mode: Exclude<SoundMode, "off">): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * 3);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  if (mode === "brown") {
    // Random walk (deep rumble) — the classic "brown noise" for blocking out rooms.
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  } else {
    // White and rain both start flat; rain is shaped by filters below.
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

export default function FocusSounds() {
  const [mode, setMode] = useState<SoundMode>("off");
  const [vol, setVol] = useState(0.6);
  const [open, setOpen] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const modeRef = useRef<SoundMode>("off");

  function stopAudio() {
    if (srcRef.current) {
      try { srcRef.current.stop(); } catch { /* already stopped */ }
      try { srcRef.current.disconnect(); } catch { /* gone */ }
      srcRef.current = null;
    }
    gainRef.current = null;
  }

  function startAudio(m: SoundMode, volume: number) {
    stopAudio();
    if (m === "off") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctxRef.current) ctxRef.current = new AC();
    const ctx = ctxRef.current;
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, m);
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = volume * modeMax(m);
    let tail: AudioNode = src;
    if (m === "rain") {
      // Band-shaped white noise ≈ steady shower on a roof.
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 420;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 4200;
      src.connect(hp);
      hp.connect(lp);
      tail = lp;
    } else if (m === "brown") {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 750;
      src.connect(lp);
      tail = lp;
    }
    tail.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    srcRef.current = src;
    gainRef.current = gain;
    if (ctx.state === "suspended") void ctx.resume();
  }

  // Restore the remembered choice. Browsers block audio before the first tap,
  // so if the context is suspended we start it on the student's first tap.
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
    if (gainRef.current) gainRef.current.gain.value = v * modeMax(modeRef.current);
  }

  const active = mode !== "off";

  return (
    <>
      {open && (
        <div style={{ position: "fixed", left: 16, bottom: 80, zIndex: 190, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 12, width: 236, boxShadow: "0 8px 24px rgb(0 0 0 / 0.18)", color: "#1E242E" }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>🎧 Focus sounds</div>
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
          <div style={{ fontSize: 11, color: "#5F6E7F", marginTop: 4 }}>Plays on this screen only.</div>
        </div>
      )}
      <button aria-label="Focus sounds" onClick={() => setOpen((o) => !o)}
        style={{ position: "fixed", left: 16, bottom: 16, zIndex: 190, width: 52, height: 52, borderRadius: 999,
          border: "2px solid #1E242E", background: active ? "#0F766E" : "#fff", color: active ? "#fff" : "#1E242E",
          fontSize: 22, cursor: "pointer", boxShadow: "4px 4px 0 #1E242E" }}>
        {active ? "🔊" : "🔇"}
      </button>
    </>
  );
}
