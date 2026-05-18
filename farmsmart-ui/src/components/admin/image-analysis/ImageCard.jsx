import { AlertTriangle, CheckCircle2, MapPin, CalendarDays } from 'lucide-react';

export default function ImageCard({ item, onClick }) {
  const isDisease = item.result === 'disease';

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={`group w-full overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isDisease ? 'border-red-200' : 'border-emerald-200'
      }`}
    >
      <div className="h-44 overflow-hidden">
        <img
          src={item.image}
          alt={`${item.farmerName} crop`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-800">{item.farmerName}</h3>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {item.location}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              isDisease ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isDisease ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {isDisease ? 'Disease' : 'Healthy'}
          </span>
        </div>

        <p className="mb-2 text-sm font-semibold text-slate-700">
          Result: <span className={isDisease ? 'text-red-600' : 'text-emerald-600'}>{isDisease ? 'Disease detected' : 'Healthy crop'}</span>
        </p>
        <p className="mb-2 text-sm font-semibold text-slate-600">Confidence: {item.confidence}%</p>
        <p className="inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(item.date).toLocaleString()}
        </p>
      </div>
    </button>
  );
}
