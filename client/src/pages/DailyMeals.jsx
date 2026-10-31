import React, { useState } from 'react';
import { Apple, Plus, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const MEAL_SLOTS = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Pre-Workout', 'Post-Workout', 'Dinner', 'Before Bed'];

const defaultMeals = {
  'Breakfast': {
    time: '07:30',
    items: ['Oats with banana & honey (400 kcal)', 'Boiled eggs x3 (210 kcal)', 'Black coffee'],
  },
  'Mid-Morning Snack': {
    time: '10:30',
    items: ['Mixed nuts (150 kcal)', 'Apple (80 kcal)'],
  },
  'Lunch': {
    time: '13:00',
    items: ['Chicken breast 150g (248 kcal)', 'Brown rice 100g (216 kcal)', 'Mixed salad (50 kcal)'],
  },
  'Pre-Workout': {
    time: '16:30',
    items: ['Banana + peanut butter toast (280 kcal)', 'Black coffee / Pre-workout'],
  },
  'Post-Workout': {
    time: '19:00',
    items: ['Whey protein shake 30g (120 kcal)', 'White rice 150g (194 kcal)'],
  },
  'Dinner': {
    time: '20:30',
    items: ['Paneer / Fish 150g (220 kcal)', 'Roti x2 (200 kcal)', 'Dal / vegetables (100 kcal)'],
  },
  'Before Bed': {
    time: '22:30',
    items: ['Casein protein / Milk (150 kcal)', 'Almonds x10 (70 kcal)'],
  },
};

export default function DailyMeals() {
  const [meals, setMeals] = useState(defaultMeals);
  const [expanded, setExpanded] = useState({ 'Breakfast': true });
  const [newItem, setNewItem] = useState({});

  const toggleExpand = (slot) => setExpanded(prev => ({ ...prev, [slot]: !prev[slot] }));

  const addItem = (slot) => {
    const text = newItem[slot]?.trim();
    if (!text) return;
    setMeals(prev => ({
      ...prev,
      [slot]: { ...prev[slot], items: [...prev[slot].items, text] }
    }));
    setNewItem(prev => ({ ...prev, [slot]: '' }));
  };

  const removeItem = (slot, idx) => {
    setMeals(prev => ({
      ...prev,
      [slot]: { ...prev[slot], items: prev[slot].items.filter((_, i) => i !== idx) }
    }));
  };

  const updateTime = (slot, time) => {
    setMeals(prev => ({ ...prev, [slot]: { ...prev[slot], time } }));
  };

  const totalCals = Object.values(meals).reduce((sum, m) => {
    return sum + m.items.reduce((s, item) => {
      const match = item.match(/\((\d+)\s*kcal\)/);
      return s + (match ? parseInt(match[1]) : 0);
    }, 0);
  }, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl">
            <Apple className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Daily Meals</h1>
            <p className="text-neutral-400 text-sm">Plan your nutrition for the day</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-yellow-400">{totalCals}</p>
          <p className="text-xs text-neutral-500">total kcal</p>
        </div>
      </div>

      {/* Meal Slots */}
      <div className="space-y-3">
        {MEAL_SLOTS.map((slot) => {
          const meal = meals[slot] || { time: '', items: [] };
          const isOpen = expanded[slot];
          const slotCals = meal.items.reduce((s, item) => {
            const match = item.match(/\((\d+)\s*kcal\)/);
            return s + (match ? parseInt(match[1]) : 0);
          }, 0);

          return (
            <div key={slot} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              {/* Slot Header */}
              <button
                onClick={() => toggleExpand(slot)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                  <span className="font-black text-white text-sm">{slot}</span>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {meal.time || '--:--'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {slotCals > 0 && (
                    <span className="text-xs font-black text-yellow-400">{slotCals} kcal</span>
                  )}
                  <span className="text-xs text-neutral-500">{meal.items.length} items</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-neutral-800">
                  {/* Time input */}
                  <div className="flex items-center gap-2 pt-3">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <input
                      type="time"
                      value={meal.time}
                      onChange={e => updateTime(slot, e.target.value)}
                      className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Items */}
                  {meal.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-neutral-800/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 shrink-0" />
                      <span className="flex-1 text-sm text-neutral-300">{item}</span>
                      <button onClick={() => removeItem(slot, idx)} className="p-1 text-neutral-700 hover:text-white rounded-lg hover:bg-neutral-800">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add item */}
                  <div className="flex gap-2 pt-1">
                    <input
                      placeholder="Add food item (e.g. Rice 100g (216 kcal))"
                      value={newItem[slot] || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, [slot]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addItem(slot)}
                      className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-neutral-600"
                    />
                    <button
                      onClick={() => addItem(slot)}
                      className="p-2 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

