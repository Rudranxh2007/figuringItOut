import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, Clock, Zap, Thermometer, Wind, Droplets } from 'lucide-react';

const recoveryTips = [
  {
    icon: Droplets,
    title: 'Hydration',
    desc: 'Drink 3–4L of water daily. Add electrolytes post heavy sessions.',
    tip: 'Target: 35ml per kg bodyweight',
  },
  {
    icon: Thermometer,
    title: 'Cold / Hot Therapy',
    desc: 'Ice bath (10 min, 10–15°C) after intense sessions. Hot shower before bed for relaxation.',
    tip: 'Cold reduces inflammation. Heat promotes blood flow.',
  },
  {
    icon: Wind,
    title: 'Foam Rolling',
    desc: 'Roll each muscle group 60–90 seconds. Focus on tight spots.',
    tip: 'Do before/after workout for best results.',
  },
  {
    icon: Zap,
    title: 'Sleep & Recovery',
    desc: 'Aim for 7–9 hours of quality sleep. Growth hormone peaks during deep sleep.',
    tip: 'Avoid screens 1 hour before bed.',
  },
];

const massageProtocol = [
  { muscle: 'Quads', duration: '5 min', technique: 'Effleurage + deep tissue' },
  { muscle: 'Hamstrings', duration: '5 min', technique: 'Cross-fiber friction' },
  { muscle: 'Calves', duration: '3 min', technique: 'Petrissage' },
  { muscle: 'Upper Back / Traps', duration: '5 min', technique: 'Knuckling + compression' },
  { muscle: 'Chest / Pecs', duration: '3 min', technique: 'Effleurage' },
  { muscle: 'Forearms', duration: '3 min', technique: 'Deep tissue + stretching' },
];

const checklist = [
  'Foam roll before session',
  'Static stretch post workout (15 min)',
  'Ice pack on sore muscles (15–20 min)',
  'Protein + carbs within 30 min post workout',
  'Magnesium supplement before sleep',
  '7–9 hours sleep tonight',
  'Massage tight muscles',
  'Drink 3L+ water today',
];

export default function Recovery() {
  const [checked, setChecked] = useState([]);

  const toggle = (item) =>
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-yellow-400 rounded-2xl">
          <HeartPulse className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Muscle Recovery</h1>
          <p className="text-neutral-400 text-sm">Massage protocol & recovery tips</p>
        </div>
      </div>

      {/* Recovery Score */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-black text-white">Today's Recovery Checklist</span>
          <span className="text-yellow-400 font-black text-sm">{checked.length}/{checklist.length}</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2 mb-5">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${(checked.length / checklist.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checklist.map(item => (
            <button
              key={item}
              onClick={() => toggle(item)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm font-semibold ${
                checked.includes(item)
                  ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${checked.includes(item) ? 'text-yellow-400' : 'text-neutral-700'}`} />
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Massage Protocol */}
      <div>
        <h2 className="text-lg font-black text-white mb-4">Post-Workout Massage Protocol</h2>
        <div className="space-y-3">
          {massageProtocol.map((m, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-black font-black text-xs">{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-sm">{m.muscle}</p>
                <p className="text-xs text-neutral-500">{m.technique}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-yellow-400 font-black shrink-0">
                <Clock className="w-3.5 h-3.5" /> {m.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Tips */}
      <div>
        <h2 className="text-lg font-black text-white mb-4">Recovery Strategies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recoveryTips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-400/10 rounded-xl">
                    <Icon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="font-black text-white text-sm">{tip.title}</span>
                </div>
                <p className="text-xs text-neutral-400">{tip.desc}</p>
                <p className="text-xs text-yellow-400 font-bold border-t border-neutral-800 pt-2">{tip.tip}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

