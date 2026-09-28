// Корневой компонент.
// - хранит habits и entries в useState
// - синхронизирует их с localStorage
// - переключает 4 страницы через useState (без React Router)

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

  const [theme, setTheme] = useState(
    () => localStorage.getItem('habit-theme') || 'light'
  );

  useEffect(() => {
    saveState({ habits, entries });
  }, [habits, entries]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('habit-theme', theme);
  }, [theme]);

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