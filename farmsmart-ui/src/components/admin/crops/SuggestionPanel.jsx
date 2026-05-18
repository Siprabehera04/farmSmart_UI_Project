import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

const soilOptions = ['All', 'Loamy', 'Clayey', 'Sandy', 'Silty', 'Peaty', 'Chalky'];
const seasonOptions = ['All', 'Kharif', 'Rabi', 'Zaid', 'All Season'];

export default function SuggestionPanel({ crops }) {
  const [soilType, setSoilType] = useState('All');
  const [season, setSeason] = useState('All');
  const [suggestions, setSuggestions] = useState([]);

  const filtered = useMemo(() => {
    return crops.filter((crop) => {
      const soilMatch = soilType === 'All' || crop.soilType === soilType;
      const seasonMatch = season === 'All' || crop.season === season;
      return soilMatch && seasonMatch;
    });
  }, [crops, soilType, season]);

  const handleSuggest = () => {
    const prioritized = [...filtered].sort((a, b) => {
      const scoreA = Number(a.isAIRecommended) * 2 + Number(a.isTrending) + a.usageCount / 100;
      const scoreB = Number(b.isAIRecommended) * 2 + Number(b.isTrending) + b.usageCount / 100;
      return scoreB - scoreA;
    });
    setSuggestions(prioritized.slice(0, 3));
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-white to-lime-50/70 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">Quick AI Suggestion</h3>
          <p className="text-sm text-slate-500">Pick soil and season to preview matching crops.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <select
          value={soilType}
          onChange={(event) => setSoilType(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400"
        >
          {soilOptions.map((soil) => (
            <option key={soil} value={soil}>
              Soil: {soil}
            </option>
          ))}
        </select>

        <select
          value={season}
          onChange={(event) => setSeason(event.target.value)}
          className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400"
        >
          {seasonOptions.map((seasonOption) => (
            <option key={seasonOption} value={seasonOption}>
              Season: {seasonOption}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSuggest}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-200"
        >
          Suggest
        </button>
      </div>

      {suggestions.length ? (
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {suggestions.map((crop) => (
            <div key={crop.id} className="rounded-xl border border-emerald-200 bg-white p-3">
              <p className="text-sm font-black text-slate-800">{crop.name}</p>
              <p className="text-xs text-slate-500">{crop.soilType} • {crop.season}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">Rs {crop.profit.toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
