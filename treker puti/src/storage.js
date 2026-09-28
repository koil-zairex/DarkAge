// Работа с localStorage: загрузка и сохранение состояния.
// Если в localStorage ничего нет — возвращаем моковые данные.

import { mockHabits, mockEntries } from './mockHabits';

const KEY = 'habit-tracker-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { habits: mockHabits, entries: mockEntries };
    }
    const parsed = JSON.parse(raw);
    if (!parsed.habits || !parsed.entries) {
      return { habits: mockHabits, entries: mockEntries };
    }
    return parsed;
  } catch (e) {
    console.warn('Не удалось прочитать localStorage:', e);
    return { habits: mockHabits, entries: mockEntries };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Не удалось сохранить в localStorage:', e);
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}