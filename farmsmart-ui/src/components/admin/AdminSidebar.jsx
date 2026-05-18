import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wheat,
  Briefcase,
  Users,
  MessageSquare,
  Image,
  Languages,
  LogOut,
  Sprout,
} from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/crops', label: 'Crops', icon: Wheat },
  { to: '/admin/service-providers', label: 'Service Providers', icon: Briefcase },
  { to: '/admin/farmers', label: 'Farmers', icon: Users },
  { to: '/admin/queries', label: 'Queries', icon: MessageSquare },
  { to: '/admin/image-analysis', label: 'Image Analysis', icon: Image },
  { to: '/admin/language', label: 'Language', icon: Languages },
];

export default function AdminSidebar({ onLogout }) {
  return (
    <aside className="w-full lg:w-72 shrink-0 border-r border-emerald-100 bg-white/90 backdrop-blur-md">
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-3 py-3">
          <div className="rounded-xl bg-emerald-600 p-2 text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">FarmSmart AI</p>
            <p className="text-sm font-black text-slate-800">Admin Panel</p>
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
