// Моковые данные для первого запуска приложения.
// Когда localStorage пуст — берём эти данные как стартовые.

export const mockHabits = [
  { id: 'h1', title: 'Пить воду',    icon: '💧', color: '#38bdf8', createdAt: '2026-09-01' },
  { id: 'h2', title: 'Читать 20 мин', icon: '📚', color: '#a78bfa', createdAt: '2026-09-02' },
  { id: 'h3', title: 'Зарядка',      icon: '🏃', color: '#f97316', createdAt: '2026-09-03' },
];

// Хелпер: получить дату в формате YYYY-MM-DD
export const toISODate = (d) => d.toISOString().slice(0, 10);

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