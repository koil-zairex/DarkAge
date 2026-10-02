// Страница «Статистика».
// Переключатель периода: 7 дней / месяц / всё время.
// Процент считается от количества прошедших дней с момента создания привычки,
// а не от фиксированного окна. Будущие дни в расчёт не берутся.

import { useState } from 'react';
import { toISODate } from '../mockHabits';

// Опции периода: значение в днях (null = всё время) + подпись
const PERIODS = [
  { id: 'week',  label: '7 дней',    days: 7 },
  { id: 'month', label: 'Месяц',     days: 30 },
  { id: 'all',   label: 'Всё время', days: null },
];

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

// Сколько прошло дней между двумя датами (включительно).
// created — 'YYYY-MM-DD' или undefined (тогда считаем, что привычка существует давно).
// Возвращает число дней, но не больше maxDays и не меньше 1.
function elapsedDays(created, maxDays) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start;
  if (created) {
    start = new Date(created);
    start.setHours(0, 0, 0, 0);
  } else {
    // Нет даты создания — считаем, что привычка существует весь период
    start = new Date(today);
    start.setDate(start.getDate() - (maxDays ?? 365));
  }

  // Разница в днях + 1 (день создания считается прошедшим днём)
  const diffMs = today - start;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  if (days < 1) return 1;                    // на всякий случай
  if (maxDays == null) return days;          // «всё время»
  return Math.min(days, maxDays);            // не больше окна периода
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

// % выполнения за период с учётом даты создания привычки.
// days = null → весь период с createdAt до сегодня.
function completionRate(entries, habit, days) {
  // Сколько дней реально прошло (не больше периода и не больше жизни привычки)
  const elapsed = elapsedDays(habit.createdAt, days);

  // Список дат для расчёта: последние `elapsed` дней включая сегодня
  const range = lastNDays(elapsed);

  const done = range.filter((date) =>
    entries.some(
      (e) => e.habitId === habit.id && e.date === date && e.completed
    )
  ).length;

  return Math.round((done / elapsed) * 100);
}

export default function StatsPage({ habits, entries }) {
  // Текущий период — по умолчанию 7 дней
  const [periodId, setPeriodId] = useState('week');
  const period = PERIODS.find((p) => p.id === periodId);

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

      {/* Переключатель периода */}
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {PERIODS.map((p) => {
          const active = p.id === periodId;
          return (
            <button
              key={p.id}
              onClick={() => setPeriodId(p.id)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm transition ${
                active
                  ? 'bg-white font-medium shadow-sm dark:bg-slate-700'
                  : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-700/60'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Проценты считаются от количества прошедших дней с момента создания привычки.
      </p>

      <ul className="space-y-3">
        {habits.map((habit) => {
          const cs = currentStreak(entries, habit.id);
          const bs = bestStreak(entries, habit.id);
          const rate = completionRate(entries, habit, period.days);
          const elapsed = elapsedDays(habit.createdAt, period.days);

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

// Хелпер для подписи под процентом: «1 день», «3 дня», «7 дней»
function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}