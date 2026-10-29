import React, { useState, useEffect } from 'react';
import { metricAPI, workoutAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import {
  Scale,
  Trophy,
  Plus,
  Trash2,
  Activity,
  Award
} from 'lucide-react';

export default function Progress() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // New weight modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // PR search
  const [prSearch, setPrSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricRes, statsRes] = await Promise.all([
        metricAPI.getMetrics(),
        workoutAPI.getStats(),
      ]);

      if (metricRes.data.success) setMetrics(metricRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetric = async (e) => {
    e.preventDefault();
    if (!weight) return;

    try {
      setSubmitting(true);
      const payload = {
        date,
        weight: Number(weight),
        unit: user?.unitPreference || 'kg',
        bodyFat: bodyFat ? Number(bodyFat) : null,
        notes,
      };

      const res = await metricAPI.logMetric(payload);
      if (res.data.success) {
        setShowLogModal(false);
        setWeight('');
        setBodyFat('');
        setNotes('');
        fetchData();
      }
    } catch (err) {
      console.error('Error adding metric:', err);
      alert('Failed to log metric');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMetric = async (id) => {
    if (!window.confirm('Delete this measurement entry?')) return;
    try {
      await metricAPI.deleteMetric(id);
      setMetrics(metrics.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Error deleting metric:', err);
    }
  };

  // Weight stats
  const weights = metrics.map((m) => m.weight);
  const currentWeight = weights.length > 0 ? weights[weights.length - 1] : null;
  const startWeight = weights.length > 0 ? weights[0] : null;
  const weightChange = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : 0;
  const minWeight = weights.length > 0 ? Math.min(...weights) : null;
  const maxWeight = weights.length > 0 ? Math.max(...weights) : null;

  // PRs filter
  const prs = stats?.personalRecords || [];
  const filteredPRs = prs.filter((p) =>
    p.exerciseName.toLowerCase().includes(prSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-yellow-400" />
            Body Metrics & Progress Analytics
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Track weight trends, review strength gains, and inspect Personal Records (PRs).
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm shadow-xl shadow-yellow-400/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Body Weight
        </button>
      </div>

      {/* Weight Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">Current Weight</span>
          <div className="mt-2 text-2xl font-black text-white">
            {currentWeight !== null ? `${currentWeight} ${user?.unitPreference || 'kg'}` : '--'}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">Net Change</span>
          <div className="mt-2 text-2xl font-black text-yellow-400">
            {weightChange > 0 ? `+${weightChange}` : weightChange} {user?.unitPreference || 'kg'}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">Lowest Weight</span>
          <div className="mt-2 text-2xl font-black text-neutral-300">
            {minWeight !== null ? `${minWeight} ${user?.unitPreference || 'kg'}` : '--'}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">Highest Weight</span>
          <div className="mt-2 text-2xl font-black text-neutral-300">
            {maxWeight !== null ? `${maxWeight} ${user?.unitPreference || 'kg'}` : '--'}
          </div>
        </div>
      </div>

      {/* Body Weight Progress Chart in Yellow & Black */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-yellow-400" />
              Weight Progression Over Time
            </h2>
            <p className="text-xs text-neutral-400">Recorded weight timeline curve</p>
          </div>
        </div>

        {metrics.length < 2 ? (
          <div className="py-16 text-center text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-2xl">
            <Scale className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            <p>Log at least 2 weight entries to generate the progression trend line.</p>
            <button
              onClick={() => setShowLogModal(true)}
              className="mt-3 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-xl text-xs font-black hover:bg-yellow-400 hover:text-black transition"
            >
              + Log Entry Now
            </button>
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yellowWeightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#737373"
                  fontSize={11}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: '#262626',
                    borderRadius: '1rem',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(val) => [`${val} ${user?.unitPreference || 'kg'}`, 'Weight']}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#facc15"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#yellowWeightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* PRs (Personal Records) Hall of Fame */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Personal Records (PR) Hall of Fame
            </h2>
            <p className="text-xs text-neutral-400">
              Highest weight successfully logged across all your workout sessions
            </p>
          </div>

          <input
            type="text"
            placeholder="Search PR by exercise..."
            value={prSearch}
            onChange={(e) => setPrSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        {filteredPRs.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl">
            <Award className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            No Personal Records recorded yet. Complete workout sets with weight to populate your PR wall!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPRs.map((pr, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 flex items-center justify-between hover:border-yellow-400/50 transition group"
              >
                <div>
                  <h4 className="font-black text-base text-white group-hover:text-yellow-400 transition">
                    {pr.exerciseName}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {pr.date} ({pr.reps} reps)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-yellow-400">
                    {pr.maxWeight}
                  </span>
                  <span className="text-xs font-bold text-neutral-400 ml-1">
                    {user?.unitPreference || 'kg'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Measurement History Table */}
      {metrics.length > 0 && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <h2 className="text-lg font-black text-white">Logged Weight History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800">
                  <th className="pb-3 font-bold">DATE</th>
                  <th className="pb-3 font-bold">WEIGHT</th>
                  <th className="pb-3 font-bold">BODY FAT %</th>
                  <th className="pb-3 font-bold">NOTES</th>
                  <th className="pb-3 text-right font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {metrics
                  .slice()
                  .reverse()
                  .map((m) => (
                    <tr key={m._id} className="hover:bg-neutral-900/40">
                      <td className="py-3 font-bold text-neutral-300">{m.date}</td>
                      <td className="py-3 font-black text-yellow-400 text-sm">
                        {m.weight} {m.unit}
                      </td>
                      <td className="py-3 text-neutral-300 font-bold">
                        {m.bodyFat ? `${m.bodyFat}%` : '—'}
                      </td>
                      <td className="py-3 text-neutral-400">{m.notes || '—'}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteMetric(m._id)}
                          className="p-1.5 text-neutral-500 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log Body Metric */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-yellow-400" /> Log Body Weight
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMetric} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Body Weight ({user?.unitPreference || 'kg'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 76.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Body Fat % (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15.2"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weighed fasting in the morning"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-5 py-2.5 bg-neutral-900 text-neutral-300 hover:text-white rounded-2xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black transition shadow-xl shadow-yellow-400/20 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Metric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
