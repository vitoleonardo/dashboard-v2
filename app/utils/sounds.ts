export const playSound = {
  success: () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        
        // Second tone for harmony
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc2.start(ctx.currentTime + 0.05);
        osc2.stop(ctx.currentTime + 0.25);
      } catch (e) {
        // Silently fail if audio is not supported
      }
    }
  },
  
  move: () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
      } catch (e) {
        // Silently fail
      }
    }
  },
};
