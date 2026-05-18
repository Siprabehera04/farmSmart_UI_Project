import { UploadCloud, ImagePlus } from 'lucide-react';

export default function ImageUploader({
  onDrop,
  onDragOver,
  onDragEnter,
  isDragging,
  fileInputRef,
  onPickClick,
  onFileChange,
}) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      className={`rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
        isDragging
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-emerald-200 bg-white/70 hover:border-emerald-400 hover:bg-emerald-50/60'
      }`}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
        <UploadCloud className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-black text-emerald-900">Upload crop or leaf image for analysis</h3>
      <p className="mt-2 text-sm text-slate-500">Drag & drop an image here, or select a file from your device.</p>

      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={onFileChange} />
      <button
        type="button"
        onClick={onPickClick}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-300/40 transition hover:bg-emerald-700"
      >
        <ImagePlus className="h-4 w-4" />
        Choose Image
      </button>
    </div>
  );
}
