// «Настройки». Главное действие — сброс данных.
// Переключатель темы убран: палитра фиксированная.

export default function SettingsPage({ onReset }) {
  const handleReset = () => {
    if (window.confirm('Сбросить все данные и вернуть стартовый набор?')) {
      onReset();
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold">Настройки</h1>

      <div className="mt-6 rounded-lg border border-[#e5e7eb] p-6">
        <div className="text-base">Данные</div>
        <p className="mt-1 text-sm text-[#6b7280]">
          Сброс вернёт стартовый набор привычек и удалит все отметки.
        </p>
        <button
          onClick={handleReset}
          className="mt-4 rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
        >
          Сбросить данные
        </button>
      </div>
    </section>
  );
}