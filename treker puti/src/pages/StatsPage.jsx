// «Статистика». Главное действие — переключатель периода.
// Цифры спокойные, три колонки в ряд, без цветных плашек.

import { useState } from 'react';
import { toISODate } from '../mockHabits';

const PERIODS = [
  { id: 'week',  label: '7 дней',    days: 7 },
  { id: 'month', label: 'Месяц',     days: 30 },
  { id: 'all',   label: 'Всё время', days: null },
];

function lastNDays(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(toISODate(d));
  }
  return arr;
}

// Сколько реально прошло дней с момента создания привычки
// (не больше окна периода). Будущие дни не считаются.
function elapsedDays(created, maxDays) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start;
  if (created) {
    start = new Date(created);
    start.setHours(0, 0, 0, 0);
  } else {
    start = new Date(today);
    start.setDate(start.getDate() - (maxDays ?? 365));
  }

  const days = Math.floor((today - start) / 86400000) + 1;
  if (days < 1) return 1;
  if (maxDays == null) return days;
  return Math.min(days, maxDays);
}

function currentStreak(entries, habitId) {
  const done = new Set(
    entries.filter((e) => e.habitId === habitId && e.completed).map((e) => e.date)
  );
  let streak = 0;
  const d = new Date();
  if (!done.has(toISODate(d))) d.setDate(d.getDate() - 1);
  while (done.has(toISODate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

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
      const diff = (new Date(date) - new Date(prev)) / 86400000;
      cur = diff === 1 ? cur + 1 : 1;
    } else {
      cur = 1;
    }
    best = Math.max(best, cur);
    prev = date;
  }
  return best;
}

function completionRate(entries, habit, days) {
  const elapsed = elapsedDays(habit.createdAt, days);
  const range = lastNDays(elapsed);
  const done = range.filter((date) =>
    entries.some((e) => e.habitId === habit.id && e.date === date && e.completed)
  ).length;
  return Math.round((done / elapsed) * 100);
}

function pluralDays(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'день';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'дня';
  return 'дней';
}

export default function StatsPage({ habits, entries }) {
  const [periodId, setPeriodId] = useState('week');
  const period = PERIODS.find((p) => p.id === periodId);

  // Empty state
  if (habits.length === 0) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Статистика</h1>
        <div className="mt-6 rounded-lg border border-dashed border-[#e5e7eb] p-6 text-center">
          <p className="text-base">Нет данных для статистики</p>
          <p className="mt-1 text-sm text-[#6b7280]">
            Перейдите во вкладку «Привычки» и добавьте первую.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Статистика</h1>

      {/* Переключатель периода — главное действие экрана */}
      <div className="mt-6 flex gap-2">
        {PERIODS.map((p) => {
          const active = p.id === periodId;
          return (
            <button
              key={p.id}
              onClick={() => setPeriodId(p.id)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? 'border-[#16a34a] bg-[#16a34a] font-medium text-white'
                  : 'border-[#e5e7eb] text-[#6b7280] hover:text-[#1a1a1a]'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 space-y-2">
        {habits.map((habit) => {
          const cs = currentStreak(entries, habit.id);
          const bs = bestStreak(entries, habit.id);
          const rate = completionRate(entries, habit, period.days);
          const elapsed = elapsedDays(habit.createdAt, period.days);

          return (
            <li
              key={habit.id}
              className="rounded-lg border border-[#e5e7eb] bg-white p-4"
            >
              <div className="text-base">{habit.title}</div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-lg font-semibold">{cs}</div>
                  <div className="mt-1 text-sm text-[#6b7280]">
                    текущая серия
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{bs}</div>
                  <div className="mt-1 text-sm text-[#6b7280]">
                    лучшая серия
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{rate}%</div>
                  <div className="mt-1 text-sm text-[#6b7280]">
                    за {elapsed} {pluralDays(elapsed)}
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