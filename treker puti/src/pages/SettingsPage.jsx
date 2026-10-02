// Страница «Настройки».
// Переключение темы одной кнопкой и сброс данных.

export default function SettingsPage({ theme, setTheme, onReset }) {
  const handleReset = () => {
    // Простое подтверждение без отдельной модалки
    const ok = window.confirm('Сбросить все данные и вернуть моки?');
    if (ok) onReset();
  };

  // Текст и иконка кнопки зависят от текущей темы:
  // если светлая — предлагаем перейти в тёмную, и наоборот.
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Настройки</h1>

      <div className="space-y-4">
        {/* Тема — одна кнопка-переключатель */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-2 font-medium">Тема</div>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {isDark ? '☀️ Светлая' : '🌙 Тёмная'}
          </button>
        </div>

        {/* Сброс данных */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-2 font-medium">Данные</div>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            Сброс вернёт стартовый набор привычек и удалит все отметки.
          </p>
          <button
            onClick={handleReset}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Сбросить данные
          </button>
        </div>
      </div>
    </section>
  );
}