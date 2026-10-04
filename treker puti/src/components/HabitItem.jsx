// Карточка привычки.
// Иконка-эмодзи убрана — вместо неё нейтральная точка.
// Цвет привычки больше не используется — палитра фиксированная.

export default function HabitItem({ habit, checked, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white p-4">
      {/* Маркер привычки */}
      <span
        aria-hidden
        className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]"
      />

      {/* Название */}
      <div className="flex-1 text-base">{habit.title}</div>

      {/* Чекбокс «выполнено» — главное действие на «Сегодня» */}
      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={checked ? 'Отменить' : 'Отметить'}
          aria-pressed={checked}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${
            checked
              ? 'border-[#16a34a] bg-[#16a34a] text-white'
              : 'border-[#e5e7eb] bg-white text-transparent hover:border-[#16a34a]'
          }`}
        >
          ✓
        </button>
      )}

      {/* Второстепенные действия — приглушены */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-lg px-2 py-1 text-sm text-[#6b7280] hover:text-[#1a1a1a]"
        >
          Изменить
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-lg px-2 py-1 text-sm text-[#6b7280] hover:text-[#1a1a1a]"
        >
          Удалить
        </button>
      )}
    </div>
  );
}