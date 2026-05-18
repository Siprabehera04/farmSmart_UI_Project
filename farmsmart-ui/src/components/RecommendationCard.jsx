import React, { useState } from 'react';
import { TrendingUp, Info, Sprout, Volume2, Square, Leaf } from 'lucide-react';

export default function RecommendationCard({ data, isPrimary = true, useNativeLang = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Decide which strings to use based on the toggle
  const cropName = useNativeLang ? (data.nativeCrop || data.crop) : data.crop;
  const logicText = useNativeLang ? (data.nativeLogic || data.logic) : data.logic;
  const profitText = useNativeLang ? (data.nativeProfit || data.profit) : data.profit;

  const handleSpeak = () => {
    if (isPlaying) {
      if (window.currentAudio) window.currentAudio.pause();
      setIsPlaying(false);
      return;
    }

    // Stop any existing speech before starting a new one
    if (window.currentAudio) window.currentAudio.pause();
    
    // We only read a short portion of the text to ensure it stays under URL length limits
    const rawText = `${cropName}. ${logicText}`;
    // Cut off safely at 180 chars to prevent Google TTS 400 Bad Request error
    const safeText = rawText.length > 180 ? rawText.substring(0, 180) + "..." : rawText;
    const textToRead = encodeURIComponent(safeText);
    
    // Set the language code using standard Google Translate 2-letter codes
    let langCode = 'en';
    if (useNativeLang && data.nativeLanguage) {
      const langMap = {
        'hindi': 'hi', 'bengali': 'bn', 'telugu': 'te', 
        'marathi': 'mr', 'tamil': 'ta', 'gujarati': 'gu', 
        'kannada': 'kn', 'odia': 'or', 'malayalam': 'ml', 
        'punjabi': 'pa', 'assamese': 'as'
      };
      langCode = langMap[data.nativeLanguage.toLowerCase()] || 'hi';
    }

    // Use a reliable cloud TTS endpoint instead of browser-dependent packages
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${textToRead}`;
    
    // Create an audio element instead of `new Audio()` so we can strip the referrer
    const audio = document.createElement('audio');
    audio.referrerPolicy = "no-referrer";
    audio.src = ttsUrl;
    
    window.currentAudio = audio; // Keep global reference so we can stop it later
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      console.error("Audio failed to load. The endpoint might have blocked the URL.");
    };
    
    audio.play().catch(e => {
        setIsPlaying(false);
        console.error("Autoplay prevented or network error:", e);
    });
  };

  return (
    <div className={`bg-gradient-to-br from-emerald-900/95 to-green-950/95 border border-emerald-700/50 shadow-[0_15px_40px_rgba(4,47,38,0.4)] backdrop-blur-xl rounded-3xl p-6 md:p-8 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(4,47,38,0.5)] hover:-translate-y-1`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className={`flex items-center gap-2 mb-2 text-emerald-400`}>
              <Sprout size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{isPrimary ? "Our Pick" : "Alternative Option"}</span>
            </div>
            <h2 className={`text-4xl font-black font-heading tracking-tight text-white`}>{cropName}</h2>
          </div>
          <div className="flex flex-col items-end gap-3 opacity-90">
            <button 
              onClick={handleSpeak}
              className={`p-3 rounded-full transition-all bg-emerald-800 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950`}
            >
              {isPlaying ? <Square size={18} fill="currentColor" className="text-red-400" /> : <Volume2 size={18} />}
            </button>
            <div className={`bg-white/10 border-white/20 text-white backdrop-blur-md border px-4 py-3 rounded-2xl text-center min-w-[90px]`}>
              <p className={`text-[9px] font-black uppercase tracking-widest text-emerald-300`}>Confidence</p>
              <p className="text-xl font-black font-heading">{data.confidence}</p>
            </div>
          </div>
        </div>
        <p className={`text-emerald-50/80 text-lg max-w-2xl mb-8 leading-relaxed font-medium`}>"{logicText}"</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`bg-emerald-800/40 border-emerald-700/50 hover:bg-emerald-800/60 transition-colors p-5 rounded-2xl border flex items-center gap-4 shadow-sm`}>
            <div className={`p-3 rounded-xl bg-emerald-500/20 text-emerald-400`}><TrendingUp size={24} /></div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest text-emerald-400`}>Profit Potential</p>
              <p className={`text-xl font-black font-heading text-white`}>{profitText}</p>
            </div>
          </div>
          <div className={`bg-emerald-800/40 border-emerald-700/50 hover:bg-emerald-800/60 transition-colors p-5 rounded-2xl border flex items-center gap-4 shadow-sm`}>
            <div className={`p-3 rounded-xl bg-emerald-500/20 text-emerald-400`}><Info size={24} /></div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest text-emerald-400`}>Market Demand</p>
              <p className={`text-xl font-black font-heading text-white`}>Very High</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Overlays */}
      <div className="absolute -top-32 -right-32 w-[25rem] h-[25rem] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <Leaf className="absolute -bottom-10 -right-10 text-emerald-500 opacity-[0.03] w-64 h-64 transform -rotate-12 pointer-events-none" />
    </div>
  );
}