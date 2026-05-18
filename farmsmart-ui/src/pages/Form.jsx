import React, { useState, useRef } from 'react';
import { MapPin, Map, Navigation, Maximize, Database, AlertCircle, Calendar, Languages, Camera, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { getCropRecommendation, detectSoilFromImage } from '../services/aiService';

export default function Form({ onRecommendationReady }) {
  const [formStep, setFormStep] = useState(1);
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [landSize, setLandSize] = useState('');
  const [sowingMonth, setSowingMonth] = useState('January');
  const [language, setLanguage] = useState('English');
  
  const [soilType, setSoilType] = useState('Loamy');
  const [soilImagePreview, setSoilImagePreview] = useState(null);
  const [detectingSoil, setDetectingSoil] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const getLocalizedSoilOptions = (lang) => {
    const map = {
      'Hindi': { Loamy: 'दोमट (Loamy)', Clayey: 'चिकनी (Clayey)', Sandy: 'बलुई (Sandy)', Silty: 'गाद (Silty)', Peaty: 'पीट (Peaty)', Chalky: 'चूनेदार (Chalky)' },
      'Punjabi': { Loamy: 'ਦੋਮਟ (Loamy)', Clayey: 'ਚੀਕਣੀ (Clayey)', Sandy: 'ਰੇਤਲੀ (Sandy)', Silty: 'ਗਾਰ (Silty)', Peaty: 'ਪੀਟ (Peaty)', Chalky: 'ਚਾਕ ਵਾਲੀ (Chalky)' },
      'Marathi': { Loamy: 'पोयटा (Loamy)', Clayey: 'चिकणमाती (Clayey)', Sandy: 'वाळूची (Sandy)', Silty: 'गाळाची (Silty)', Peaty: 'पीट (Peaty)', Chalky: 'खडूची (Chalky)' },
      'Telugu': { Loamy: 'లోమీ (Loamy)', Clayey: 'బంకమట్టి (Clayey)', Sandy: 'ఇసుక (Sandy)', Silty: 'సిల్టీ (Silty)', Peaty: 'పీటి (Peaty)', Chalky: 'చాల్కీ (Chalky)' },
      'Bengali': { Loamy: 'দোঁয়াশ (Loamy)', Clayey: 'এঁটেল (Clayey)', Sandy: 'বেলে (Sandy)', Silty: 'পলি (Silty)', Peaty: 'পিট (Peaty)', Chalky: 'চুনা (Chalky)' },
      'Odia': { Loamy: 'ଦୋଆଁଶ (Loamy)', Clayey: 'ମଟାଳ (Clayey)', Sandy: 'ବାଲିଆ (Sandy)', Silty: 'ପଟୁ (Silty)', Peaty: 'ପିଟ୍ (Peaty)', Chalky: 'ଚୂନଖଡ଼ି (Chalky)' },
    };
    return map[lang] || { Loamy: 'Loamy', Clayey: 'Clayey', Sandy: 'Sandy', Silty: 'Silty', Peaty: 'Peaty', Chalky: 'Chalky' };
  };

  const soilOptionsMap = getLocalizedSoilOptions(language);

  const handleNextStep = () => {
    if (!location.trim() || !district.trim() || !pincode.trim() || !landSize.trim()) {
      setError('Please fill in all location and land details.');
      return;
    }
    setError('');
    setFormStep(2);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSoilImagePreview(previewUrl);

    setDetectingSoil(true);
    setError('');
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const mimeType = file.type;
        const detectedType = await detectSoilFromImage(base64Data, mimeType);
        setSoilType(detectedType);
        
        // Voice Confirmation for Illiterate Farmers
        const soilName = soilOptionsMap[detectedType] || detectedType;
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${language.toLowerCase().substring(0,2)}&client=tw-ob&q=${encodeURIComponent("Soil successfully identified as " + soilName)}`;
        const audio = new Audio(ttsUrl);
        audio.referrerPolicy = "no-referrer";
        audio.play().catch(e => console.log("Audio prep for voice guide failed", e));
        
      } catch (err) {
        console.error(err);
        setError("Failed to detect soil from image.");
      } finally {
        setDetectingSoil(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    
    try {
      const data = await getCropRecommendation(location, district, pincode, landSize, soilType, sowingMonth);
      onRecommendationReady(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate recommendation.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 relative z-10 min-h-[500px]">
      
      {error && (
        <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-md text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {formStep === 1 ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 className="text-3xl font-black text-emerald-950 mb-2 font-heading">Land Details</h3>
          <p className="text-emerald-800/60 mb-8 font-medium">Step 1: Where is your land located?</p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1">State / Region</label>
                <div className="flex items-center bg-white/50 backdrop-blur-md border-2 border-white/70 focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70">
                  <MapPin className="text-emerald-600" size={20} />
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 placeholder-slate-400" placeholder="e.g. Punjab" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1">District</label>
                 <div className="flex items-center bg-white/50 backdrop-blur-md border-2 border-white/70 focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70">
                   <Map className="text-emerald-600" size={20} />
                   <input value={district} onChange={(e) => setDistrict(e.target.value)} className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 placeholder-slate-400" placeholder="e.g. Ludhiana" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1">Pincode / Zip</label>
                 <div className="flex items-center bg-white/50 backdrop-blur-md border-2 border-white/70 focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70">
                   <Navigation className="text-emerald-600" size={20} />
                   <input value={pincode} onChange={(e) => setPincode(e.target.value)} className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 placeholder-slate-400" placeholder="e.g. 141001" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1">Land Size (Acres)</label>
                 <div className="flex items-center bg-white/50 backdrop-blur-md border-2 border-white/70 focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70">
                   <Maximize className="text-emerald-600" size={20} />
                   <input value={landSize} onChange={(e) => setLandSize(e.target.value)} className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 placeholder-slate-400" placeholder="5.5" type="number" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1">Planned Sowing Month</label>
                <div className="flex items-center bg-white/50 backdrop-blur-md border-2 border-white/70 focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70">
                  <Calendar className="text-emerald-600" size={20} />
                  <select value={sowingMonth} onChange={(e) => setSowingMonth(e.target.value)} className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 appearance-none cursor-pointer">
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1">Local Language</label>
                <div className="flex items-center bg-white/50 backdrop-blur-md border-2 border-white/70 focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70">
                  <Languages className="text-emerald-600" size={20} />
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 appearance-none cursor-pointer">
                    {['English', 'Hindi', 'Punjabi', 'Marathi', 'Telugu', 'Bengali', 'Odia', 'Tamil', 'Gujarati', 'Malayalam'].map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button onClick={handleNextStep} className="w-full py-5 rounded-[1.5rem] font-bold text-xl transition-all duration-300 flex justify-center items-center mt-6 bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 border border-emerald-400/50 active:scale-[0.98]">
              Next: Soil Analysis <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button onClick={() => setFormStep(1)} className="flex items-center text-xs font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest mb-6 transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back
          </button>
          
          <h3 className="text-3xl font-black text-emerald-950 mb-2 font-heading">Soil Intelligence</h3>
          <p className="text-emerald-800/60 mb-8 font-medium">Step 2: Upload a picture of your soil or select manually.</p>
          
          <div className="space-y-8">
            
            {/* Image Upload Area */}
            <div className="bg-white/40 border-2 border-dashed border-emerald-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-white/60 shadow-sm relative overflow-hidden">
              {soilImagePreview ? (
                <div className="relative w-full max-w-[200px] h-40 rounded-2xl overflow-hidden shadow-md border border-emerald-200">
                  <img src={soilImagePreview} alt="Soil Preview" className="w-full h-full object-cover" />
                  {detectingSoil && (
                     <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <div className="h-8 w-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-xs font-bold tracking-widest uppercase">Detecting...</span>
                     </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm mb-4">
                    <Camera size={28} />
                  </div>
                  <p className="font-bold text-emerald-900 mb-1">Take a picture of your soil</p>
                  <p className="text-emerald-700/60 text-sm mb-6">Our Vision AI will instantly determine the soil type.</p>
                </>
              )}
              
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={detectingSoil}
                className="bg-white border border-emerald-200 text-emerald-700 font-bold px-6 py-3 rounded-full shadow-sm flex items-center gap-2 hover:bg-emerald-50 transition-colors mt-4 relative z-10"
              >
                <Upload size={18} /> {soilImagePreview ? 'Retake Photo' : 'Upload Image'}
              </button>
            </div>

            {/* Manual Selection */}
            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50 ml-1 flex justify-between">
                <span>Or choose manually (in {language})</span>
                {soilImagePreview && !detectingSoil && <span className="text-emerald-500 flex items-center gap-1 animate-pulse"><Database size={10} /> AI Confirmed</span>}
              </label>
              <div className={`flex items-center bg-white/50 backdrop-blur-md border-2 ${soilImagePreview && !detectingSoil ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/70'} focus-within:border-emerald-400 focus-within:bg-white transition-all rounded-2xl px-4 shadow-sm hover:bg-white/70`}>
                <Database className={soilImagePreview && !detectingSoil ? 'text-emerald-500' : 'text-emerald-600'} size={20} />
                <select 
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="bg-transparent w-full p-4 outline-none font-medium text-slate-800 appearance-none cursor-pointer"
                >
                  {Object.entries(soilOptionsMap).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading || detectingSoil}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-xl transition-all duration-300 flex justify-center items-center ${loading || detectingSoil ? 'bg-emerald-400/80 text-white cursor-not-allowed border border-emerald-300' : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 border border-emerald-400/50 active:scale-[0.98]'}`}
            >
              {loading ? <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : "Generate Recommendation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}