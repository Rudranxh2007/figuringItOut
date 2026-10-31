import React, { useState } from 'react';
import { User, Mail, Lock, Save, Eye, EyeOff, Edit3, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    fitnessGoals: user?.fitnessGoals || '',
    unitPreference: user?.unitPreference || 'kg',
  });
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePwChange = (e) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) { setPwMsg('Passwords do not match'); return; }
    if (pw.newPw.length < 6) { setPwMsg('Minimum 6 characters'); return; }
    setPwMsg('Password updated!');
    setPw({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setPwMsg(''), 3000);
  };

  const PwInput = ({ field, placeholder }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500"><Lock className="w-4 h-4" /></div>
      <input
        type={showPw[field] ? 'text' : 'password'}
        placeholder={placeholder}
        value={pw[field]}
        onChange={e => setPw({ ...pw, [field]: e.target.value })}
        className="w-full pl-11 pr-11 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))} className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-yellow-400">
        {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><User className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Account</h1><p className="text-neutral-400 text-sm">Manage your profile & security</p></div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-5 bg-neutral-950 border border-neutral-800 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center shrink-0">
          <span className="text-3xl font-black text-black">{user?.name?.charAt(0)?.toUpperCase()}</span>
        </div>
        <div>
          <p className="text-xl font-black text-white">{user?.name}</p>
          <p className="text-sm text-neutral-400 flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5" />{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[{ label: 'Workouts', val: '47' }, { label: 'PRs Set', val: '12' }, { label: 'Day Streak', val: '8' }, { label: 'Badges', val: '5' }].map(s => (
          <div key={s.label} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 text-center">
            <p className="text-xl font-black text-yellow-400">{s.val}</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit Profile */}
      <form onSubmit={handleSave} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4 space-y-4">
        <div className="flex items-center gap-2 mb-1"><Edit3 className="w-4 h-4 text-yellow-400" /><h3 className="font-black text-white">Edit Profile</h3></div>
        <div>
          <label className="text-xs text-neutral-500 font-bold mb-1 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500"><User className="w-4 h-4" /></div>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-500 font-bold mb-1 block">Email (read-only)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500"><Mail className="w-4 h-4" /></div>
            <input value={form.email} readOnly className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl text-neutral-500 text-sm cursor-not-allowed" />
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-500 font-bold mb-1 block">Fitness Goal</label>
          <textarea value={form.fitnessGoals} onChange={e => setForm({ ...form, fitnessGoals: e.target.value })} rows={2} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
        </div>
        <div>
          <label className="text-xs text-neutral-500 font-bold mb-1 block">Weight Unit</label>
          <select value={form.unitPreference} onChange={e => setForm({ ...form, unitPreference: e.target.value })} className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </div>
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm transition-all">
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePwChange} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4 space-y-4">
        <div className="flex items-center gap-2 mb-1"><Shield className="w-4 h-4 text-yellow-400" /><h3 className="font-black text-white">Change Password</h3></div>
        {pwMsg && <div className={`text-sm font-bold p-3 rounded-xl ${pwMsg.includes('updated') ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' : 'bg-neutral-900 text-white border border-neutral-700'}`}>{pwMsg}</div>}
        <PwInput field="current" placeholder="Current password" />
        <PwInput field="newPw" placeholder="New password (min 6 chars)" />
        <PwInput field="confirm" placeholder="Confirm new password" />
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 text-white font-black rounded-xl hover:bg-neutral-700 text-sm transition-all">
          <Shield className="w-4 h-4" /> Update Password
        </button>
      </form>

      {/* Danger zone */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-black text-neutral-500 mb-3">Danger Zone</h3>
        <p className="text-xs text-neutral-600 mb-3">Once you delete your account, all data will be permanently removed.</p>
        <button className="px-4 py-2 border border-neutral-700 text-neutral-500 hover:text-white font-bold rounded-xl text-sm transition-all">Delete Account</button>
      </div>
    </div>
  );
}

