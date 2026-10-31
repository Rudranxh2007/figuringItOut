import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

const PRESETS = [5, 10, 15, 20, 30];
const SOUNDS = ['Silence', 'Nature', 'Rain', 'White Noise'];

export default function Meditation() {
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [sound, setSound] = useState('Silence');
  const [sessions, setSessions] = useState([
    { id: 1, duration: 10, time: '08:00', date: '2026-10-30' },
    { id: 2, duration: 15, time: '07:30', date: '2026-10-29' },
  ]);
  const interval = useRef(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      interval.current = setInterval(() => setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval.current); setRunning(false); setDone(true); setSessions(s => [{ id: Date.now(), duration, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().split('T')[0] }, ...s]); return 0; }
        return t - 1;
      }), 1000);
    } else { clearInterval(interval.current); }
    return () => clearInterval(interval.current);
  }, [running]);

  const reset = () => { setRunning(false); setTimeLeft(duration * 60); setDone(false); };
  const selectPreset = (min) => { setDuration(min); setTimeLeft(min * 60); setRunning(false); setDone(false); };
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const pct = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><Brain className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Meditation</h1><p className="text-neutral-400 text-sm">Clear your mind, boost focus</p></div>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap mb-6">
        {PRESETS.map(min => (
          <button key={min} onClick={() => selectPreset(min)} className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${duration === min ? 'bg-yellow-400 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}>
            {min} min
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-10 text-center mb-6">
        {done ? (
          <div>
            <CheckCircle2 className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-2xl font-black text-white mb-1">Session Complete!</p>
            <p className="text-neutral-400 text-sm">{duration} minutes of mindfulness done</p>
          </div>
        ) : (
          <>
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#262626" strokeWidth="8" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="#facc15" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - pct / 100)}`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-black text-white">{mm}:{ss}</span>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={() => setRunning(!running)} className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300">
                {running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {timeLeft === duration * 60 ? 'Start' : 'Resume'}</>}
              </button>
              <button onClick={reset} className="flex items-center gap-2 px-5 py-3 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Sound selector */}
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">Ambient Sound</p>
        <div className="flex gap-2 flex-wrap">
          {SOUNDS.map(s => (
            <button key={s} onClick={() => setSound(s)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${sound === s ? 'bg-yellow-400 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Session log */}
      {sessions.length > 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">Recent Sessions</p>
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-yellow-400" /><span className="text-white font-bold text-sm">{s.duration} min session</span></div>
                <span className="text-xs text-neutral-500">{s.date} · {s.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

