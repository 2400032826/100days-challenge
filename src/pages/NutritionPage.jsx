import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Droplets, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';

export default function NutritionPage() {
  const { data, activeDayNumber, currentDayData, addMeal, updateWater, isFutureDay } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', time: '13:00' });

  const nutrition = currentDayData?.nutrition || { calories: 0, protein: 0, water: 0, meals: [] };
  const isFuture = isFutureDay(activeDayNumber);
  const proteinTarget = 130;
  const waterTarget = 3.0;

  const handleSaveMeal = (e) => {
    e.preventDefault();
    if (!mealForm.name.trim()) return;
    addMeal(activeDayNumber, mealForm);
    setMealForm({ name: '', calories: '', protein: '', time: '13:00' });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            METABOLIC FUEL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            NUTRITION & HYDRATION
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Hit protein goals, fuel cleanly, and track real fluid intake. Everything starts at zero.
          </p>
        </div>

        {!isFuture && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="arc-btn-primary"
          >
            <Plus size={16} />
            <span>+ Add Meal</span>
          </button>
        )}
      </div>

      {/* Target Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Protein */}
        <div className="arc-card p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-semibold text-[#64748B] block">Protein Target</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                {nutrition.protein}g <span className="text-sm font-medium text-[#64748B]">/ {proteinTarget}g</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              🥩
            </div>
          </div>
          <ProgressBar value={nutrition.protein} max={proteinTarget} height="h-2.5" />
          <span className="text-[11px] text-[#64748B] block mt-2">
            {Math.max(0, proteinTarget - nutrition.protein)}g remaining to reach daily goal
          </span>
        </div>

        {/* Water */}
        <div className="arc-card p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-semibold text-[#64748B] block">Water Target</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
                {nutrition.water}L <span className="text-sm font-medium text-[#64748B]">/ {waterTarget}L</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplets size={20} />
            </div>
          </div>
          <ProgressBar value={nutrition.water} max={waterTarget} height="h-2.5" color="bg-sky-500" />
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              disabled={isFuture}
              onClick={() => updateWater(activeDayNumber, 0.25)}
              className="arc-btn-secondary text-xs py-1 px-2.5"
            >
              +250ml
            </button>
            <button
              type="button"
              disabled={isFuture}
              onClick={() => updateWater(activeDayNumber, 0.5)}
              className="arc-btn-secondary text-xs py-1 px-2.5"
            >
              +500ml
            </button>
            <button
              type="button"
              disabled={isFuture}
              onClick={() => updateWater(activeDayNumber, 1.0)}
              className="arc-btn-secondary text-xs py-1 px-2.5"
            >
              +1.0L
            </button>
          </div>
        </div>
      </div>

      {/* Meals Log */}
      <div className="arc-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Day {activeDayNumber} Meals</h3>
          <span className="text-xs font-semibold text-[#2563EB]">Total: {nutrition.calories} kcal</span>
        </div>

        {(nutrition.meals || []).length === 0 ? (
          <p className="text-xs text-[#64748B] italic py-8 text-center">
            No meals logged for Day {activeDayNumber}. Add your real meals and protein intake.
          </p>
        ) : (
          <div className="space-y-3">
            {nutrition.meals.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">{m.name}</span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">{m.time}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#2563EB] block">{m.protein}g protein</span>
                  <span className="text-[11px] text-[#64748B] block">{m.calories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Meal" subtitle={`Day ${activeDayNumber}`}>
        <form onSubmit={handleSaveMeal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Meal Description</label>
            <input
              type="text"
              required
              placeholder="e.g. 4 Eggs, Sourdough & Avocado"
              value={mealForm.name}
              onChange={e => setMealForm({ ...mealForm, name: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Calories (kcal)</label>
              <input
                type="number"
                placeholder="600"
                value={mealForm.calories}
                onChange={e => setMealForm({ ...mealForm, calories: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Protein (g)</label>
              <input
                type="number"
                placeholder="40"
                value={mealForm.protein}
                onChange={e => setMealForm({ ...mealForm, protein: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Time</label>
            <input
              type="time"
              value={mealForm.time}
              onChange={e => setMealForm({ ...mealForm, time: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary text-xs">
              Save Meal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
