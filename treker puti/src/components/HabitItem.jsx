// Универсальная карточка привычки.
// Используется и в «Сегодня» (с чекбоксом), и в «Все привычки» (с edit/delete).

export default function HabitItem({
  habit,
  checked,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
      {/* Иконка с цветным фоном */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
        style={{ backgroundColor: habit.color + '22' }} // легкий оттенок
      >
        {habit.icon}
      </div>

      {/* Название */}
      <div className="flex-1">
        <div className="font-medium">{habit.title}</div>
      </div>

      {/* Чекбокс «выполнено» — рендерим только если передан onToggle */}
      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={checked ? 'Отменить' : 'Отметить'}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
            checked
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 text-transparent dark:border-slate-600'
          }`}
        >
          ✓
        </button>
      )}

      {/* Кнопки edit/delete — только если переданы обработчики */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          title="Редактировать"
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-lg px-2 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          title="Удалить"
        >
          ✕
        </button>
      )}
    </div>
  );
}