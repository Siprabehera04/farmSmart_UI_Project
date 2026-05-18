import { Search } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  dateFilter,
  onDateChange,
  locations,
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by farmer name..."
            className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-emerald-400"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
        >
          <option value="all">Status: All</option>
          <option value="disease">Status: Disease</option>
          <option value="healthy">Status: Healthy</option>
        </select>

        <select
          value={locationFilter}
          onChange={(event) => onLocationChange(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
        >
          <option value="all">Location: All</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              Location: {location}
            </option>
          ))}
        </select>

        <select
          value={dateFilter}
          onChange={(event) => onDateChange(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
        >
          <option value="all">Date: All</option>
          <option value="today">Date: Today</option>
          <option value="week">Date: Last 7 days</option>
          <option value="month">Date: Last 30 days</option>
        </select>
      </div>
    </div>
  );
}
