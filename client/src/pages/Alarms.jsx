import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultAlarms = [
  { id: 1, label: 'Morning Workout', time: '06:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], active: true },
  { id: 2, label: 'Take Supplements', time: '08:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], active: true },
  { id: 3, label: 'Post Workout Protein', time: '08:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], active: false },
  { id: 4, label: 'Sleep Recovery', time: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], active: true },
];

export default function Alarms() {
  const [alarms, setAlarms] = useState(defaultAlarms);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', time: '07:00', days: [] });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAlarm = (id) => setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const deleteAlarm = (id) => setAlarms(alarms.filter(a => a.id !== id));
  const toggleDay = (day) => setForm(f => ({
    ...f, days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day]
  }));

  const addAlarm = (e) => {
    e.preventDefault();
    if (!form.label || !form.time) return;
    setAlarms([...alarms, { id: Date.now(), ...form, active: true }]);
    setForm({ label: '', time: '07:00', days: [] });
    setShowForm(false);
  };

  const formatTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl">
            <Bell className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Alarms</h1>
            <p className="text-neutral-400 text-sm">Workout & supplement reminders</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> New Alarm
        </button>
      </div>

      {/* Live clock */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 text-center">
        <p className="text-5xl font-black text-white tracking-tight">
          {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <p className="text-neutral-500 text-sm mt-1">
          {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Add Alarm Form */}
      {showForm && (
        <form onSubmit={addAlarm} className="bg-neutral-900 border border-yellow-400/30 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="font-black text-white">New Alarm</h3>
          <input
            placeholder="Label (e.g. Morning Workout)"
            value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="time"
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div>
            <p className="text-xs text-neutral-400 font-bold mb-2">Repeat Days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(d => (
                <button
                  key={d} type="button"
                  onClick={() => toggleDay(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    form.days.includes(d) ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Set Alarm</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm hover:bg-neutral-700">Cancel</button>
          </div>
        </form>
      )}

      {/* Alarm List */}
      <div className="space-y-3">
        {alarms.map(a => (
          <div
            key={a.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              a.active ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-950 border-neutral-800 opacity-50'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-2xl font-black text-white">{formatTime(a.time)}</span>
              </div>
              <p className="text-sm font-bold text-neutral-300">{a.label}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {a.days.map(d => (
                  <span key={d} className="text-[10px] px-2 py-0.5 bg-yellow-400/10 text-yellow-400 font-black rounded-md">{d}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleAlarm(a.id)} className="text-neutral-400 hover:text-yellow-400 transition-colors">
                {a.active
                  ? <ToggleRight className="w-8 h-8 text-yellow-400" />
                  : <ToggleLeft className="w-8 h-8 text-neutral-600" />
                }
              </button>
              <button onClick={() => deleteAlarm(a.id)} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-neutral-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

