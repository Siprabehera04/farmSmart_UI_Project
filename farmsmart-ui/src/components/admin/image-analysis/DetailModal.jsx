import { X, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

export default function DetailModal({ item, onClose }) {
  if (!item) return null;
  const isDisease = item.result === 'disease';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
          <h3 className="text-xl font-black text-slate-800">Analysis Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-emerald-100">
            <img src={item.image} alt={`${item.farmerName} crop`} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Farmer</p>
              <p className="text-lg font-black text-slate-800">{item.farmerName}</p>
            </div>
            <p className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
              <MapPin className="h-4 w-4" />
              {item.location}
            </p>
            <p className="text-sm text-slate-500">{new Date(item.date).toLocaleString()}</p>

            <div
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                isDisease ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isDisease ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {isDisease ? 'Disease detected' : 'Healthy crop'}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <p className="text-sm font-semibold text-slate-600">Confidence</p>
              <p className="text-3xl font-black text-emerald-700">{item.confidence}%</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-600">Suggested Solution</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.suggestion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
