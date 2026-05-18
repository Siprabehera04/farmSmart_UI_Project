import { useMemo, useState } from 'react';
import { MessageSquareText, Sprout, MapPin, Languages, Flame } from 'lucide-react';
import QueryList from '../../components/admin/queries/QueryList';
import FilterBar from '../../components/admin/queries/FilterBar';
import QueryDetailModal from '../../components/admin/queries/QueryDetailModal';

const queryData = [
  {
    id: 1,
    farmerName: 'Suresh Patil',
    location: 'Mysore',
    query: 'My cotton leaves are turning yellow after rainfall. What should I do first?',
    response: 'Start with a drainage check, then apply balanced micronutrients and monitor fungal spread before spraying fungicide.',
    crop: 'Cotton',
    language: 'English',
    timestamp: '2026-04-15T09:20:00',
    usageCount: 13,
  },
  {
    id: 2,
    farmerName: 'Lakshmi Devi',
    location: 'Mandya',
    query: 'Rice plants have slow growth this week. Is this due to nutrient deficiency?',
    response: 'Likely nitrogen deficiency. Apply recommended urea split dose and maintain shallow standing water level.',
    crop: 'Rice',
    language: 'Kannada',
    timestamp: '2026-04-14T13:45:00',
    usageCount: 9,
  },
  {
    id: 3,
    farmerName: 'Ramesh Gowda',
    location: 'Nanjangud',
    query: 'Which crop gives better profit this month in loamy soil?',
    response: 'Based on current trends, maize and ragi are high confidence options for your soil and weather pattern.',
    crop: 'Ragi',
    language: 'Hindi',
    timestamp: '2026-04-12T16:10:00',
    usageCount: 11,
  },
  {
    id: 4,
    farmerName: 'Meena Rao',
    location: 'Mysore',
    query: 'How often should I irrigate chilli crop in this heat?',
    response: 'Irrigate every 3-4 days with mulching support and avoid afternoon watering to reduce evaporation stress.',
    crop: 'Chilli',
    language: 'English',
    timestamp: '2026-04-10T08:05:00',
    usageCount: 6,
  },
  {
    id: 5,
    farmerName: 'Anil Kumar',
    location: 'Srirangapatna',
    query: 'Can I switch from paddy to sugarcane this season?',
    response: 'Yes, if water availability is stable. Start with soil moisture planning and stagger planting for better yield.',
    crop: 'Sugarcane',
    language: 'Kannada',
    timestamp: '2026-04-08T18:35:00',
    usageCount: 8,
  },
  {
    id: 6,
    farmerName: 'Suresh Patil',
    location: 'Mysore',
    query: 'Best pesticide suggestion for early pest signs in cotton?',
    response: 'Use neem-based biopesticide first, then escalate to targeted pesticide only if pest count crosses threshold.',
    crop: 'Cotton',
    language: 'English',
    timestamp: '2026-04-15T11:40:00',
    usageCount: 14,
  },
];

export default function Queries() {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const locations = useMemo(() => [...new Set(queryData.map((q) => q.location))], []);
  const crops = useMemo(() => [...new Set(queryData.map((q) => q.crop))], []);
  const languages = useMemo(() => [...new Set(queryData.map((q) => q.language))], []);

  const filteredQueries = useMemo(() => {
    return queryData.filter((item) => {
      const keyword = search.toLowerCase().trim();
      const searchMatch =
        item.farmerName.toLowerCase().includes(keyword) ||
        item.query.toLowerCase().includes(keyword);
      const locationMatch = locationFilter === 'all' || item.location === locationFilter;
      const cropMatch = cropFilter === 'all' || item.crop === cropFilter;
      const languageMatch = languageFilter === 'all' || item.language === languageFilter;
      return searchMatch && locationMatch && cropMatch && languageMatch;
    });
  }, [search, locationFilter, cropFilter, languageFilter]);

  const insights = useMemo(() => {
    const total = queryData.length;
    const mostAskedCrop = getMostCommon(queryData.map((q) => q.crop));
    const mostActiveLocation = getMostCommon(queryData.map((q) => q.location));
    const mostUsedLanguage = getMostCommon(queryData.map((q) => q.language));
    return { total, mostAskedCrop, mostActiveLocation, mostUsedLanguage };
  }, []);

  const frequentQueries = useMemo(
    () => queryData.filter((q) => q.usageCount >= 10).slice(0, 3),
    []
  );

  const recentFarmers = useMemo(() => {
    const sorted = [...queryData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const unique = [];
    for (const item of sorted) {
      if (!unique.some((u) => u.farmerName === item.farmerName)) unique.push(item);
      if (unique.length === 3) break;
    }
    return unique;
  }, []);

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800">Queries / Activity Logs</h2>
        <p className="mt-1 text-sm text-slate-600">
          AI interaction monitoring across farmers, crops, and regional languages.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard title="Total Queries" value={insights.total} icon={<MessageSquareText className="h-5 w-5" />} />
        <InsightCard title="Most Asked Crop" value={insights.mostAskedCrop} icon={<Sprout className="h-5 w-5" />} />
        <InsightCard title="Most Active Location" value={insights.mostActiveLocation} icon={<MapPin className="h-5 w-5" />} />
        <InsightCard title="Most Used Language" value={insights.mostUsedLanguage} icon={<Languages className="h-5 w-5" />} />
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        location={locationFilter}
        onLocation={setLocationFilter}
        crop={cropFilter}
        onCrop={setCropFilter}
        language={languageFilter}
        onLanguage={setLanguageFilter}
        locations={locations}
        crops={crops}
        languages={languages}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <QueryList items={filteredQueries} onSelect={setSelectedItem} />
        </div>
        <div className="space-y-4">
          <SmartPanel
            title="Frequently Asked"
            icon={<Flame className="h-4 w-4" />}
            items={frequentQueries.map((q) => ({
              id: q.id,
              title: q.crop,
              subtitle: `${q.usageCount} similar queries`,
            }))}
          />
          <SmartPanel
            title="Recently Active Farmers"
            icon={<MessageSquareText className="h-4 w-4" />}
            items={recentFarmers.map((q) => ({
              id: q.id,
              title: q.farmerName,
              subtitle: `${q.location} • ${new Date(q.timestamp).toLocaleDateString()}`,
            }))}
          />
        </div>
      </div>

      <QueryDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

function InsightCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm">
      <div className="mb-2 inline-flex rounded-lg bg-white/80 p-2 text-emerald-700">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700/80">{title}</p>
      <p className="mt-1 text-2xl font-black text-slate-800">{value}</p>
    </div>
  );
}

function SmartPanel({ title, icon, items }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
        {icon}
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-emerald-100 bg-emerald-50/35 p-3">
            <p className="text-sm font-bold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-500">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMostCommon(values) {
  const map = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
}
