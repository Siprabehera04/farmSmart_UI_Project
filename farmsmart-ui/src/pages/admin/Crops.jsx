import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import CropCard from '../../components/admin/crops/CropCard';
import AddEditCropModal from '../../components/admin/crops/AddEditCropModal';
import SuggestionPanel from '../../components/admin/crops/SuggestionPanel';

const initialCrops = [
  {
    id: 'crop-1',
    name: 'Paddy',
    region: 'Punjab',
    soilType: 'Loamy',
    season: 'Kharif',
    profit: 120000,
    description: 'High demand in nearby markets. Performs very well with monsoon irrigation. Stable procurement support available.',
    usageCount: 180,
    isTrending: true,
    isAIRecommended: true,
  },
  {
    id: 'crop-2',
    name: 'Wheat',
    region: 'Haryana',
    soilType: 'Clayey',
    season: 'Rabi',
    profit: 98000,
    description: 'Reliable crop with low volatility. Good fit for winter season in north India. Works with existing machinery setup.',
    usageCount: 145,
    isTrending: false,
    isAIRecommended: true,
  },
  {
    id: 'crop-3',
    name: 'Maize',
    region: 'Maharashtra',
    soilType: 'Sandy',
    season: 'Kharif',
    profit: 86000,
    description: 'Strong fodder and feed industry demand. Tolerates moderate water stress. Faster harvest cycle supports crop rotation.',
    usageCount: 121,
    isTrending: true,
    isAIRecommended: false,
  },
  {
    id: 'crop-4',
    name: 'Soybean',
    region: 'Madhya Pradesh',
    soilType: 'Silty',
    season: 'Kharif',
    profit: 92000,
    description: 'Oilseed prices remain competitive. Supports soil fertility through legume properties. Strong adoption among progressive farmers.',
    usageCount: 99,
    isTrending: false,
    isAIRecommended: true,
  },
  {
    id: 'crop-5',
    name: 'Groundnut',
    region: 'Gujarat',
    soilType: 'Sandy',
    season: 'Zaid',
    profit: 110000,
    description: 'Premium value in oil processing chain. Suitable for lighter soils with good drainage. Good profitability for medium holdings.',
    usageCount: 88,
    isTrending: true,
    isAIRecommended: true,
  },
];

const soilFilters = ['All', 'Loamy', 'Clayey', 'Sandy', 'Silty', 'Peaty', 'Chalky'];
const seasonFilters = ['All', 'Kharif', 'Rabi', 'Zaid', 'All Season'];

export default function Crops() {
  const [crops, setCrops] = useState(initialCrops);
  const [searchTerm, setSearchTerm] = useState('');
  const [soilFilter, setSoilFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const searchMatch = crop.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const soilMatch = soilFilter === 'All' || crop.soilType === soilFilter;
      const seasonMatch = seasonFilter === 'All' || crop.season === seasonFilter;
      return searchMatch && soilMatch && seasonMatch;
    });
  }, [crops, searchTerm, soilFilter, seasonFilter]);

  const openCreateModal = () => {
    setEditingCrop(null);
    setIsModalOpen(true);
  };

  const openEditModal = (crop) => {
    setEditingCrop(crop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCrop(null);
    setIsModalOpen(false);
  };

  const handleSaveCrop = (cropData) => {
    if (editingCrop) {
      setCrops((prev) =>
        prev.map((crop) => (crop.id === editingCrop.id ? { ...crop, ...cropData } : crop))
      );
    } else {
      setCrops((prev) => [
        {
          id: `crop-${Date.now()}`,
          ...cropData,
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const handleDeleteCrop = (cropId) => {
    setCrops((prev) => prev.filter((crop) => crop.id !== cropId));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Crops Management</h2>
            <p className="mt-1 text-sm text-slate-600">
              Manage crop recommendations with high-performing, region-ready options.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200"
          >
            <Plus className="h-4 w-4" />
            Add Crop
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="relative md:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search crop name..."
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
            />
          </label>

          <select
            value={soilFilter}
            onChange={(event) => setSoilFilter(event.target.value)}
            className="rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
          >
            {soilFilters.map((soil) => (
              <option key={soil} value={soil}>
                Soil: {soil}
              </option>
            ))}
          </select>

          <select
            value={seasonFilter}
            onChange={(event) => setSeasonFilter(event.target.value)}
            className="rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
          >
            {seasonFilters.map((season) => (
              <option key={season} value={season}>
                Season: {season}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SuggestionPanel crops={crops} />

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredCrops.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            onEdit={() => openEditModal(crop)}
            onDelete={() => handleDeleteCrop(crop.id)}
          />
        ))}
      </div>

      {!filteredCrops.length ? (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-8 text-center text-sm font-medium text-slate-500">
          No crops found for current search and filters.
        </div>
      ) : null}

      <AddEditCropModal
        isOpen={isModalOpen}
        mode={editingCrop ? 'edit' : 'add'}
        crop={editingCrop}
        onClose={closeModal}
        onSave={handleSaveCrop}
      />
    </section>
  );
}
