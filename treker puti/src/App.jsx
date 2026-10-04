// Корневой компонент.
// loading 1 сек при первой загрузке, затем приложение.
// Тема фиксированная — светлая.

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

  // Показываем экран загрузки 1 секунду
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Сохраняем в localStorage при любом изменении
  useEffect(() => {
    saveState({ habits, entries });
  }, [habits, entries]);

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
        return prev.map((e) =>
          e.habitId === habitId && e.date === date
            ? { ...e, completed: !e.completed }
            : e
        );
      }
      return [...prev, { habitId, date, completed: true }];
    });
  };

  // --- Полный сброс к мокам ---
  const resetAll = () => {
    const fresh = loadState();
    setHabits(fresh.habits);
    setEntries(fresh.entries);
  };

  // Экран загрузки
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-[#6b7280]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#16a34a]" />
        <p className="text-sm">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
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

        {page === 'settings' && <SettingsPage onReset={resetAll} />}
      </main>
    </div>
  );
}