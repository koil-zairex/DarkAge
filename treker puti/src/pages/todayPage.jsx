// Страница «Сегодня».
// Показывает список привычек с чекбоксом «выполнено» на сегодня
// и прогресс дня вида «3 из 5».

import HabitItem from '../components/HabitItem';
import { toISODate } from '../mockHabits';

export default function TodayPage({ habits, entries, onToggle }) {
  const today = toISODate(new Date());

  const isDone = (habitId) =>
    entries.some(
      (e) => e.habitId === habitId && e.date === today && e.completed
    );

  const doneCount = habits.filter((h) => isDone(h.id)).length;
  const total = habits.length;

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
        <p className="text-lg font-medium">Пока нет привычек</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Перейдите во вкладку «Все привычки» и добавьте первую.
        </p>
      </div>
    );
  }

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Сегодня</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </header>

      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="mb-2 flex justify-between text-sm">
          <span>Выполнено</span>
          <span className="font-medium">
            {doneCount} из {total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

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