import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutAPI, metricAPI } from '../services/api';
import {
  Flame,
  CheckCircle2,
  Trophy,
  Dumbbell,
  Scale,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [latestMetric, setLatestMetric] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickWeight, setQuickWeight] = useState('');
  const [submittingWeight, setSubmittingWeight] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes, todayRes, metricsRes] = await Promise.all([
        workoutAPI.getStats(),
        workoutAPI.getRecent(5),
        workoutAPI.getByDate(todayStr),
        metricAPI.getMetrics(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (logsRes.data.success) setRecentLogs(logsRes.data.data);
      if (todayRes.data.success) setTodayLog(todayRes.data.data);
      if (metricsRes.data.success && metricsRes.data.data.length > 0) {
        setLatestMetric(metricsRes.data.data[metricsRes.data.data.length - 1]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickWeightSubmit = async (e) => {
    e.preventDefault();
    if (!quickWeight) return;

    try {
      setSubmittingWeight(true);
      await metricAPI.logMetric({
        date: todayStr,
        weight: Number(quickWeight),
        unit: user?.unitPreference || 'kg',
      });
      setQuickWeight('');
      fetchDashboardData();
    } catch (err) {
      console.error('Error saving weight:', err);
    } finally {
      setSubmittingWeight(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Get past 7 days for the consistency bar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const str = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isCompleted = recentLogs.some((l) => l.date === str && l.completed);
    return { date: str, dayLabel, isCompleted, isToday: str === todayStr };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs tracking-wider uppercase mb-1">
              <span>Goal: {user?.fitnessGoals || 'Consistency & Gains'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to crush today, {user?.name?.split(' ')[0]}? 🔥
            </h1>
            <p className="mt-1 text-neutral-400 text-sm">
              Track today's lifts, log sets, and build unstoppable momentum.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/daily"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm shadow-xl shadow-yellow-400/20 transition-all hover:scale-102"
            >
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              {todayLog ? "Resume Today's Log" : "Start Today's Workout"}
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics & Streak Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-yellow-400/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Current Streak</span>
            <div className="p-2.5 bg-yellow-400/15 text-yellow-400 rounded-2xl">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.currentStreak || 0}</span>
            <span className="text-xs font-medium text-neutral-400">days</span>
          </div>
          <div className="mt-3 text-xs text-yellow-400 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Keep the fire burning!
          </div>
        </div>

        {/* Total Workouts Completed */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-yellow-400/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Completed Sessions</span>
            <div className="p-2.5 bg-neutral-900 text-yellow-400 rounded-2xl border border-neutral-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.completedWorkouts || 0}</span>
            <span className="text-xs font-medium text-neutral-400">out of {stats?.totalWorkouts || 0}</span>
          </div>
          <div className="mt-3 text-xs text-neutral-300 flex items-center gap-1 font-medium">
            100% focused on progress
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-yellow-400/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Volume Lifted</span>
            <div className="p-2.5 bg-yellow-400/15 text-yellow-400 rounded-2xl">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {(stats?.totalVolumeKg || 0).toLocaleString()}
            </span>
            <span className="text-xs font-medium text-neutral-400">{user?.unitPreference || 'kg'} total</span>
          </div>
          <div className="mt-3 text-xs text-yellow-400 flex items-center gap-1 font-bold">
            {stats?.personalRecords?.length || 0} PRs registered
          </div>
        </div>

        {/* Body Weight */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-yellow-400/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Latest Weight</span>
            <div className="p-2.5 bg-neutral-900 text-white rounded-2xl border border-neutral-800">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {latestMetric ? latestMetric.weight : '--'}
            </span>
            <span className="text-xs font-medium text-neutral-400">{latestMetric?.unit || user?.unitPreference || 'kg'}</span>
          </div>
          <div className="mt-3 text-xs text-neutral-400 font-medium">
            {latestMetric ? `Logged on ${latestMetric.date}` : 'No weight logged yet'}
          </div>
        </div>
      </div>

      {/* Main Section: 7-day consistency bar & Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Consistency & Quick Weight Logger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consistency Streak Bar */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                Past 7 Days Consistency
              </h2>
              <span className="text-xs text-neutral-400 font-medium">Weekly rhythm</span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
              {last7Days.map((day) => (
                <div
                  key={day.date}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition ${
                    day.isCompleted
                      ? 'bg-yellow-400/15 border-yellow-400/50 text-yellow-400'
                      : day.isToday
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-900/40 border-neutral-900 text-neutral-500'
                  }`}
                >
                  <span className="text-xs font-black uppercase">{day.dayLabel}</span>
                  <div className="my-2">
                    {day.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center text-[10px] ${
                          day.isToday ? 'border-yellow-400 text-yellow-400' : 'border-neutral-800 text-neutral-600'
                        }`}
                      >
                        {day.isToday ? 'Now' : '—'}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">{day.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Workout Quick Card */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-yellow-400" />
                Today's Workout Notes
              </h2>
              <span className="text-xs text-neutral-400 font-bold">{todayStr}</span>
            </div>

            {todayLog ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div>
                    <h3 className="font-bold text-white text-base">{todayLog.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
                      <span>{todayLog.exercises?.length || 0} exercises</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-400" /> {todayLog.durationMinutes || 0} mins
                      </span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      todayLog.completed
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    {todayLog.completed ? 'Finished' : 'In Progress'}
                  </span>
                </div>

                {todayLog.exercises?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-neutral-400">Exercises Today:</span>
                    <div className="flex flex-wrap gap-2">
                      {todayLog.exercises.map((ex, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-200"
                        >
                          {ex.name} ({ex.sets?.length || 0} sets)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to="/daily"
                  className="inline-flex items-center gap-2 text-sm font-bold text-yellow-400 hover:underline transition"
                >
                  Edit or Add More Sets <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-neutral-800 rounded-2xl">
                <Dumbbell className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No workout logged yet for today.</p>
                <Link
                  to="/daily"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-black text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Workout for Today
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Log Body Weight & Recent Workouts */}
        <div className="space-y-6">
          {/* Quick Weight Logger */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-yellow-400" />
              Quick Log Body Weight
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Keep your body weight timeline consistent for progress tracking.
            </p>

            <form onSubmit={handleQuickWeightSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder={`e.g. 75.5 (${user?.unitPreference || 'kg'})`}
                  value={quickWeight}
                  onChange={(e) => setQuickWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                type="submit"
                disabled={submittingWeight}
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-xs transition disabled:opacity-50 cursor-pointer"
              >
                {submittingWeight ? '...' : 'Save'}
              </button>
            </form>
          </div>

          {/* Recent Workout History */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Recent Workouts</h2>
              <Link to="/daily" className="text-xs text-yellow-400 hover:underline font-bold">
                View all
              </Link>
            </div>

            {recentLogs.length > 0 ? (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{log.title}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {log.date} • {log.exercises?.length || 0} exercises
                      </div>
                    </div>
                    {log.completed ? (
                      <span className="p-1 rounded-full bg-yellow-400/20 text-yellow-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-full font-bold">
                        Incomplete
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">No workout records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
