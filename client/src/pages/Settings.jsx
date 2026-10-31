import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Database, Palette, Save } from 'lucide-react';

export default function Settings() {
  const [prefs, setPrefs] = useState({ weightUnit: 'kg', heightUnit: 'cm', distanceUnit: 'km', fontSize: 'Medium' });
  const [notifs, setNotifs] = useState({ workoutReminder: true, supplementAlert: true, goalUpdates: false, weeklyReport: true });
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const Toggle = ({ val, onChange }) => (
    <button onClick={() => onChange(!val)} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${val ? 'bg-yellow-400' : 'bg-neutral-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${val ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {toast && <div className="fixed top-4 right-4 bg-neutral-800 border border-neutral-700 text-white text-sm font-bold px-4 py-3 rounded-2xl z-50 shadow-xl">{toast}</div>}

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><SettingsIcon className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Settings</h1><p className="text-neutral-400 text-sm">Customize your PulseFit experience</p></div>
      </div>

      {/* Appearance */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4"><Palette className="w-4 h-4 text-yellow-400" /><h3 className="font-black text-white">Appearance</h3></div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-bold text-white">Theme</p><p className="text-xs text-neutral-500">App color scheme</p></div>
            <div className="flex gap-2">
              {['Dark', 'Light'].map(t => (
                <button key={t} className={`px-3 py-1.5 rounded-xl font-bold text-xs ${t === 'Dark' ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
            <div><p className="text-sm font-bold text-white">Font Size</p><p className="text-xs text-neutral-500">Text size throughout app</p></div>
            <div className="flex gap-2">
              {['Small', 'Medium', 'Large'].map(s => (
                <button key={s} onClick={() => setPrefs({ ...prefs, fontSize: s })} className={`px-3 py-1.5 rounded-xl font-bold text-xs ${prefs.fontSize === s ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4">
        <h3 className="font-black text-white mb-4">Units & Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'Weight Unit', key: 'weightUnit', opts: ['kg', 'lbs'] },
            { label: 'Height Unit', key: 'heightUnit', opts: ['cm', 'ft'] },
            { label: 'Distance Unit', key: 'distanceUnit', opts: ['km', 'miles'] },
          ].map(({ label, key, opts }) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{label}</p>
              <div className="flex gap-2">
                {opts.map(o => (
                  <button key={o} onClick={() => setPrefs({ ...prefs, [key]: o })} className={`px-3 py-1.5 rounded-xl font-bold text-xs ${prefs[key] === o ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-yellow-400" /><h3 className="font-black text-white">Notifications</h3></div>
        <div className="space-y-4">
          {[
            { label: 'Workout Reminders', sub: 'Daily workout alerts', key: 'workoutReminder' },
            { label: 'Supplement Alerts', sub: 'Time to take your supplements', key: 'supplementAlert' },
            { label: 'Goal Updates', sub: 'Progress towards your goals', key: 'goalUpdates' },
            { label: 'Weekly Report', sub: 'Summary every Sunday', key: 'weeklyReport' },
          ].map(({ label, sub, key }) => (
            <div key={key} className="flex items-center justify-between">
              <div><p className="text-sm font-bold text-white">{label}</p><p className="text-xs text-neutral-500">{sub}</p></div>
              <Toggle val={notifs[key]} onChange={v => setNotifs({ ...notifs, [key]: v })} />
            </div>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4"><Database className="w-4 h-4 text-yellow-400" /><h3 className="font-black text-white">Data</h3></div>
        <div className="space-y-3">
          <button onClick={() => showToast('Export feature coming soon!')} className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-sm transition-all text-left px-4">Export Data (.JSON)</button>
          <button onClick={() => showToast('Cache cleared!')} className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-sm transition-all text-left px-4">Clear Cache</button>
          <button onClick={() => showToast('Contact support to delete your account.')} className="w-full py-2.5 bg-transparent border border-neutral-800 text-neutral-500 hover:text-white font-bold rounded-xl text-sm text-left px-4">Delete Account</button>
        </div>
      </div>

      <button onClick={() => showToast('Settings saved!')} className="w-full flex items-center justify-center gap-2 py-3.5 bg-yellow-400 text-black font-black rounded-2xl hover:bg-yellow-300 transition-all">
        <Save className="w-5 h-5" /> Save Settings
      </button>
    </div>
  );
}

