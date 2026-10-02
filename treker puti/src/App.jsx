// Корневой компонент.
// - хранит habits и entries в useState
// - синхронизирует их с localStorage
// - переключает 4 страницы через useState (без React Router)
// - на первой загрузке показывает loading 1 секунду

import { useEffect, useState } from 'react';
import { loadState, saveState } from './storage';
import NavBar from './components/NavBar';
import TodayPage from './pages/TodayPage';
import HabitsPage from './pages/HabitsPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  // Стартовое состояние берём из localStorage (или моки)
  const initial = loadState();
  const [habits, setHabits] = useState(initial.habits);
  const [entries, setEntries] = useState(initial.entries);

  // Текущая страница: 'today' | 'habits' | 'stats' | 'settings'
  const [page, setPage] = useState('today');

  // Тема: 'light' | 'dark' — храним локально
  const [theme, setTheme] = useState(
    () => localStorage.getItem('habit-theme') || 'light'
  );

  // Глобальный loading на первой загрузке (имитация «подгрузки данных»)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Через 1 секунду скрываем лоадер и показываем приложение
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Каждый раз при изменении habits/entries — сохраняем в localStorage
  useEffect(() => {
    saveState({ habits, entries });
  }, [habits, entries]);

  // Применяем тему к <html>, чтобы Tailwind dark: работал
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('habit-theme', theme);
  }, [theme]);

  // --- Действия над привычками ---
  const addHabit = (habit) => setHabits((prev) => [...prev, habit]);

  const updateHabit = (id, patch) =>
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setEntries((prev) => prev.filter((e) => e.habitId !== id));
  };

  // --- Отметка выполнения за конкретную дату ---
  const toggleEntry = (habitId, date) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.habitId === habitId && e.date === date);
      if (existing) {
        // Переключаем completed
        return prev.map((e) =>
          e.habitId === habitId && e.date === date
            ? { ...e, completed: !e.completed }
            : e
        );
      }
      // Если отметки нет — создаём completed: true
      return [...prev, { habitId, date, completed: true }];
    });
  };

  // --- Полный сброс к мокам ---
  const resetAll = () => {
    const fresh = loadState(); // если localStorage уже пуст — вернёт моки
    setHabits(fresh.habits);
    setEntries(fresh.entries);
  };

  // --- Loading screen на первой загрузке ---
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        {/* Спиннер: крутящийся круг через CSS-утилиты Tailwind */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-500 dark:border-slate-700 dark:border-t-emerald-500" />
        <p className="text-sm">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <NavBar page={page} setPage={setPage} />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {page === 'today' && (
          <TodayPage habits={habits} entries={entries} onToggle={toggleEntry} />
        )}

        {page === 'habits' && (
          <HabitsPage
            habits={habits}
            onAdd={addHabit}
            onUpdate={updateHabit}
            onDelete={deleteHabit}
          />
        )}

        {page === 'stats' && <StatsPage habits={habits} entries={entries} />}

        {page === 'settings' && (
          <SettingsPage
            theme={theme}
            setTheme={setTheme}
            onReset={resetAll}
          />
        )}
      </main>
    </div>
  );
}