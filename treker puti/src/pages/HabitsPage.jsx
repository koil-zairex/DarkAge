// Страница «Все привычки».
// Полный список + инлайн-форма добавления/редактирования/удаления.

import { useState } from 'react';
import HabitItem from '../components/HabitItem';

// Пустая форма для добавления новой привычки
const emptyForm = { title: '', icon: '✅', color: '#22c55e' };

export default function HabitsPage({ habits, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const isValid = form.title.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    if (editingId) {
      onUpdate(editingId, { ...form, title: form.title.trim() });
    } else {
      onAdd({
        id: 'h_' + Date.now(),
        title: form.title.trim(),
        icon: form.icon || '✅',
        color: form.color,
        createdAt: new Date().toISOString().slice(0, 10),
      });
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (habit) => {
    setEditingId(habit.id);
    setForm({ title: habit.title, icon: habit.icon, color: habit.color });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Все привычки</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Название привычки"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="text"
            maxLength={2}
            placeholder="🙂"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-14 rounded-lg border border-slate-300 px-2 py-2 text-center text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {habits.length === 0 ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Список пуст. Добавьте первую привычку выше.
        </p>
      ) : (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li key={habit.id}>
              <HabitItem
                habit={habit}
                onEdit={() => startEdit(habit)}
                onDelete={() => onDelete(habit.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}