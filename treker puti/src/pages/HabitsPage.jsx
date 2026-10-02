// Страница «Все привычки».
// Верхняя форма — только добавление новых привычек.
// Редактирование — в модальном окне (открывается по «✎»).

import { useState } from 'react';
import HabitItem from '../components/HabitItem';

// Пустая форма для добавления
const emptyForm = { title: '', icon: '✅', color: '#22c55e' };

export default function HabitsPage({ habits, onAdd, onUpdate, onDelete }) {
  // --- Форма добавления ---
  const [form, setForm] = useState(emptyForm);
  const isValid = form.title.trim().length > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onAdd({
      id: 'h_' + Date.now(),
      title: form.title.trim(),
      icon: form.icon || '✅',
      color: form.color,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setForm(emptyForm);
  };

  // --- Модалка редактирования ---
  // editing = null  → модалка закрыта
  // editing = { id, title, icon, color } → открыта с текущими значениями
  const [editing, setEditing] = useState(null);

  const openEdit = (habit) =>
    setEditing({
      id: habit.id,
      title: habit.title,
      icon: habit.icon,
      color: habit.color,
    });

  const closeEdit = () => setEditing(null);

  const isEditValid = editing?.title.trim().length > 0;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!isEditValid) return;

    onUpdate(editing.id, {
      title: editing.title.trim(),
      icon: editing.icon || '✅',
      color: editing.color,
    });
    closeEdit();
  };

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Все привычки</h1>

      {/* Форма добавления */}
      <form
        onSubmit={handleAdd}
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

        <button
          type="submit"
          disabled={!isValid}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Добавить
        </button>
      </form>

      {/* Список всех привычек */}
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
                onEdit={() => openEdit(habit)}
                onDelete={() => onDelete(habit.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Модалка редактирования */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeEdit} // клик по фону закрывает
        >
          <form
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()} // клик внутри не закрывает
            className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-800"
          >
            <h2 className="text-lg font-semibold">Изменить привычку</h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Название"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              />
              <input
                type="text"
                maxLength={2}
                value={editing.icon}
                onChange={(e) =>
                  setEditing({ ...editing, icon: e.target.value })
                }
                className="w-14 rounded-lg border border-slate-300 px-2 py-2 text-center text-sm dark:border-slate-600 dark:bg-slate-900"
              />
              <input
                type="color"
                value={editing.color}
                onChange={(e) =>
                  setEditing({ ...editing, color: e.target.value })
                }
                className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!isEditValid}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}