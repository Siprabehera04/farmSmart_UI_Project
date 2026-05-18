import React, { useState } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { Store, ChevronRight, Languages } from 'lucide-react';
import { DUMMY_DEALERS } from '../data/mockData';

export default function Result({ setStep, recommendationData }) {
  const [useNativeLang, setUseNativeLang] = useState(false);

  // Parse the new JSON structure
  const reports = recommendationData?.recommendations 
    ? recommendationData.recommendations 
    : (Array.isArray(recommendationData) ? recommendationData : [{
        crop: "Unknown", logic: "No data found.", confidence: "0%", profit: "$0", nativeLanguage: "Local"
      }]);

  const dealers = recommendationData?.localDealers?.length 
    ? recommendationData.localDealers 
    : DUMMY_DEALERS;

  const nativeLanguageName = reports[0]?.nativeLanguage || 'Local Language';

  return (
    <div className="space-y-8 pb-10">
      
      <div className="flex justify-end relative z-20">
        <button 
          onClick={() => setUseNativeLang(!useNativeLang)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm border ${useNativeLang ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white/80 backdrop-blur-md text-slate-600 border-white/60 hover:bg-white hover:text-emerald-700'}`}
        >
          <Languages size={18} />
          {useNativeLang ? 'Show in English' : `Translate to ${nativeLanguageName}`}
        </button>
      </div>

      <RecommendationCard data={reports[0]} isPrimary={true} useNativeLang={useNativeLang} />
      
      {reports.length > 1 && (
        <div className="grid gap-6 mt-6">
           <h3 className="text-xs font-black text-emerald-800/60 px-2 uppercase tracking-widest relative z-10">Alternative Options</h3>
           {reports.slice(1).map((report, idx) => (
             <RecommendationCard key={idx} data={report} isPrimary={false} useNativeLang={useNativeLang} />
           ))}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 relative z-10">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 font-heading text-emerald-950">
          <Store className="text-emerald-500" /> NEARBY DEALERS OR MARKETS
        </h3>
        <div className="grid gap-4">
          {dealers.map((dealer) => (
            <div 
              key={dealer.id} 
              className="flex items-center justify-between p-5 rounded-3xl bg-white/60 border border-white/80 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Store size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg font-heading tracking-tight">{dealer.name}</h4>
                  <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mt-1">
                    {dealer.distance} DISTANCE • ⭐ {dealer.rating}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-2" />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setStep('form')}
        className="w-full relative z-10 py-5 text-emerald-800/60 font-black text-sm uppercase tracking-widest hover:text-emerald-700 transition flex items-center justify-center gap-2"
      >
        ← Edit Land Parameters
      </button>
    </div>
  );
}