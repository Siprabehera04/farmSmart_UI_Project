import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const emptyCrop = {
  name: '',
  region: '',
  soilType: 'Loamy',
  season: 'Kharif',
  profit: '',
  description: '',
  usageCount: '',
};

const soilOptions = ['Loamy', 'Clayey', 'Sandy', 'Silty', 'Peaty', 'Chalky'];
const seasonOptions = ['Kharif', 'Rabi', 'Zaid', 'All Season'];

export default function AddEditCropModal({ isOpen, mode, crop, onClose, onSave }) {
  const [formData, setFormData] = useState(emptyCrop);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormData(
      crop
        ? { ...crop, profit: String(crop.profit), usageCount: String(crop.usageCount) }
        : emptyCrop
    );
    setError('');
  }, [isOpen, crop]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.region.trim() || !formData.description.trim()) {
      setError('Please fill all required fields.');
      return;
    }
    if (Number(formData.profit) <= 0 || Number(formData.usageCount) < 0) {
      setError('Profit must be positive and usage count cannot be negative.');
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      region: formData.region.trim(),
      description: formData.description.trim(),
      profit: Number(formData.profit),
      usageCount: Number(formData.usageCount),
      isTrending: Boolean(formData.isTrending),
      isAIRecommended: Boolean(formData.isAIRecommended),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800">{mode === 'edit' ? 'Edit Crop' : 'Add New Crop'}</h3>
            <p className="mt-1 text-sm text-slate-500">Update crop metadata used by recommendation engine.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Crop Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Region" name="region" value={formData.region} onChange={handleChange} required />
            <Select label="Soil Type" name="soilType" value={formData.soilType} onChange={handleChange} options={soilOptions} />
            <Select label="Season" name="season" value={formData.season} onChange={handleChange} options={seasonOptions} />
            <Input label="Profit (Rs)" name="profit" type="number" value={formData.profit} onChange={handleChange} min="1" required />
            <Input label="Usage Count" name="usageCount" type="number" value={formData.usageCount} onChange={handleChange} min="0" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="Explain why this crop works well."
              required
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-200">
              {mode === 'edit' ? 'Save Changes' : 'Add Crop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <select
        {...props}
        className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
