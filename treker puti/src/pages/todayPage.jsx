// «Сегодня». Главное действие — отметить привычку выполненной.
// Все цвета через CSS-переменные — работают в обеих темах.

import HabitItem from '../components/HabitItem';
import { toISODate } from '../mockHabits';

export default function TodayPage({ habits, entries, onToggle }) {
  const today = toISODate(new Date());

  const isDone = (habitId) =>
    entries.some((e) => e.habitId === habitId && e.date === today && e.completed);

  const doneCount = habits.filter((h) => isDone(h.id)).length;
  const total = habits.length;

  // Пустое состояние
  if (total === 0) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Сегодня</h1>
        <div
          className="mt-6 rounded-lg border border-dashed p-6 text-center"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-base">Пока нет привычек</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Перейдите во вкладку «Привычки» и добавьте первую.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <header>
        <h1 className="text-2xl font-semibold">Сегодня</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          {new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </header>

      {/* Прогресс дня — отступ mb-6 от заголовка */}
      <div className="mb-6 mt-6">
        <div className="flex items-baseline justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Выполнено</span>
          <span style={{ color: 'var(--text)' }}>
            {doneCount} из {total}
          </span>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full"
          style={{ background: 'var(--border)' }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${total ? (doneCount / total) * 100 : 0}%`,
              background: 'var(--accent)',
            }}
          />
        </div>
      </div>

      {/* Список привычек — без лишнего mt, отступ даёт mb-6 у блока выше */}
      <ul className="space-y-2">
        {habits.map((habit) => (
          <li key={habit.id}>
            <HabitItem
              habit={habit}
              checked={isDone(habit.id)}
              onToggle={() => onToggle(habit.id, today)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}