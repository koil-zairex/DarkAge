// Навигация. Без горизонтальной прокрутки — вкладки ужимаются flex-ом.
// Активная — тонкая зелёная линия снизу.

const TABS = [
  { id: 'today',    label: 'Сегодня' },
  { id: 'habits',   label: 'Привычки' },
  { id: 'stats',    label: 'Статистика' },
  { id: 'settings', label: 'Настройки' },
];

export default function NavBar({ page, setPage }) {
  return (
    <nav
      className="border-b"
      style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
    >
      <div className="mx-auto flex max-w-2xl gap-4 px-6">
        {TABS.map((tab) => {
          const active = page === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className={`-mb-px flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm transition ${
                active ? 'font-medium' : ''
              }`}
              style={{
                borderBottomColor: active ? 'var(--accent)' : 'transparent',
                color: active ? 'var(--text)' : 'var(--muted)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}