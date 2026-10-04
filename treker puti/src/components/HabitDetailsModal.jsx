// Модальное окно с деталями привычки.
// Слева — heatmap по месяцам (как GitHub-контриб),
// справа — столбики по дням за последние 30 дней.
// Всё без библиотек: div-ы + Tailwind + CSS-переменные.

import { toISODate } from '../mockHabits';

// --- Утилиты для работы с датами ---

// Все дни месяца в виде массива Date
function daysInMonth(year, month) {
  const days = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// Сдвиг первого дня месяца относительно понедельника (0 = ПН)
function firstDayOffset(year, month) {
  const d = new Date(year, month, 1).getDay(); // 0 = ВС
  return (d + 6) % 7;
}

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

// --- Heatmap: квадратики по дням месяца ---

function MonthHeatmap({ year, month, doneSet }) {
  const days = daysInMonth(year, month);
  const offset = firstDayOffset(year, month);

  // Формируем сетку: пустые ячейки в начале + дни месяца
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (const d of days) cells.push(d);

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 text-xs font-medium"
        style={{ color: 'var(--muted)' }}
      >
        {MONTH_NAMES[month]}
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: 'repeat(31, minmax(0, 1fr))' }}
      >
        {cells.map((d, i) => {
          const done = d && doneSet.has(toISODate(d));
          return (
            <span
              key={i}
              className="h-3 w-3 rounded-sm"
              style={{
                background: d
                  ? done
                    ? 'var(--accent)'
                    : 'var(--border)'
                  : 'transparent',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// --- Столбики: последние N дней ---

function DailyBars({ days = 30, doneSet }) {
  // Собираем массив дат от старых к новым
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  return (
    <div>
      <div
        className="mb-2 text-xs font-medium uppercase tracking-wide"
        style={{ color: 'var(--muted)' }}
      >
        Последние {days} дней
      </div>

      <div className="flex h-32 items-end gap-1">
        {dates.map((d, i) => {
          const done = doneSet.has(toISODate(d));
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{
                height: done ? '100%' : '4%',
                background: done ? 'var(--accent)' : 'var(--border)',
              }}
              title={`${toISODate(d)} — ${done ? 'выполнено' : 'нет'}`}
            />
          );
        })}
      </div>

      {/* Подписи начала и конца периода */}
      <div
        className="mt-2 flex justify-between text-xs"
        style={{ color: 'var(--muted)' }}
      >
        <span>{toISODate(dates[0]).slice(5)}</span>
        <span>{toISODate(dates[dates.length - 1]).slice(5)}</span>
      </div>
    </div>
  );
}

// --- Основной компонент ---

export default function HabitDetailsModal({ habit, entries, onClose }) {
  // Множество дат, когда привычка выполнена — для быстрой проверки
  const doneSet = new Set(
    entries
      .filter((e) => e.habitId === habit.id && e.completed)
      .map((e) => e.date)
  );

  // Месяцы для heatmap: текущий год, 12 месяцев
  const year = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border p-6"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
          color: 'var(--text)',
        }}
      >
        {/* Заголовок */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{habit.title}</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
              Детали за {year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm"
            style={{ color: 'var(--muted)' }}
          >
            Закрыть
          </button>
        </div>

        {/* Две колонки: heatmap слева, столбики справа */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Левая карточка — heatmap */}
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="mb-4 text-base font-semibold">{year}</div>
            <div className="space-y-2">
              {months.map((m) => (
                <MonthHeatmap
                  key={m}
                  year={year}
                  month={m}
                  doneSet={doneSet}
                />
              ))}
            </div>
          </div>

          {/* Правая карточка — столбики */}
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <DailyBars days={30} doneSet={doneSet} />
          </div>
        </div>
      </div>
    </div>
  );
}