/**
 * Web Audio API Sound Synthesizer for Ink-Wash Cultivation
 * 禪意水墨修仙實時音效合成器 (無任何外部音訊依賴)
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    // Check saved preferences
    const savedMute = localStorage.getItem('yinian_sound_enabled');
    if (savedMute !== null) {
      this.soundEnabled = savedMute === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('yinian_sound_enabled', String(this.soundEnabled));
    if (this.soundEnabled) {
      this.play('click');
    }
    return this.soundEnabled;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public play(type: 'click' | 'breakthrough' | 'tribulation' | 'battle' | 'alchemy' | 'hatch' | 'reward') {
    if (!this.soundEnabled) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(this.ctx.destination);

      if (type === 'click') {
        // 木魚 / 幽潭落水聲
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'breakthrough') {
        // 古剎銅鐘鳴響 (複合諧波)
        [220, 440, 660, 880].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 2.2);

          const initialGain = 0.3 / (idx + 1);
          gain.gain.setValueAtTime(initialGain, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 2.2);
        });
      } else if (type === 'tribulation') {
        // 天劫雷鳴與電弧裂響
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        whiteNoise.start(now);
      } else if (type === 'battle') {
        // 凌厲劍氣破空聲
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'alchemy') {
        // 鼎爐開爐仙音
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const delay = idx * 0.08;
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.18, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + delay);
          osc.stop(now + delay + 0.5);
        });
      } else if (type === 'hatch') {
        // 仙靈出世清鳴
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'reward') {
        // 機緣造化音
        [440, 554.37, 659.25].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const delay = idx * 0.06;
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.15, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + delay);
          osc.stop(now + delay + 0.35);
        });
      }
    } catch {
      // AudioContext could fail on un-interacted DOM, ignore gracefully
    }
  }
}

export const sound = new SoundManager();
