import React from 'react';
import { Trophy, Lock } from 'lucide-react';

const achievements = [
  { emoji: '🏋️', title: 'First Workout', desc: 'Complete your first workout', earned: '2026-09-01', unlocked: true },
  { emoji: '⚡', title: 'Week Warrior', desc: '7 workouts in a row', earned: '2026-09-15', unlocked: true },
  { emoji: '🏆', title: 'PR Breaker', desc: 'Set 5 personal records', earned: '2026-10-05', unlocked: true },
  { emoji: '💧', title: 'Hydration Hero', desc: 'Log water for 14 days', earned: '2026-10-12', unlocked: true },
  { emoji: '🌅', title: 'Early Bird', desc: '10 morning workouts before 7am', earned: '2026-10-20', unlocked: true },
  { emoji: '🔥', title: 'Iron Will', desc: '30-day workout streak', earned: null, unlocked: false },
  { emoji: '💯', title: 'Century Club', desc: '100 total workouts completed', earned: null, unlocked: false },
  { emoji: '💊', title: 'Supplement Pro', desc: 'Log supplements for 30 days', earned: null, unlocked: false },
  { emoji: '📉', title: 'Lean Machine', desc: 'Lose 5kg from starting weight', earned: null, unlocked: false },
  { emoji: '💪', title: 'Strength God', desc: 'Bench press 100kg', earned: null, unlocked: false },
  { emoji: '🏃', title: 'Marathon Mindset', desc: 'Run 100km total distance', earned: null, unlocked: false },
  { emoji: '🧘', title: 'Zen Master', desc: 'Complete 20 meditation sessions', earned: null, unlocked: false },
];

export default function Achievements() {
  const unlocked = achievements.filter(a => a.unlocked).length;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><Trophy className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Achievements</h1><p className="text-neutral-400 text-sm">Your fitness milestones & badges</p></div>
      </div>
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-black text-white">{unlocked}/{achievements.length} Unlocked</span>
          <span className="text-yellow-400 font-black text-sm">{Math.round((unlocked / achievements.length) * 100)}%</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2.5">
          <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${(unlocked / achievements.length) * 100}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <div key={i} className={`relative p-5 rounded-2xl border transition-all ${a.unlocked ? 'bg-neutral-950 border-yellow-400/30' : 'bg-neutral-950/50 border-neutral-800 opacity-40'}`}>
            {!a.unlocked && <div className="absolute top-3 right-3"><Lock className="w-4 h-4 text-neutral-600" /></div>}
            <div className="flex items-start gap-3">
              <span className="text-3xl">{a.emoji}</span>
              <div>
                <p className={`font-black text-sm ${a.unlocked ? 'text-white' : 'text-neutral-500'}`}>{a.title}</p>
                <p className="text-xs text-neutral-600 mt-0.5">{a.desc}</p>
                {a.unlocked && a.earned && <p className="text-[10px] text-yellow-400 font-bold mt-1.5">Earned: {a.earned}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
