// «Сегодня». Главное действие — отметить привычку выполненной.
// Прогресс дня — тихая строка с числом и тонкой полосой.

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
        <div className="mt-6 rounded-lg border border-dashed border-[#e5e7eb] p-6 text-center">
          <p className="text-base">Пока нет привычек</p>
          <p className="mt-1 text-sm text-[#6b7280]">
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
        <p className="mt-1 text-sm text-[#6b7280]">
          {new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </header>

      {/* Прогресс дня */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-[#6b7280]">Выполнено</span>
          <span className="text-[#1a1a1a]">
            {doneCount} из {total}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
          <div
            className="h-full bg-[#16a34a] transition-all"
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Список привычек */}
      <ul className="mt-6 space-y-2">
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