import { Eye, EyeOff } from 'lucide-react';

export default function AuthInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
}) {
  const isPassword = type === 'password';

  return (
    <div className="w-full">
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div
        className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all duration-300 ${
          error
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-emerald-100 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100'
        }`}
      >
        {Icon ? <Icon className="h-5 w-5 text-emerald-500" aria-hidden="true" /> : null}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
      {isPassword ? (
        <p className="mt-1 text-[11px] text-slate-400">
          Use 6+ characters for better account security.
        </p>
      ) : null}
    </div>
  );
}

export function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  isVisible,
  onToggleVisibility,
}) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all duration-300 ${
          error
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-emerald-100 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100'
        }`}
      >
        {Icon ? <Icon className="h-5 w-5 text-emerald-500" aria-hidden="true" /> : null}
        <input
          id={name}
          name={name}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="rounded-lg p-1 text-slate-400 transition-colors hover:text-emerald-600"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
      <p className="mt-1 text-[11px] text-slate-400">
        Use 6+ characters for better account security.
      </p>
    </div>
  );
}
