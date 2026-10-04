// Корневой компонент.
// loading 1 сек при первой загрузке.
// Тема: 'light' | 'dark', хранится в localStorage, класс на <html>.

import { useEffect, useState } from 'react';
import { loadState, saveState } from './storage';
import NavBar from './components/NavBar';
import TodayPage from './pages/TodayPage';
import HabitsPage from './pages/HabitsPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const initial = loadState();
  const [habits, setHabits] = useState(initial.habits);
  const [entries, setEntries] = useState(initial.entries);
  const [page, setPage] = useState('today');
  const [loading, setLoading] = useState(true);

  // Тема
  const [theme, setTheme] = useState(
    () => localStorage.getItem('habit-theme') || 'light'
  );

  // Загрузка 1 секунду
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Сохранение данных
  useEffect(() => {
    saveState({ habits, entries });
  }, [habits, entries]);

  // Применяем тему к <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('habit-theme', theme);
  }, [theme]);

  // --- Действия ---
  const addHabit = (habit) => setHabits((prev) => [...prev, habit]);

  const updateHabit = (id, patch) =>
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setEntries((prev) => prev.filter((e) => e.habitId !== id));
  };

  const toggleEntry = (habitId, date) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.habitId === habitId && e.date === date);
      if (existing) {
        return prev.map((e) =>
          e.habitId === habitId && e.date === date
            ? { ...e, completed: !e.completed }
            : e
        );
      }
      return [...prev, { habitId, date, completed: true }];
    });
  };

  const resetAll = () => {
    const fresh = loadState();
    setHabits(fresh.habits);
    setEntries(fresh.entries);
  };

  // Экран загрузки
  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4"
        style={{ background: 'var(--bg)', color: 'var(--muted)' }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{
            borderColor: 'var(--border)',
            borderTopColor: 'var(--accent)',
          }}
        />
        <p className="text-sm">Загрузка…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <NavBar page={page} setPage={setPage} />

      <main className="mx-auto max-w-2xl px-6 py-8">
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
          <SettingsPage theme={theme} setTheme={setTheme} onReset={resetAll} />
        )}
      </main>
    </div>
  );
}