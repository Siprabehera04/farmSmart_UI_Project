import { useState } from 'react';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';

const statusStyles = {
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export default function RequestCard({ request, onUpdateStatus }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleAction = (status) => {
    setIsPressed(true);
    onUpdateStatus(request.id, status);
    setTimeout(() => setIsPressed(false), 180);
  };

  return (
    <article
      className={`rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition-all duration-200 ${
        isPressed ? 'scale-[0.99] shadow-md' : ''
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h4 className="text-lg font-black text-slate-800">{request.farmerName}</h4>
          <p className="text-sm font-semibold text-emerald-700">{request.cropName}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {request.location}
          </p>
        </div>

        {request.status ? (
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              statusStyles[request.status]
            }`}
          >
            {request.status}
          </span>
        ) : null}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="font-semibold">{request.distance}</span>
        {request.quantity ? <span className="text-slate-400">• Qty: {request.quantity}</span> : null}
      </div>

      {!request.status ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('accepted')}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={() => handleAction('rejected')}
            className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      ) : null}
    </article>
  );
}
