import ImageCard from './ImageCard';

export default function ImageGrid({ items, onSelect }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center text-sm font-medium text-slate-500">
        No image analysis records match your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ImageCard key={item.id} item={item} onClick={onSelect} />
      ))}
    </div>
  );
}
