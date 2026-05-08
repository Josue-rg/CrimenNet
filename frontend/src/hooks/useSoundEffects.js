import { useCallback, useRef } from 'react';

// Hook para efectos de sonido suaves
const useSoundEffects = () => {
  const audioContextRef = useRef(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Efecto de click suave
  const playClickSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }, [initAudioContext]);

  // Efecto de hover suave
  const playHoverSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (error) {
      console.error('Error playing hover sound:', error);
    }
  }, [initAudioContext]);

  // Efecto de éxito
  const playSuccessSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  }, [initAudioContext]);

  // Efecto de error
  const playErrorSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing error sound:', error);
    }
  }, [initAudioContext]);

  // Efecto de notificación
  const playNotificationSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1); // C#6

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [initAudioContext]);

  // Efecto de typing/terminal
  const playTypingSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1200 + Math.random() * 200, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.02);
    } catch (error) {
      console.error('Error playing typing sound:', error);
    }
  }, [initAudioContext]);

  // Efecto de scanner
  const playScannerSound = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
      oscillator.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.6);

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.6);
    } catch (error) {
      console.error('Error playing scanner sound:', error);
    }
  }, [initAudioContext]);

  return {
    playClickSound,
    playHoverSound,
    playSuccessSound,
    playErrorSound,
    playNotificationSound,
    playTypingSound,
    playScannerSound
  };
};

export default useSoundEffects;
