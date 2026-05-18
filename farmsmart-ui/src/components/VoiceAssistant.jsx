import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, Loader2, PhoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const vapiToken = import.meta.env.VITE_VAPI_PUBLIC_KEY;
// Handle different export styles to avoid "not a constructor" error
const VapiClass = Vapi.default || Vapi;
const vapi = (vapiToken && typeof VapiClass === 'function') ? new VapiClass(vapiToken) : null;

export default function VoiceAssistant({ farmContext }) {
  const [isCalling, setIsCalling] = useState(false);
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!vapi) return;

    vapi.on('call-start', () => {
      setIsCalling(true);
      setConnecting(false);
    });
    vapi.on('call-end', () => {
      setIsCalling(false);
      setConnecting(false);
    });
    vapi.on('error', (e) => {
      console.error('Vapi Error:', e);
      setConnecting(false);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleToggleCall = async () => {
    if (!vapi) {
      alert("Voice Assistant is not configured. Please check your Vapi Public Key.");
      return;
    }

    if (isCalling) {
      vapi.stop();
    } else {
      setConnecting(true);
      
      const systemPrompt = `
        You are "FarmSmart Assistant", a friendly, professional agricultural expert.
        Your goal is to help farmers understand their crop recommendations and soil health.
        
        CONTEXT FOR THIS FARMER:
        - Location: ${farmContext?.location || 'Unknown'}
        - District: ${farmContext?.district || 'Unknown'}
        - Soil Type: ${farmContext?.soilType || 'Unknown'}
        - Recommendations: ${farmContext?.recommendations?.map(r => r.crop).join(', ') || 'Pending'}
        
        INSTRUCTIONS:
        1. Speak clearly and use a warm, helpful tone.
        2. Keep answers concise but informative. 
        3. If the farmer asks why a crop was suggested, reference their soil type (${farmContext?.soilType}).
        4. Use simple language, as some users might be new to modern farming techniques.
        5. If they mention names of seeds or dealers, use the data provided in the recommendations.
      `;

      try {
        await vapi.start({
          name: "FarmSmart Assistant",
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              { role: "system", content: systemPrompt }
            ]
          },
          voice: {
            provider: "11labs",
            voiceId: "paul" // A friendly, trustworthy voice
          }
        });
      } catch (err) {
        console.error("Failed to start Vapi call:", err);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-24 right-0 bg-emerald-950/90 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-3xl shadow-2xl min-w-[200px] text-white"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1 justify-center items-center h-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-1 bg-emerald-400 rounded-full"
                  />
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Assistant Live</span>
            </div>
            <p className="text-[10px] text-emerald-100/60 mt-2 font-medium">How can I help you with your farm today?</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggleCall}
        disabled={connecting}
        className={`
          relative group flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 shadow-2xl
          ${isCalling 
            ? 'bg-red-500 hover:bg-red-600 rotate-135' 
            : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:scale-110 active:scale-95 border-4 border-white shadow-emerald-200'
          }
        `}
      >
        {/* Pulsing ring */}
        {!isCalling && (
           <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
        )}
        
        {connecting ? (
          <Loader2 className="text-white animate-spin" size={32} />
        ) : isCalling ? (
          <PhoneOff className="text-white" size={32} />
        ) : (
          <Mic className="text-white" size={32} />
        )}

        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-white text-emerald-950 px-4 py-2 rounded-2xl shadow-xl border border-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold text-sm">
          Talk to Assistant
        </div>
      </button>
    </div>
  );
}
