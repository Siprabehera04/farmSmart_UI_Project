import QueryCard from './QueryCard';

export default function QueryList({ items, onSelect }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center text-sm font-medium text-slate-500">
        No queries match current search and filters.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <QueryCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
