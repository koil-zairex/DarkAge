// «Привычки». Главное действие — «Добавить».
// Форма добавления: название + цвет (без эмодзи).
// Модалка редактирования: название + цвет, закрывается по клику на фон или по Esc.

import { useEffect, useState } from 'react';
import HabitItem from '../components/HabitItem';
import { toISODate } from '../mockHabits';

const emptyForm = { title: '', color: '#22c55e' };

export default function HabitsPage({ habits, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);

  const trimmed = form.title.trim();
  const showMinLengthError = trimmed.length > 0 && trimmed.length < 2;
  const isValid = trimmed.length >= 2;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd({
      id: 'h_' + Date.now(),
      title: trimmed,
      color: form.color,
      // Локальная дата YYYY-MM-DD, не UTC
      createdAt: toISODate(new Date()),
    });
    setForm(emptyForm);
  };

  // Модалка редактирования
  const [editing, setEditing] = useState(null);
  const openEdit = (habit) =>
    setEditing({ id: habit.id, title: habit.title, color: habit.color });

  const closeEdit = () => setEditing(null);
  const isEditValid = editing?.title.trim().length >= 2;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!isEditValid) return;
    onUpdate(editing.id, {
      title: editing.title.trim(),
      color: editing.color,
    });
    closeEdit();
  };

  // Закрытие модалки по Esc. Слушатель вешаем только когда модалка открыта.
  useEffect(() => {
    if (editing === null) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') closeEdit();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editing]);

  return (
    <section>
      <h1 className="text-2xl font-semibold">Привычки</h1>

      {/* Форма добавления */}
      <form onSubmit={handleAdd} className="mt-6">
        <label className="block text-sm" style={{ color: 'var(--muted)' }}>
          Новая привычка
        </label>
        <div className="mt-2 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Название"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-base outline-none"
              style={{
                borderColor: showMinLengthError ? 'var(--danger)' : 'var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
              }}
            />
            {showMinLengthError && (
              <p className="mt-1 text-sm" style={{ color: 'var(--danger)' }}>
                Минимум 2 символа
              </p>
            )}
          </div>

          {/* Цвет привычки — кастомный класс .color-input */}
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="color-input"
            aria-label="Цвет привычки"
          />

          <button
            type="submit"
            disabled={!isValid}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed"
            style={{
              background: isValid ? 'var(--accent)' : 'var(--border)',
              color: isValid ? '#ffffff' : 'var(--muted)',
            }}
          >
            Добавить
          </button>
        </div>
      </form>

      {/* Список */}
      {habits.length === 0 ? (
        <p className="mt-6 text-sm" style={{ color: 'var(--muted)' }}>
          Список пуст. Добавьте первую привычку выше.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={closeEdit}
        >
          <form
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg border p-6"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          >
            <h2 className="text-lg font-semibold">Изменить привычку</h2>

            <label
              className="mt-4 block text-sm"
              style={{ color: 'var(--muted)' }}
            >
              Название
            </label>
            <input
              type="text"
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className="mt-2 w-full rounded-lg border px-3 py-2 text-base outline-none"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
              }}
            />

            <label
              className="mt-4 block text-sm"
              style={{ color: 'var(--muted)' }}
            >
              Цвет
            </label>
            <input
              type="color"
              value={editing.color}
              onChange={(e) =>
                setEditing({ ...editing, color: e.target.value })
              }
              className="color-input mt-2"
              aria-label="Цвет привычки"
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg border px-4 py-2 text-sm"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--muted)',
                  background: 'transparent',
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!isEditValid}
                className="rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed"
                style={{
                  background: isEditValid ? 'var(--accent)' : 'var(--border)',
                  color: isEditValid ? '#ffffff' : 'var(--muted)',
                }}
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