import React, { useState, useEffect } from 'react';
import { exerciseAPI } from '../services/api';
import { BookOpen, Search, Plus, Trash2, Dumbbell } from 'lucide-react';

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

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Custom Exercise Form
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Chest');
  const [equipment, setEquipment] = useState('Dumbbells');
  const [description, setDescription] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await exerciseAPI.getExercises();
      if (res.data.success) {
        setExercises(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      setSubmitting(true);
      const res = await exerciseAPI.createCustom({
        name,
        muscleGroup,
        equipment,
        description,
        gifUrl,
      });

      if (res.data.success) {
        setExercises([...exercises, res.data.data]);
        setShowCreateModal(false);
        setName('');
        setDescription('');
        setGifUrl('');
      }
    } catch (err) {
      console.error('Error creating custom exercise:', err);
      alert('Could not save custom exercise');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Delete this custom exercise?')) return;
    try {
      await exerciseAPI.deleteCustom(id);
      setExercises(exercises.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Error deleting custom exercise:', err);
    }
  };

  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-yellow-400" />
            Exercise Library with Animated Demos
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {exercises.length} exercises cataloged across Chest, Back, Legs, Shoulders, Biceps, Triceps, Forearms, Core & Cardio.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm shadow-xl shadow-yellow-400/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Custom Exercise
        </button>
      </div>

      {/* Search & Muscle Filters */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search exercises by name, muscle, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
          />
        </div>

        {/* Muscle group tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {MUSCLE_GROUPS.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-4 py-2 rounded-2xl font-black whitespace-nowrap transition ${
                selectedMuscle === muscle
                  ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/25'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-neutral-950 border border-dashed border-neutral-800 rounded-3xl p-16 text-center text-neutral-400">
          <Dumbbell className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          No exercises match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ex) => (
            <div
              key={ex._id}
              className="bg-neutral-950 border border-neutral-800 hover:border-yellow-400/60 rounded-3xl p-5 shadow-2xl flex flex-col justify-between group transition overflow-hidden"
            >
              <div>
                {/* Exercise Animated Demonstration GIF */}
                <div className="w-full h-52 bg-black rounded-2xl mb-4 overflow-hidden border border-neutral-800 flex items-center justify-center p-2 relative group-hover:border-yellow-400/40 transition">
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
                      <Dumbbell className="w-12 h-12 mb-1" />
                      <span className="text-xs">No Animation</span>
                    </div>
                  )}
                </div>

                {/* Exercise Details */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-yellow-400 transition leading-snug">
                    {ex.name}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {ex.isCustom && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-black border border-yellow-400/40">
                        Custom
                      </span>
                    )}
                    {ex.isCustom && (
                      <button
                        onClick={() => handleDeleteExercise(ex._id)}
                        className="p-1 text-neutral-500 hover:text-white"
                        title="Delete custom exercise"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-xl bg-yellow-400/15 text-yellow-400 text-xs font-black border border-yellow-400/30">
                    {ex.muscleGroup}
                  </span>
                  <span className="text-xs text-neutral-400">
                    • {ex.equipment || 'Standard Equipment'}
                  </span>
                </div>

                {ex.description && (
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {ex.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Custom Exercise */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-yellow-400" /> Create Custom Exercise
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spider Curls"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Muscle Group
                  </label>
                  <select
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {MUSCLE_GROUPS.filter((m) => m !== 'All').map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Equipment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Incline Bench / Dumbbell"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Demo GIF / Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/demo.gif"
                  value={gifUrl}
                  onChange={(e) => setGifUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Instructions / Form Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Chest against bench, full extension at bottom"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-neutral-900 text-neutral-300 hover:text-white rounded-2xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs font-black shadow-lg shadow-yellow-400/20 transition cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Add Exercise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
