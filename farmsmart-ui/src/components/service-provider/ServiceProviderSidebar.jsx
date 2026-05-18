import { NavLink } from 'react-router-dom';
import { Package, Users, LogOut, Tractor } from 'lucide-react';

const links = [
  { to: '/service-provider/products', label: 'Products', icon: Package },
  { to: '/service-provider/nearby-farmers', label: 'Requests & Map', icon: Users },
];

export default function ServiceProviderSidebar({ onLogout }) {
  return (
    <aside className="w-full shrink-0 border-r border-emerald-100 bg-white/85 backdrop-blur-md lg:w-72">
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-3 py-3">
          <div className="rounded-xl bg-emerald-600 p-2 text-white">
            <Tractor className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">KrishiVoice AI</p>
            <p className="text-sm font-black text-slate-800">Service Provider</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300/40'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
