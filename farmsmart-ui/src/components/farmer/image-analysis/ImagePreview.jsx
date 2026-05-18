import { Image as ImageIcon } from 'lucide-react';

export default function ImagePreview({ imageUrl, fileName }) {
  if (!imageUrl) return null;

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <ImageIcon className="h-4 w-4" />
        Selected Image
      </p>
      <div className="overflow-hidden rounded-2xl border border-emerald-100">
        <img src={imageUrl} alt="Uploaded crop" className="h-64 w-full object-cover" />
      </div>
      <p className="mt-2 truncate text-xs font-medium text-slate-500">{fileName}</p>
    </div>
  );
}
