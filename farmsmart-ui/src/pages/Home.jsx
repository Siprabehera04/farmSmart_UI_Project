import { ArrowRight, Leaf, Sprout, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home({ setStep }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-16 md:py-24 flex flex-col items-center text-center relative z-10"
    >
      <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-white/70 backdrop-blur-md border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-emerald-800 text-[10px] font-black uppercase tracking-[0.3em]">
        <Sprout size={16} className="text-emerald-500" /> Premium Farming Intelligence
      </div>
      
      <h2 className="text-6xl md:text-[5.5rem] font-black text-slate-800 mb-8 leading-[1.05] tracking-tight font-heading">
        Grow Smarter. <br/>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-400 italic">Earn Better.</span>
      </h2>
      
      <p className="text-slate-600 font-medium text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed">
        Using hyper-local AI and deep soil intelligence to provide the perfect precision crop recommendation for your land.
      </p>
      
      <button 
        onClick={() => setStep('form')} 
        className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-500 text-white px-10 py-6 rounded-[2rem] font-bold text-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] border border-emerald-400/50 flex items-center gap-4 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] transition-all duration-300 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-3">Analyze My Land <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" /></span>
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Decorative background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-300/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute top-20 -right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </motion.div>
  );
}