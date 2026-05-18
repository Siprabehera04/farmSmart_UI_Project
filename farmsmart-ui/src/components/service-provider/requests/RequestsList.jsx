import { useState } from 'react';
import RequestCard from './RequestCard';

const initialRequests = [
  {
    id: 1,
    farmerName: 'Suresh',
    cropName: 'Cotton',
    location: 'Mysore',
    distance: '2.3 km away',
    quantity: '18 quintals',
    status: null,
  },
  {
    id: 2,
    farmerName: 'Ramesh',
    cropName: 'Rice',
    location: 'Mandya',
    distance: '3.1 km away',
    quantity: '24 quintals',
    status: null,
  },
  {
    id: 3,
    farmerName: 'Lakshmi',
    cropName: 'Ragi',
    location: 'Nanjangud',
    distance: '1.9 km away',
    quantity: '12 quintals',
    status: null,
  },
];

export default function RequestsList() {
  const [requests, setRequests] = useState(initialRequests);

  const handleUpdateStatus = (requestId, status) => {
    setRequests((prev) =>
      prev.map((request) => (request.id === requestId ? { ...request, status } : request))
    );
  };

  return (
    <section className="space-y-3">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
        <h3 className="text-xl font-black text-slate-800">Requests / Leads</h3>
        <p className="mt-1 text-sm text-slate-600">
          Farmers interested in selling crops to your procurement network.
        </p>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} onUpdateStatus={handleUpdateStatus} />
        ))}
      </div>
    </section>
  );
}
