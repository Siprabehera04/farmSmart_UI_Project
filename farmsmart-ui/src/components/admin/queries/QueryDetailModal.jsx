import { X, Mic, Bot, Languages, Sprout } from 'lucide-react';

export default function QueryDetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
          <div>
            <h3 className="text-xl font-black text-slate-800">{item.farmerName}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.location}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Mic className="h-4 w-4" />
              Full Query
            </p>
            <p className="text-sm leading-relaxed text-slate-700">{item.query}</p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-violet-700">
              <Bot className="h-4 w-4" />
              Full AI Response
            </p>
            <p className="text-sm leading-relaxed text-slate-700">{item.response}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <InfoCard label="Crop Suggestion" value={item.crop} icon={<Sprout className="h-4 w-4" />} />
            <InfoCard label="Language Used" value={item.language} icon={<Languages className="h-4 w-4" />} />
            <InfoCard label="Usage Count" value={`${item.usageCount} times`} icon={<Bot className="h-4 w-4" />} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <p className="mb-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
