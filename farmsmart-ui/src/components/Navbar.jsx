import { Sprout, Camera, User, LogOut } from 'lucide-react';

export default function Navbar({ setStep, onLogout }) {
  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-emerald-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('home')}>
        <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
          <Sprout size={22} />
        </div>
        <h1 className="text-xl font-black text-emerald-900 tracking-tight italic">FARM<span className="text-emerald-500 not-italic">SMART</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setStep('aiscan')} className="hidden md:flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition">
          <Camera size={18} /> AI Health Scan
        </button>
        <button
          onClick={onLogout}
          className="hidden md:flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-full border border-red-100 hover:bg-red-100 transition"
        >
          <LogOut size={18} /> Logout
        </button>
        <div className="h-10 w-10 rounded-full bg-slate-100 border border-emerald-200 flex items-center justify-center text-emerald-700 cursor-pointer hover:bg-emerald-50 transition">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
}