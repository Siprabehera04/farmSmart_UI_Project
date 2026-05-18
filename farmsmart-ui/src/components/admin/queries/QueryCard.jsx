import { Mic, Bot, MapPin, Clock3, Sparkles, Flame } from 'lucide-react';

export default function QueryCard({ item, onSelect }) {
  const isHighUsage = item.usageCount >= 10;
  const isRecent = new Date(item.timestamp) >= new Date('2026-04-14T00:00:00');

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`w-full rounded-3xl border bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isHighUsage ? 'border-orange-200' : 'border-emerald-100'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-black text-slate-800">{item.farmerName}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
            <Sparkles className="h-3 w-3" />
            AI Suggested
          </span>
          {isHighUsage ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">
              <Flame className="h-3 w-3" />
              High Usage
            </span>
          ) : null}
          {isRecent ? (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Recent
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-700">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
            <Mic className="h-4 w-4" />
            Query:
          </span>{' '}
          {item.query.length > 95 ? `${item.query.slice(0, 95)}...` : item.query}
        </p>
        <p className="text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 font-semibold text-violet-700">
            <Bot className="h-4 w-4" />
            AI Response:
          </span>{' '}
          {item.response.length > 110 ? `${item.response.slice(0, 110)}...` : item.response}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{item.crop}</span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {new Date(item.timestamp).toLocaleString()}
        </span>
      </div>
    </button>
  );
}
