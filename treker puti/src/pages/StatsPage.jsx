// Страница «Статистика».
// По каждой привычке: текущая серия, лучшая серия, % за последние 7 дней.
// Только цифры, без графиков.

import { toISODate } from '../mockHabits';

// Собираем массив последних N дат (включая сегодня), от старых к новым
function lastNDays(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(toISODate(d));
  }
  return arr;
}

// Текущая серия: сколько дней подряд (включая сегодня) привычка выполнена.
// Если сегодня ещё не отмечено — серия считается до вчера.
function currentStreak(entries, habitId) {
  const doneSet = new Set(
    entries.filter((e) => e.habitId === habitId && e.completed).map((e) => e.date)
  );

  let streak = 0;
  const d = new Date();
  if (!doneSet.has(toISODate(d))) d.setDate(d.getDate() - 1);

  while (doneSet.has(toISODate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// Лучшая серия: самый длинный подряд идущий отрезок выполненных дней
function bestStreak(entries, habitId) {
  const dates = entries
    .filter((e) => e.habitId === habitId && e.completed)
    .map((e) => e.date)
    .sort();

  let best = 0;
  let cur = 0;
  let prev = null;

  for (const date of dates) {
    if (prev) {
      const diff = (new Date(date) - new Date(prev)) / (1000 * 60 * 60 * 24);
      cur = diff === 1 ? cur + 1 : 1;
    } else {
      cur = 1;
    }
    best = Math.max(best, cur);
    prev = date;
  }
  return best;
}

// % выполнения за последние N дней
function completionRate(entries, habitId, days) {
  const range = lastNDays(days);
  const done = range.filter((date) =>
    entries.some(
      (e) => e.habitId === habitId && e.date === date && e.completed
    )
  ).length;
  return Math.round((done / days) * 100);
}

export default function StatsPage({ habits, entries }) {
  // Empty state в стиле TodayPage — карточка с пунктирной рамкой
  if (habits.length === 0) {
    return (
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Статистика</h1>
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="text-lg font-medium">Нет данных для статистики</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Перейдите во вкладку «Все привычки» и добавьте первую.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Статистика</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Проценты — за последние 7 дней.
      </p>

      <ul className="space-y-3">
        {habits.map((habit) => {
          const cs = currentStreak(entries, habit.id);
          const bs = bestStreak(entries, habit.id);
          const rate = completionRate(entries, habit.id, 7);

          return (
            <li
              key={habit.id}
              className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{habit.icon}</span>
                <span className="font-medium">{habit.title}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
                  <div className="text-lg font-semibold">{cs}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    текущая серия
                  </div>
                </div>
                <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
                  <div className="text-lg font-semibold">{bs}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    лучшая серия
                  </div>
                </div>
                <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
                  <div className="text-lg font-semibold">{rate}%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    за 7 дней
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}