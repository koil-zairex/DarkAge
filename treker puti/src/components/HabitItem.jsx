// Карточка привычки.
// Чекбокс крупнее, с заметной рамкой и галочкой в обоих состояниях.

export default function HabitItem({ habit, checked, onToggle, onEdit, onDelete }) {
  return (
    <div
      className="flex items-center gap-4 rounded-lg border p-4"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      {/* Маркер привычки */}
      <span
        aria-hidden
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: 'var(--accent)' }}
      />

      {/* Название */}
      <div className="flex-1 text-base">{habit.title}</div>

      {/* Чекбокс «выполнено» — крупный и заметный */}
      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={checked ? 'Отменить' : 'Отметить'}
          aria-pressed={checked}
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 text-base font-medium transition"
          style={{
            borderColor: checked ? 'var(--accent)' : 'var(--border)',
            background: checked ? 'var(--accent)' : 'transparent',
            color: checked ? '#ffffff' : 'var(--muted)',
          }}
        >
          ✓
        </button>
      )}

      {/* Второстепенные действия */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-lg px-2 py-1 text-sm hover:opacity-80"
          style={{ color: 'var(--muted)' }}
        >
          Изменить
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-lg px-2 py-1 text-sm hover:opacity-80"
          style={{ color: 'var(--muted)' }}
        >
          Удалить
        </button>
      )}
    </div>
  );
}