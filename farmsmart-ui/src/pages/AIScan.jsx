import React, { useState, useRef } from 'react';
import { Camera, Upload, ArrowLeft, ShieldCheck, Activity, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { analyzeCropHealth } from '../services/aiService';

export default function AIScan({ setStep }) {
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setResult(null);
    setError('');
    
    // Start scanning animation
    setIsScanning(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const mimeType = file.type;
        // Call the real AI engine
        const diagnosticData = await analyzeCropHealth(base64Data, mimeType);
        
        // Wait a small bit extra for the "Scanning" effect to look premium
        setTimeout(() => {
          setResult(diagnosticData);
          setIsScanning(false);
        }, 2000);
        
      } catch (err) {
        console.error(err);
        setError("Our AI couldn't clearly identify this plant. Please try a closer, well-lit photo of the leaf.");
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const getSeverityStyles = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'low') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Container */}
      <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setStep('home')} className="p-3 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="bg-emerald-500/10 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> AI Plant Doctor V1
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-emerald-950 font-heading mb-3 text-center">AI Health Scan</h2>
        <p className="text-emerald-800/60 font-medium text-center max-w-sm mx-auto mb-10">
          Upload a photo of your leaf or crop to detect diseases in real-time.
        </p>

        {/* Upload/Preview Zone */}
        <div 
          onClick={() => !isScanning && fileInputRef.current?.click()}
          className={`relative h-80 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center
            ${image ? 'border-emerald-500/50' : 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/50'}
          `}
        >
          {image ? (
            <>
              <img src={image} alt="Crop preview" className="absolute inset-0 w-full h-full object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                  <div className="relative w-48 h-48 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-emerald-400 rounded-full animate-ping opacity-75"></div>
                    <Activity size={48} className="animate-pulse" />
                    {/* Scanning Bar Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan"></div>
                  </div>
                  <p className="mt-6 font-black uppercase tracking-[0.3em] text-xs">AI is Analyzing...</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-sm">
                <Camera size={32} />
              </div>
              <p className="font-black text-emerald-950 text-lg">Click to Take Photo</p>
              <p className="text-emerald-800/50 text-xs font-bold uppercase tracking-wider mt-1">Accepts JPG, PNG from Mobile/Desktop</p>
            </div>
          )}
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
          {image && !isScanning && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-emerald-600 hover:scale-110 transition-transform">
              <RefreshCw size={20} />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
            <AlertTriangle size={18} /> {error}
          </div>
        )}
      </div>

      {/* Result Display (Visible when Scan completes) */}
      {result && !isScanning && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* Main Diagnosis Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 mb-3 ${getSeverityStyles(result.severity)}`}>
                    <Activity size={12} /> {result.severity} Severity
                  </div>
                  <h3 className="text-4xl font-black font-heading tracking-tight mb-2 uppercase">{result.diagnosis}</h3>
                  <p className="text-emerald-400 font-bold text-sm tracking-widest">{result.localizedDiagnosis}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Confidence</p>
                   <p className="text-3xl font-black font-heading text-emerald-400">{result.confidence}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-8">
                <p className="italic text-emerald-50/80 text-lg leading-relaxed">
                  "{result.symptoms}"
                </p>
              </div>

              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">
                <CheckCircle size={16} /> Recommended Treatment
              </h4>
              <div className="grid gap-3">
                {result.treatment?.map((step, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 text-emerald-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium text-emerald-50/90">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-5 rounded-[1.5rem] border-2 border-emerald-600/20 text-emerald-700 font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Rescan Different Sample
          </button>
        </div>
      )}

      {/* Footer Note */}
      <p className="text-center text-[10px] uppercase font-black tracking-widest text-emerald-800/30 px-10">
        Note: This is an AI-generated diagnosis. Please consult an Agricultural Officer for critical pesticide decisions.
      </p>
    </div>
  );
}