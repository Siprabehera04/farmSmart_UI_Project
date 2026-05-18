import { Search } from 'lucide-react';

export default function FilterBar({
  search,
  onSearch,
  location,
  onLocation,
  crop,
  onCrop,
  language,
  onLanguage,
  locations,
  crops,
  languages,
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative md:col-span-2 xl:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search farmer/query..."
            className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-emerald-400"
          />
        </label>

        <select
          value={location}
          onChange={(event) => onLocation(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
        >
          <option value="all">Location: All</option>
          {locations.map((value) => (
            <option key={value} value={value}>
              Location: {value}
            </option>
          ))}
        </select>

        <select
          value={crop}
          onChange={(event) => onCrop(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
        >
          <option value="all">Crop: All</option>
          {crops.map((value) => (
            <option key={value} value={value}>
              Crop: {value}
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(event) => onLanguage(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
        >
          <option value="all">Language: All</option>
          {languages.map((value) => (
            <option key={value} value={value}>
              Language: {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
