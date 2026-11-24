/**
 * Pure Web Audio API Monterey coastal breeze & sanctuary harmonic pad synthesizer.
 * Zero external audio assets required; muted by default until explicitly enabled by the user.
 */
export interface CoastalSoundscapeController {
  stop: () => void;
}

export function startCoastalSoundscape(): CoastalSoundscapeController | null {
  if (typeof window === 'undefined') return null;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 1.4);
  master.connect(ctx.destination);

  // 1. Soft Pacific Ocean Surf (Pink-noise buffer + slow swell lowpass LFO)
  const bufferSize = ctx.sampleRate * 4;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
    b6 = white * 0.115926;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const surfFilter = ctx.createBiquadFilter();
  surfFilter.type = 'lowpass';
  surfFilter.frequency.setValueAtTime(320, ctx.currentTime);
  surfFilter.Q.setValueAtTime(0.7, ctx.currentTime);

  const swellLfo = ctx.createOscillator();
  swellLfo.type = 'sine';
  swellLfo.frequency.setValueAtTime(0.13, ctx.currentTime); // ~7.7s wave period
  const swellDepth = ctx.createGain();
  swellDepth.gain.setValueAtTime(140, ctx.currentTime);
  swellLfo.connect(swellDepth);
  swellDepth.connect(surfFilter.frequency);

  const surfGain = ctx.createGain();
  surfGain.gain.setValueAtTime(0.55, ctx.currentTime);

  noiseSource.connect(surfFilter);
  surfFilter.connect(surfGain);
  surfGain.connect(master);

  // 2. Warm Nocturnal Sanctuary Pad (Open Dmaj9 voicing, lowpass-filtered)
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.setValueAtTime(480, ctx.currentTime);
  padFilter.connect(master);

  const freqs = [73.42, 110.0, 146.83, 185.0, 220.0];
  const oscillators = freqs.map((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime((idx - 2) * 3.5, ctx.currentTime);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.12 / freqs.length, ctx.currentTime);
    osc.connect(oscGain);
    oscGain.connect(padFilter);
    osc.start();
    return osc;
  });

  noiseSource.start();
  swellLfo.start();

  return {
    stop: () => {
      try {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        setTimeout(() => {
          noiseSource.stop();
          swellLfo.stop();
          oscillators.forEach((o) => o.stop());
          void ctx.close();
        }, 380);
      } catch {
        void ctx.close();
      }
    },
  };
}
