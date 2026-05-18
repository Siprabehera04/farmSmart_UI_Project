import { useMemo, useState } from 'react';
import { Leaf, AlertTriangle, CheckCircle2 } from 'lucide-react';
import FilterBar from '../../components/admin/image-analysis/FilterBar';
import ImageGrid from '../../components/admin/image-analysis/ImageGrid';
import DetailModal from '../../components/admin/image-analysis/DetailModal';

const imageData = [
  {
    id: 1,
    farmerName: 'Suresh Patil',
    location: 'Mysore',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
    result: 'disease',
    confidence: 85,
    suggestion: 'Spray copper-based fungicide and reduce excess watering for the next 5 days.',
    date: '2026-04-14T10:30:00',
  },
  {
    id: 2,
    farmerName: 'Lakshmi Devi',
    location: 'Mandya',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    result: 'healthy',
    confidence: 91,
    suggestion: 'Crop appears healthy. Continue current nutrition schedule and weekly monitoring.',
    date: '2026-04-13T09:20:00',
  },
  {
    id: 3,
    farmerName: 'Ramesh Gowda',
    location: 'Nanjangud',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
    result: 'disease',
    confidence: 79,
    suggestion: 'Isolate affected patch and use neem-based treatment; revisit in 3 days.',
    date: '2026-04-10T17:40:00',
  },
  {
    id: 4,
    farmerName: 'Meena Rao',
    location: 'Mysore',
    image: 'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=900&q=80',
    result: 'healthy',
    confidence: 88,
    suggestion: 'Maintain irrigation intervals and continue foliar micronutrient spray.',
    date: '2026-04-02T13:15:00',
  },
  {
    id: 5,
    farmerName: 'Anil Kumar',
    location: 'Srirangapatna',
    image: 'https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&w=900&q=80',
    result: 'disease',
    confidence: 83,
    suggestion: 'Apply recommended pesticide dosage and improve field drainage to reduce humidity.',
    date: '2026-03-27T08:50:00',
  },
];

function isWithinDateRange(dateString, filter) {
  if (filter === 'all') return true;
  const now = new Date('2026-04-15T12:00:00');
  const date = new Date(dateString);
  const diffMs = now - date;
  const oneDay = 24 * 60 * 60 * 1000;
  if (filter === 'today') return diffMs <= oneDay;
  if (filter === 'week') return diffMs <= 7 * oneDay;
  if (filter === 'month') return diffMs <= 30 * oneDay;
  return true;
}

export default function ImageAnalysis() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const locations = useMemo(
    () => [...new Set(imageData.map((item) => item.location))],
    []
  );

  const filteredItems = useMemo(() => {
    return imageData.filter((item) => {
      const searchMatch = item.farmerName.toLowerCase().includes(search.toLowerCase().trim());
      const statusMatch = statusFilter === 'all' || item.result === statusFilter;
      const locationMatch = locationFilter === 'all' || item.location === locationFilter;
      const dateMatch = isWithinDateRange(item.date, dateFilter);
      return searchMatch && statusMatch && locationMatch && dateMatch;
    });
  }, [search, statusFilter, locationFilter, dateFilter]);

  const insights = useMemo(() => {
    const total = imageData.length;
    const disease = imageData.filter((item) => item.result === 'disease').length;
    const healthy = total - disease;
    return { total, disease, healthy };
  }, []);

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800">Image Analysis Monitoring</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review farmer-uploaded crop images and AI diagnostic outcomes.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          title="Total Images Uploaded"
          value={insights.total}
          icon={<Leaf className="h-5 w-5" />}
          tone="emerald"
        />
        <InsightCard
          title="Total Disease Cases"
          value={insights.disease}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="red"
        />
        <InsightCard
          title="Healthy Crops Count"
          value={insights.healthy}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="green"
        />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        locations={locations}
      />

      <ImageGrid items={filteredItems} onSelect={setSelectedItem} />
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

function InsightCard({ title, value, icon, tone }) {
  const toneStyles = {
    emerald: 'border-emerald-100 bg-emerald-50/40 text-emerald-700',
    red: 'border-red-100 bg-red-50/50 text-red-700',
    green: 'border-lime-100 bg-lime-50/50 text-lime-700',
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneStyles[tone]}`}>
      <div className="mb-2 inline-flex rounded-lg bg-white/80 p-2">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wider opacity-75">{title}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}
