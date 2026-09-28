// Верхняя навигация между 4 страницами.

const TABS = [
  { id: 'today',    label: 'Сегодня' },
  { id: 'habits',   label: 'Привычки' },
  { id: 'stats',    label: 'Статистика' },
  { id: 'settings', label: 'Настройки' },
];

export default function NavBar({ page, setPage }) {
  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto flex max-w-2xl gap-1 overflow-x-auto px-4 py-2">
        {TABS.map((tab) => {
          const active = page === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${
                active
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}