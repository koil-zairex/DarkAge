// Навигация. Активная вкладка — тонкая зелёная линия снизу,
// без ярких заливок, чтобы не спорить с главным действием на экране.

const TABS = [
  { id: 'today',    label: 'Сегодня' },
  { id: 'habits',   label: 'Привычки' },
  { id: 'stats',    label: 'Статистика' },
  { id: 'settings', label: 'Настройки' },
];

export default function NavBar({ page, setPage }) {
  return (
    <nav className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex max-w-2xl gap-6 overflow-x-auto px-6">
        {TABS.map((tab) => {
          const active = page === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className={`-mb-px whitespace-nowrap border-b-2 px-1 py-4 text-sm transition ${
                active
                  ? 'border-[#16a34a] font-medium text-[#1a1a1a]'
                  : 'border-transparent text-[#6b7280] hover:text-[#1a1a1a]'
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