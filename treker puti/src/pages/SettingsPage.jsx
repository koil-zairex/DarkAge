// Страница «Настройки».
// Переключение темы и сброс данных.

export default function SettingsPage({ theme, setTheme, onReset }) {
  const handleReset = () => {
    const ok = window.confirm('Сбросить все данные и вернуть моки?');
    if (ok) onReset();
  };

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Настройки</h1>

      <div className="space-y-4">
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-2 font-medium">Тема</div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`rounded-lg px-4 py-2 text-sm ${
                theme === 'light'
                  ? 'bg-emerald-500 text-white'
                  : 'border border-slate-300 dark:border-slate-600'
              }`}
            >
              Светлая
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`rounded-lg px-4 py-2 text-sm ${
                theme === 'dark'
                  ? 'bg-emerald-500 text-white'
                  : 'border border-slate-300 dark:border-slate-600'
              }`}
            >
              Тёмная
            </button>
          </div>
        </div>

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