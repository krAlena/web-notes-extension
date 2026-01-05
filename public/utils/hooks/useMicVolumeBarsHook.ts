import { useEffect, useRef, useState } from "react";

export default function useMicVolume(isActive: boolean) {
  const [volume, setVolume] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive) {
      cleanup();
      setVolume(0);
      return;
    }

    let mounted = true;

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);

      source.connect(analyser);

      const loop = () => {
        if (!mounted || !analyserRef.current || !dataRef.current) return;

        analyserRef.current.getByteFrequencyData(dataRef.current);

        const avg =
          dataRef.current.reduce((a, b) => a + b, 0) /
          dataRef.current.length;

        setVolume(avg / 255); // normalize 0–1
        rafRef.current = requestAnimationFrame(loop);
      };

      loop();
    };

    start();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [isActive]);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());

    audioCtxRef.current = null;
    analyserRef.current = null;
    dataRef.current = null;
  };

  return volume;
}
