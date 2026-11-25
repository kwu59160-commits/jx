import { useCallback, useEffect, useRef, useState } from 'react';
import type { ListeningLine, ListeningSpeaker } from '../data/listeningMaterials';

export interface SpokenChunk {
  lineIndex: number;
  text: string;
  speaker: ListeningSpeaker;
}

function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+(?:["”])?|[^.!?]+$/g);
  const sentences = (parts ?? [text]).map((part) => part.trim()).filter(Boolean);
  return sentences.length > 0 ? sentences : [text];
}

function englishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'));
}

function pickVoice(speaker: ListeningSpeaker, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const match = (pattern: RegExp) => voices.find((voice) => pattern.test(voice.name));
  if (speaker === 'W') {
    return match(/female|samantha|victoria|zira|aria|jenny|serena|moira|susan/i) ?? voices[0];
  }
  if (speaker === 'M') {
    return match(/male|daniel|david|alex|george|rishi|guy|fred|aaron/i) ?? voices[1] ?? voices[0];
  }
  return match(/natural|google|samantha|daniel|aria|jenny/i) ?? voices[0];
}

export function useScriptPlayer() {
  const [playing, setPlaying] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);
  const [chunkIndex, setChunkIndex] = useState(-1);
  const [chunkTotal, setChunkTotal] = useState(0);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState('');
  const tokenRef = useRef(0);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    const synth = window.speechSynthesis;
    if (!synth) return;
    const warm = () => {
      synth.getVoices();
    };
    warm();
    synth.addEventListener('voiceschanged', warm);
    return () => {
      tokenRef.current += 1;
      synth.cancel();
      synth.removeEventListener('voiceschanged', warm);
    };
  }, []);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    window.speechSynthesis?.cancel();
    setPlaying(false);
    setLineIndex(-1);
    setChunkIndex(-1);
  }, []);

  const play = useCallback((lines: ListeningLine[], rate: number) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setSupported(false);
      setError('这台浏览器不能朗读。可以展开原文，改成看着文本做精听。');
      return;
    }
    synth.cancel();
    const token = tokenRef.current + 1;
    tokenRef.current = token;
    const queue: SpokenChunk[] = [];
    lines.forEach((line, index) => {
      splitSentences(line.text).forEach((text) => {
        queue.push({ lineIndex: index, text, speaker: line.speaker });
      });
    });
    setChunkTotal(queue.length);
    setError('');
    setPlaying(true);

    const step = (index: number) => {
      if (tokenRef.current !== token) return;
      if (index >= queue.length) {
        setPlaying(false);
        setLineIndex(-1);
        setChunkIndex(-1);
        return;
      }
      const item = queue[index];
      setLineIndex(item.lineIndex);
      setChunkIndex(index);
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = item.speaker === 'W' ? 1.12 : item.speaker === 'M' ? 0.84 : 1;
      const voice = pickVoice(item.speaker, englishVoices());
      if (voice) utterance.voice = voice;
      utterance.onend = () => step(index + 1);
      utterance.onerror = (event) => {
        if (tokenRef.current !== token) return;
        const reason = event.error;
        if (reason === 'interrupted' || reason === 'canceled') return;
        setPlaying(false);
        if (reason === 'not-allowed') {
          setError('浏览器拦住了朗读。再点一次「播放本篇」。如果仍然没有声音，展开原文即可做题。');
          return;
        }
        setError('朗读被浏览器打断了。再按一次播放，或展开原文做题。');
      };
      synth.resume();
      synth.speak(utterance);
    };

    window.setTimeout(() => step(0), 60);
  }, []);

  return {
    playing,
    lineIndex,
    chunkIndex,
    chunkTotal,
    supported,
    error,
    play,
    stop,
    clearError: () => setError(''),
  };
}
