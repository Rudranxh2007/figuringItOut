import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planAPI, exerciseAPI } from '../services/api';
import {
  ListPlus,
  Plus,
  Trash2,
  Calendar,
  Dumbbell,
  Play,
  X
} from 'lucide-react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Planner() {
  const [plans, setPlans] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // New Routine Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [plannedExercises, setPlannedExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState('8-12');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const [plansRes, exRes] = await Promise.all([
        planAPI.getPlans(),
        exerciseAPI.getExercises(),
      ]);
      if (plansRes.data.success) setPlans(plansRes.data.data);
      if (exRes.data.success) setAvailableExercises(exRes.data.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleAddExerciseToRoutine = () => {
    if (!selectedExerciseId) return;
    const found = availableExercises.find((e) => e._id === selectedExerciseId);
    if (!found) return;

    setPlannedExercises([
      ...plannedExercises,
      {
        exerciseId: found._id,
        name: found.name,
        muscleGroup: found.muscleGroup,
        gifUrl: found.gifUrl || '',
        targetSets: Number(targetSets),
        targetReps: targetReps || '8-12',
      },
    ]);
    setSelectedExerciseId('');
  };

  const handleRemoveExerciseFromRoutine = (index) => {
    setPlannedExercises(plannedExercises.filter((_, i) => i !== index));
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const payload = {
        title: newTitle,
        description: newDescription,
        dayOfWeek: selectedDays,
        exercises: plannedExercises,
      };

      const res = await planAPI.createPlan(payload);
      if (res.data.success) {
        setPlans([res.data.data, ...plans]);
        setShowCreateModal(false);
        setNewTitle('');
        setNewDescription('');
        setSelectedDays([]);
        setPlannedExercises([]);
      }
    } catch (err) {
      console.error('Error creating routine plan:', err);
      alert('Could not save routine');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) return;
    try {
      await planAPI.deletePlan(id);
      setPlans(plans.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  const handleStartRoutineToday = (plan) => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/daily?date=${today}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ListPlus className="w-7 h-7 text-yellow-400" />
            Workout Routines & Weekly Schedule
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Design your weekly splits and populate daily workout logs in one click.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm shadow-xl shadow-yellow-400/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Create Routine
        </button>
      </div>

      {/* Routine Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-neutral-950 border border-dashed border-neutral-800 rounded-3xl p-16 text-center">
          <Dumbbell className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg">No routines created yet</h3>
          <p className="text-neutral-400 text-xs mt-1 max-w-md mx-auto">
            Build your custom routines (e.g. Chest & Triceps, Back & Biceps, Leg Day) to keep your progress on point.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-5 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black transition shadow-xl shadow-yellow-400/20"
          >
            Create Your First Routine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-neutral-950 border border-neutral-800 hover:border-yellow-400/60 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition">
                    {plan.title}
                  </h3>
                  <button
                    onClick={() => handleDeletePlan(plan._id)}
                    className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-xl transition"
                    title="Delete Routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {plan.description && (
                  <p className="text-xs text-neutral-400 mb-4">{plan.description}</p>
                )}

                {/* Days Scheduled Badge */}
                <div className="mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block mb-2">
                    Assigned Days:
                  </span>
                  <div className="flex gap-1.5">
                    {DAYS_OF_WEEK.map((day, idx) => {
                      const isAssigned = plan.dayOfWeek?.includes(idx);
                      return (
                        <span
                          key={day}
                          className={`text-[10px] font-black px-2.5 py-1 rounded-xl ${
                            isAssigned
                              ? 'bg-yellow-400 text-black shadow-sm shadow-yellow-400/30'
                              : 'bg-neutral-900 text-neutral-600'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Exercise Preview List */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                    Exercises ({plan.exercises?.length || 0}):
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {plan.exercises?.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800"
                      >
                        <span className="font-bold text-neutral-200">{ex.name}</span>
                        <span className="text-yellow-400 font-bold text-[11px]">
                          {ex.targetSets}s × {ex.targetReps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartRoutineToday(plan)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black border border-yellow-400/30 rounded-2xl text-xs font-black transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Log this Routine Today
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Routine */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Create Workout Routine</h3>
                <p className="text-xs text-neutral-400">Define exercises and target sets/reps</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Routine Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest & Triceps Blast"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Description / Focus (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy bench press followed by triceps isolation"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Day selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Schedule on Days of Week
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map((day, idx) => {
                    const isSelected = selectedDays.includes(idx);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(idx)}
                        className={`py-2 rounded-2xl text-xs font-black transition ${
                          isSelected
                            ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/25'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exercises in Routine */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Add Exercises to Routine
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <select
                      value={selectedExerciseId}
                      onChange={(e) => setSelectedExerciseId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Exercise...</option>
                      {availableExercises.map((ex) => (
                        <option key={ex._id} value={ex._id}>
                          {ex.name} ({ex.muscleGroup})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={targetSets}
                      onChange={(e) => setTargetSets(e.target.value)}
                      placeholder="Sets"
                      className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      title="Target Sets"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={targetReps}
                      onChange={(e) => setTargetReps(e.target.value)}
                      placeholder="8-12"
                      className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      title="Target Reps"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddExerciseToRoutine}
                      className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Added exercise items */}
                {plannedExercises.length > 0 && (
                  <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                    {plannedExercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white">{ex.name}</span>
                          <span className="text-neutral-400 ml-2">({ex.muscleGroup})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 font-bold">
                            {ex.targetSets} sets × {ex.targetReps}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromRoutine(idx)}
                            className="text-neutral-500 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-2xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black shadow-xl shadow-yellow-400/20 transition cursor-pointer"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
