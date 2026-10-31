import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Flame, Target } from 'lucide-react';

const MACROS = { protein: 4, carbs: 4, fat: 9 };

const defaultFoods = [
  { id: 1, name: 'Oats (100g)', calories: 389, protein: 17, carbs: 66, fat: 7 },
  { id: 2, name: 'Chicken Breast (150g)', calories: 248, protein: 46, carbs: 0, fat: 5 },
  { id: 3, name: 'Brown Rice (100g)', calories: 216, protein: 5, carbs: 45, fat: 2 },
];

export default function CalorieTracker() {
  const [goal, setGoal] = useState(2500);
  const [foods, setFoods] = useState(defaultFoods);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const totalCals = foods.reduce((sum, f) => sum + Number(f.calories), 0);
  const totalProtein = foods.reduce((sum, f) => sum + Number(f.protein), 0);
  const totalCarbs = foods.reduce((sum, f) => sum + Number(f.carbs), 0);
  const totalFat = foods.reduce((sum, f) => sum + Number(f.fat), 0);
  const remaining = goal - totalCals;
  const pct = Math.min((totalCals / goal) * 100, 100);

  const addFood = (e) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    setFoods([...foods, { id: Date.now(), name: form.name, calories: +form.calories, protein: +form.protein || 0, carbs: +form.carbs || 0, fat: +form.fat || 0 }]);
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowForm(false);
  };

  const MacroBar = ({ label, val, max, color }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-400 font-bold">{label}</span>
        <span className="text-white font-black">{val}g</span>
      </div>
      <div className="w-full bg-neutral-800 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${Math.min((val / max) * 100, 100)}%` }} />
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl">
            <Utensils className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Calorie Tracker</h1>
            <p className="text-neutral-400 text-sm">Track daily intake & macros</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Food
        </button>
      </div>

      {/* Calorie Goal Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            <span className="font-black text-white">Daily Goal</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={goal}
              onChange={e => setGoal(+e.target.value)}
              className="w-24 px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm font-black text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="text-xs text-neutral-500 font-bold">kcal</span>
          </div>
        </div>

        {/* Big calorie display */}
        <div className="text-center mb-4">
          <p className="text-5xl font-black text-yellow-400">{totalCals}</p>
          <p className="text-neutral-500 text-sm mt-1">of {goal} kcal consumed</p>
        </div>

        <div className="w-full bg-neutral-800 rounded-full h-3 mb-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-white' : 'bg-yellow-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="text-center text-sm font-bold">
          {remaining >= 0
            ? <span className="text-neutral-300">{remaining} kcal <span className="text-neutral-500">remaining</span></span>
            : <span className="text-white">{Math.abs(remaining)} kcal <span className="text-neutral-500">over goal</span></span>
          }
        </p>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-800">
          <MacroBar label="Protein" val={totalProtein} max={200} color="bg-yellow-400" />
          <MacroBar label="Carbs" val={totalCarbs} max={300} color="bg-white" />
          <MacroBar label="Fat" val={totalFat} max={80} color="bg-neutral-400" />
        </div>
      </div>

      {/* Add Food Form */}
      {showForm && (
        <form onSubmit={addFood} className="bg-neutral-900 border border-yellow-400/30 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="font-black text-white">Add Food Item</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input placeholder="Food name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="col-span-2 sm:col-span-3 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" required />
            {[['calories','Calories (kcal) *'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([key, label]) => (
              <input key={key} type="number" placeholder={label} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Add</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm hover:bg-neutral-700">Cancel</button>
          </div>
        </form>
      )}

      {/* Food List */}
      <div className="space-y-3">
        {foods.map(f => (
          <div key={f.id} className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="p-2 bg-yellow-400/10 rounded-xl shrink-0">
              <Flame className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">{f.name}</p>
              <p className="text-xs text-neutral-500">P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g</p>
            </div>
            <span className="text-yellow-400 font-black text-sm shrink-0">{f.calories} kcal</span>
            <button onClick={() => setFoods(foods.filter(x => x.id !== f.id))} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-neutral-800">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

