import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutAPI, exerciseAPI, planAPI } from '../services/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Save,
  Dumbbell,
  Clock,
  FileText,
  Search,
  X
} from 'lucide-react';

const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Core',
  'Cardio',
];

export default function DailyLog() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Date state (defaults to query param or today YYYY-MM-DD)
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Workout state
  const [logId, setLogId] = useState(null);
  const [title, setTitle] = useState('Daily Workout');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [exercises, setExercises] = useState([]);

  // Catalog & templates
  const [availableExercises, setAvailableExercises] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');

  // Load available exercises and routine templates once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [exRes, plansRes] = await Promise.all([
          exerciseAPI.getExercises(),
          planAPI.getPlans(),
        ]);
        if (exRes.data.success) setAvailableExercises(exRes.data.data);
        if (plansRes.data.success) setSavedPlans(plansRes.data.data);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch log whenever selectedDate changes
  useEffect(() => {
    fetchLogForDate(selectedDate);
    setSearchParams({ date: selectedDate });
  }, [selectedDate]);

  const fetchLogForDate = async (dateStr) => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      const res = await workoutAPI.getByDate(dateStr);
      if (res.data.success && res.data.data) {
        const log = res.data.data;
        setLogId(log._id);
        setTitle(log.title || 'Daily Workout');
        setDurationMinutes(log.durationMinutes || 0);
        setNotes(log.notes || '');
        setCompleted(log.completed || false);
        setExercises(log.exercises || []);
      } else {
        // Reset for empty day
        setLogId(null);
        setTitle('Daily Workout');
        setDurationMinutes(0);
        setNotes('');
        setCompleted(false);
        setExercises([]);
      }
    } catch (err) {
      console.error('Error fetching workout log:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (daysOffset) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + daysOffset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Add exercise to daily log
  const handleAddExercise = (exerciseItem) => {
    const newExercise = {
      exerciseId: exerciseItem._id,
      name: exerciseItem.name,
      muscleGroup: exerciseItem.muscleGroup,
      gifUrl: exerciseItem.gifUrl || '',
      notes: '',
      sets: [
        { setNumber: 1, weight: 0, reps: 10, completed: false },
        { setNumber: 2, weight: 0, reps: 10, completed: false },
        { setNumber: 3, weight: 0, reps: 10, completed: false },
      ],
    };
    setExercises([...exercises, newExercise]);
    setShowAddExerciseModal(false);
    setExerciseSearch('');
  };

  // Remove exercise from daily log
  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // Sets manipulation
  const handleAddSet = (exerciseIndex) => {
    const updated = [...exercises];
    const targetSets = updated[exerciseIndex].sets;
    const lastSet = targetSets[targetSets.length - 1];
    targetSets.push({
      setNumber: targetSets.length + 1,
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    // Re-index remaining sets
    updated[exerciseIndex].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    setExercises(updated);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleExerciseNotesChange = (exerciseIndex, val) => {
    const updated = [...exercises];
    updated[exerciseIndex].notes = val;
    setExercises(updated);
  };

  // Load a routine template into this workout
  const handleApplyTemplate = (planId) => {
    const plan = savedPlans.find((p) => p._id === planId);
    if (!plan) return;

    setTitle(plan.title);
    const templatedExercises = plan.exercises.map((ex) => {
      const numSets = ex.targetSets || 3;
      const parsedReps = parseInt(ex.targetReps, 10) || 10;
      return {
        exerciseId: ex.exerciseId,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        gifUrl: ex.gifUrl || '',
        notes: '',
        sets: Array.from({ length: numSets }, (_, i) => ({
          setNumber: i + 1,
          weight: 0,
          reps: parsedReps,
          completed: false,
        })),
      };
    });
    setExercises(templatedExercises);
  };

  // Save or update daily log
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      const payload = {
        date: selectedDate,
        title,
        durationMinutes: Number(durationMinutes),
        exercises,
        notes,
        completed,
      };

      const res = await workoutAPI.saveLog(payload);
      if (res.data.success) {
        setLogId(res.data.data._id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving workout log:', err);
      alert('Failed to save workout log. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Filter exercises for modal
  const filteredExercises = availableExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle =
      selectedMuscleFilter === 'All' || ex.muscleGroup === selectedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Date Header & Navigation in Black & Yellow */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 rounded-2xl border border-neutral-800">
            <CalendarIcon className="w-4 h-4 text-yellow-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleDateChange(1)}
            className="p-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3.5 py-2 rounded-2xl text-xs font-black bg-yellow-400 text-black hover:bg-yellow-300 transition"
          >
            Today
          </button>
        </div>

        {/* Load Template selector */}
        {savedPlans.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-bold hidden sm:inline">Apply Routine:</span>
            <select
              onChange={(e) => handleApplyTemplate(e.target.value)}
              defaultValue=""
              className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" disabled>
                Select Routine Template...
              </option>
              {savedPlans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.title} ({plan.exercises?.length || 0} exercises)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Workout Metadata Details */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Workout Routine Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chest & Triceps Hypertrophy"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-yellow-400" /> Duration (mins)
            </label>
            <input
              type="number"
              min="0"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="45"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            />
          </div>
        </div>

        {/* Workout Completion Switch */}
        <div className="pt-3 flex items-center justify-between border-t border-neutral-800">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setCompleted(!completed)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center border transition ${
                completed
                  ? 'bg-yellow-400 border-yellow-400 text-black'
                  : 'border-neutral-700 bg-neutral-900 text-transparent group-hover:border-neutral-500'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className={`text-sm font-bold transition ${completed ? 'text-yellow-400' : 'text-neutral-300'}`}>
              {completed ? 'Workout Completed! 🏆' : 'Mark as Workout Completed'}
            </span>
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-xl cursor-pointer ${
              saveSuccess
                ? 'bg-white text-black'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-400/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Workout'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Logged Exercises List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-yellow-400" />
            Exercises ({exercises.length})
          </h2>

          <button
            onClick={() => setShowAddExerciseModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black shadow-lg shadow-yellow-400/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Exercise
          </button>
        </div>

        {exercises.length === 0 ? (
          <div className="bg-neutral-950 border border-dashed border-neutral-800 rounded-3xl p-10 text-center">
            <Dumbbell className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-white font-bold text-base">No exercises logged for this date</h3>
            <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
              Click "+ Add Exercise" or choose a routine template above to start recording your sets and reps.
            </p>
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="mt-4 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black shadow-lg shadow-yellow-400/20 transition"
            >
              Add First Exercise
            </button>
          </div>
        ) : (
          exercises.map((exercise, exIndex) => (
            <div
              key={exIndex}
              className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
            >
              {/* Exercise Header with Big GIF preview */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-xl bg-yellow-400 text-black font-black text-xs flex items-center justify-center shrink-0">
                    {exIndex + 1}
                  </span>

                  {exercise.gifUrl && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center p-1 shrink-0 shadow-inner">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-black text-white">{exercise.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-yellow-400/15 text-yellow-400 font-bold border border-yellow-400/30">
                      {exercise.muscleGroup}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveExercise(exIndex)}
                  className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-xl transition"
                  title="Remove Exercise"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-neutral-400 border-b border-neutral-800">
                      <th className="pb-2 w-16 text-center font-bold">SET</th>
                      <th className="pb-2 w-32 font-bold">WEIGHT ({user?.unitPreference || 'kg'})</th>
                      <th className="pb-2 w-32 font-bold">REPS</th>
                      <th className="pb-2 w-20 text-center font-bold">DONE</th>
                      <th className="pb-2 w-12 text-center font-bold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {exercise.sets.map((set, sIndex) => (
                      <tr key={sIndex} className="hover:bg-neutral-900/40">
                        <td className="py-2.5 text-center font-black text-neutral-300">
                          {set.setNumber}
                        </td>
                        <td className="py-2.5 pr-2">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={set.weight}
                            onChange={(e) =>
                              handleSetChange(exIndex, sIndex, 'weight', Number(e.target.value))
                            }
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          />
                        </td>
                        <td className="py-2.5 pr-2">
                          <input
                            type="number"
                            min="0"
                            value={set.reps}
                            onChange={(e) =>
                              handleSetChange(exIndex, sIndex, 'reps', Number(e.target.value))
                            }
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          />
                        </td>
                        <td className="py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleSetChange(exIndex, sIndex, 'completed', !set.completed)
                            }
                            className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center border transition cursor-pointer ${
                              set.completed
                                ? 'bg-yellow-400 border-yellow-400 text-black'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </td>
                        <td className="py-2.5 text-center">
                          {exercise.sets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(exIndex, sIndex)}
                              className="p-1 text-neutral-500 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Set Action & Exercise Notes */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleAddSet(exIndex)}
                  className="flex items-center gap-1.5 text-xs font-black text-yellow-400 hover:text-yellow-300 py-1"
                >
                  <Plus className="w-4 h-4" /> Add Set
                </button>

                <input
                  type="text"
                  placeholder="Notes for this exercise (e.g. drop set, pause reps)..."
                  value={exercise.notes || ''}
                  onChange={(e) => handleExerciseNotesChange(exIndex, e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Daily Reflection / General Notes */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-yellow-400" /> Daily Workout Notes & Reflections
        </label>
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did you feel today? Energy levels, nutrition, sleep quality, soreness notes..."
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-neutral-500"
        />
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl cursor-pointer ${
            saveSuccess
              ? 'bg-white text-black'
              : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-400/20'
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> All Changes Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : "Save Today's Notes"}
            </>
          )}
        </button>
      </div>

      {/* Modal: Add Exercise (Black & Yellow, Big Frame, Big GIFs, Multi-Category) */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-yellow-400" />
                  Add Exercise to Workout
                </h3>
                <p className="text-sm text-neutral-400 mt-0.5">
                  Choose from catalog or search ({availableExercises.length} total exercises available)
                </p>
              </div>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="p-2.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search & Muscle Filters */}
            <div className="p-5 border-b border-neutral-800 space-y-4 bg-neutral-950">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search exercise by name (e.g. Incline Bench, Preacher Curl, Russian Twist)..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                />
              </div>

              {/* Muscle filter buttons including Biceps, Triceps, Forearms */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {MUSCLE_GROUPS.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => setSelectedMuscleFilter(muscle)}
                    className={`px-4 py-2 rounded-2xl font-black whitespace-nowrap transition ${
                      selectedMuscleFilter === muscle
                        ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/25'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise Cards Grid with Big GIFs */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-black">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 text-sm">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                  No matching exercises found for "{exerciseSearch}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredExercises.map((ex) => (
                    <div
                      key={ex._id}
                      onClick={() => handleAddExercise(ex)}
                      className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-yellow-400/60 rounded-3xl p-4 cursor-pointer flex flex-col justify-between group transition-all shadow-xl hover:shadow-yellow-400/10 hover:-translate-y-0.5"
                    >
                      <div>
                        {/* Big Animated GIF Frame */}
                        <div className="w-full h-44 sm:h-48 bg-black rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center p-2 mb-3.5 relative group-hover:border-yellow-400/40 transition">
                          {ex.gifUrl ? (
                            <img
                              src={ex.gifUrl}
                              alt={ex.name}
                              loading="lazy"
                              className="max-h-full max-w-full object-contain rounded-xl transition duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-neutral-600">
                              <Dumbbell className="w-10 h-10 mb-1" />
                              <span className="text-xs">No Animation</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Muscle Tags */}
                        <h4 className="font-bold text-base text-white group-hover:text-yellow-400 transition leading-snug line-clamp-1">
                          {ex.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 mb-3">
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-yellow-400/15 text-yellow-400 border border-yellow-400/30">
                            {ex.muscleGroup}
                          </span>
                          <span className="text-xs text-neutral-400 truncate">
                            • {ex.equipment || 'Standard'}
                          </span>
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black font-black text-xs transition duration-200"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" /> Add to Workout
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
