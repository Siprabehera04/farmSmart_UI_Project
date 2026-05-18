import { useMemo, useState } from 'react';
import { Edit3, Trash2, ChevronDown } from 'lucide-react';

function profitPercent(profit) {
  return Math.min(100, Math.max(0, Math.round((profit / 150000) * 100)));
}

function descriptionToPoints(description) {
  const parts = description
    .split(/[.;]/)
    .map((point) => point.trim())
    .filter(Boolean);

  return parts.slice(0, 3);
}

export default function CropCard({ crop, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = profitPercent(crop.profit);
  const points = useMemo(() => descriptionToPoints(crop.description), [crop.description]);

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white/95 p-5 shadow-md shadow-emerald-100/60 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-800">{crop.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {crop.region} • {crop.soilType} Soil • {crop.season}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
            aria-label={`Edit ${crop.name}`}
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
            aria-label={`Delete ${crop.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">Estimated Profit</span>
          <span className="font-black text-emerald-700">Rs {crop.profit.toLocaleString()}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="mb-4 text-sm font-medium text-slate-600">
        Used in <span className="font-bold text-emerald-700">{crop.usageCount}</span> recommendations
      </p>

      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
      >
        Why this crop?
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          isExpanded ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <ul className="space-y-1.5 pl-4 text-sm text-slate-600">
            {points.length ? (
              points.map((point) => <li key={point} className="list-disc">{point}</li>)
            ) : (
              <li className="list-disc">High suitability based on local conditions.</li>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
