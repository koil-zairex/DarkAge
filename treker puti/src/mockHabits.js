// Моковые данные для первого запуска приложения.
// Когда localStorage пуст — берём эти данные как стартовые.

export const mockHabits = [
  { id: 'h1', title: 'Пить воду',     color: '#38bdf8', createdAt: '2026-09-01' },
  { id: 'h2', title: 'Читать 20 мин', color: '#a78bfa', createdAt: '2026-09-02' },
  { id: 'h3', title: 'Зарядка',       color: '#f97316', createdAt: '2026-09-03' },
];

// Локальная дата в формате YYYY-MM-DD.
// Не используем toISOString() — он в UTC и в Москве с 00:00 до 03:00
// отдаёт вчерашний день.
export const toISODate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Сгенерируем немного отметок за последние 5 дней,
// чтобы статистика сразу что-то показывала.
const daysBack = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

export const mockEntries = [
  { habitId: 'h1', date: daysBack(1), completed: true },
  { habitId: 'h1', date: daysBack(2), completed: true },
  { habitId: 'h1', date: daysBack(3), completed: true },
  { habitId: 'h2', date: daysBack(1), completed: true },
  { habitId: 'h2', date: daysBack(2), completed: true },
  { habitId: 'h3', date: daysBack(1), completed: true },
];