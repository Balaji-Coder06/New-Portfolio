import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Music, Disc } from 'lucide-react';

const AUDIO_SRC = '/audio/song.mp3';
const DEFAULT_VOLUME = 0.1; // 1% volume as requested

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [wasPlayingBeforeTabHide, setWasPlayingBeforeTabHide] = useState(false);

  // Audio Fade In Helper
  const fadeAudioIn = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    audio.volume = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          const finalVol = DEFAULT_VOLUME;
          const step = Math.max(finalVol / 20, 0.005);
          let currentStepVol = 0;

          fadeIntervalRef.current = setInterval(() => {
            currentStepVol += step;
            if (currentStepVol >= finalVol) {
              audio.volume = finalVol;
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            } else {
              audio.volume = currentStepVol;
            }
          }, 30);
        })
        .catch((err) => {
          console.warn('Audio playback prevented by browser:', err);
          setIsPlaying(false);
        });
    }
  }, []);

  // Audio Fade Out Helper
  const fadeAudioOut = useCallback((callback) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const startVol = audio.volume;
    const step = Math.max(startVol / 15, 0.005);
    let currentStepVol = startVol;

    fadeIntervalRef.current = setInterval(() => {
      currentStepVol -= step;
      if (currentStepVol <= 0.01) {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        setIsPlaying(false);
        if (callback) callback();
      } else {
        audio.volume = currentStepVol;
      }
    }, 25);
  }, []);

  // Toggle Play/Reset
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      fadeAudioOut(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      });
    } else {
      fadeAudioIn();
    }
  }, [isPlaying, fadeAudioOut, fadeAudioIn]);

  // Audio setup and event listeners
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = DEFAULT_VOLUME;
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Handle Tab Inactivity (Visibility Change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden) {
        if (isPlaying) {
          setWasPlayingBeforeTabHide(true);
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingBeforeTabHide) {
          setWasPlayingBeforeTabHide(false);
          fadeAudioIn();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, wasPlayingBeforeTabHide, fadeAudioIn]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative group"
      >
        {/* Ambient Pulse Glow */}
        <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500 ${isPlaying ? 'animate-pulse' : ''}`} />

        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-neutral-950/90 backdrop-blur-2xl border border-emerald-500/40 text-neutral-100 shadow-2xl hover:border-emerald-400 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Toggle Music Player"
        >
          {/* Equalizer or Music Disc Icon */}
          <div className="relative w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
            {isPlaying ? (
              <Disc className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '4s' }} />
            ) : (
              <Music className="w-4 h-4 text-emerald-400" />
            )}
          </div>
        </button>
      </motion.div>
    </div>
  );
}
