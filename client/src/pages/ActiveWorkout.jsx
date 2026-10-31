import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Play, Pause, Square, Plus, X, Trash2, Timer } from 'lucide-react';

export default function ActiveWorkout() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', sets: '3', reps: '10', weight: '' });
  const interval = useRef(null);

  useEffect(() => {
    if (running) { interval.current = setInterval(() => setSeconds(s => s + 1), 1000); }
    else { clearInterval(interval.current); }
    return () => clearInterval(interval.current);
  }, [running]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const addExercise = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setExercises([...exercises, { id: Date.now(), ...form }]);
    setForm({ name: '', sets: '3', reps: '10', weight: '' });
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><Dumbbell className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Active Workout</h1><p className="text-neutral-400 text-sm">Track your session in real time</p></div>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Timer className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Session Time</span>
        </div>
        <p className="text-7xl font-black text-white tracking-tight mb-6">{fmt(seconds)}</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => setRunning(!running)} className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all">
            {running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Start</>}
          </button>
          <button onClick={() => { setRunning(false); setSeconds(0); setExercises([]); }} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white font-black rounded-xl hover:bg-neutral-700 transition-all">
            <Square className="w-5 h-5" /> End
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-white">Exercises ({exercises.length})</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> Add Exercise
        </button>
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-12 text-neutral-600">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold">No exercises added yet</p>
        </div>
      )}

      <div className="space-y-3">
        {exercises.map((ex, i) => (
          <div key={ex.id} className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
            <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-black font-black text-sm">{i + 1}</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-white">{ex.name}</p>
              <p className="text-xs text-neutral-500">{ex.sets} sets × {ex.reps} reps {ex.weight ? `· ${ex.weight} kg` : ''}</p>
            </div>
            <button onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))} className="p-1.5 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">Add Exercise</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={addExercise} className="space-y-3">
              <input required placeholder="Exercise name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <div className="grid grid-cols-3 gap-3">
                {[['sets','Sets'],['reps','Reps'],['weight','Weight (kg)']].map(([k, label]) => (
                  <div key={k}>
                    <label className="text-xs text-neutral-500 font-bold mb-1 block">{label}</label>
                    <input type="number" placeholder="-" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300">Add</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
