interface Props { value: string; label?: string; className?: string; size?: 'sm' | 'md' }

export function UnicodeDisplay({ value, label, className = '', size = 'sm' }: Props) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {label && (
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider w-28 flex-shrink-0 pt-1.5">
          {label}
        </span>
      )}
      <span
        dir="auto"
        className={`inline-flex max-w-full overflow-x-auto font-mono rounded-lg border
          ${size === 'md'
            ? 'text-sm px-3 py-1.5 bg-blue-50 border-blue-100 text-blue-800'
            : 'text-xs px-2.5 py-1 bg-gray-50 border-gray-100 text-gray-700'
          }`}
      >
        {value}
      </span>
    </div>
  )
}
