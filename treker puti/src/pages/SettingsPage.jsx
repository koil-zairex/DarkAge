// «Настройки». Переключатель темы одной кнопкой + сброс данных.

export default function SettingsPage({ theme, setTheme, onReset }) {
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const handleReset = () => {
    if (window.confirm('Сбросить все данные и вернуть стартовый набор?')) {
      onReset();
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold">Настройки</h1>

      {/* Тема */}
      <div
        className="mt-6 rounded-lg border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="text-base">Тема</div>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Сейчас активна {isDark ? 'тёмная' : 'светлая'} тема.
        </p>
        <button
          onClick={toggleTheme}
          className="mt-4 rounded-lg border px-4 py-2 text-sm transition hover:opacity-90"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {isDark ? 'Включить светлую' : 'Включить тёмную'}
        </button>
      </div>

      {/* Данные */}
      <div
        className="mt-6 rounded-lg border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="text-base">Данные</div>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Сброс вернёт стартовый набор привычек и удалит все отметки.
        </p>
        <button
          onClick={handleReset}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          Сбросить данные
        </button>
      </div>
    </section>
  );
}