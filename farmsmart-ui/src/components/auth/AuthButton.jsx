import { Loader2 } from 'lucide-react';

export default function AuthButton({ children, isLoading = false, disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      <span>{isLoading ? 'Please wait...' : children}</span>
    </button>
  );
}
