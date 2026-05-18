import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const points = [
  {
    id: 1,
    name: 'Suresh',
    type: 'farmer',
    location: 'Mysore',
    lat: 12.2958,
    lng: 76.6394,
    crop: 'Cotton',
    distance: '2.3 km away',
  },
  {
    id: 2,
    name: 'Ramesh',
    type: 'farmer',
    location: 'Mandya',
    lat: 12.5221,
    lng: 76.8974,
    crop: 'Rice',
    distance: '3.1 km away',
  },
  {
    id: 3,
    name: 'Lakshmi',
    type: 'farmer',
    location: 'Nanjangud',
    lat: 12.1172,
    lng: 76.6828,
    crop: 'Ragi',
    distance: '1.9 km away',
  },
  {
    id: 4,
    name: 'Agro Buyer Hub',
    type: 'buyer',
    location: 'Srirangapatna',
    lat: 12.4223,
    lng: 76.6947,
    crop: 'Rice, Cotton',
    distance: '5.0 km away',
  },
  {
    id: 5,
    name: 'Kaveri Purchase Center',
    type: 'buyer',
    location: 'Maddur',
    lat: 12.5828,
    lng: 77.0418,
    crop: 'Ragi, Maize',
    distance: '6.2 km away',
  },
];

const farmerIcon = L.divIcon({
  html: '<div style="background:#16a34a;color:#fff;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(22,163,74,0.35);font-size:14px;">👨‍🌾</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -22],
});

const buyerIcon = L.divIcon({
  html: '<div style="background:#2563eb;color:#fff;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(37,99,235,0.35);font-size:14px;">🏪</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -22],
});

export default function MapView() {
  return (
    <section className="space-y-3">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
        <h3 className="text-xl font-black text-slate-800">Map View</h3>
        <p className="mt-1 text-sm text-slate-600">Live field map of farmers and buyers around your service zone.</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-5">
        <div className="h-[420px] overflow-hidden rounded-3xl border border-emerald-100 shadow-sm xl:col-span-4">
          <MapContainer center={[12.33, 76.75]} zoom={10} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={point.type === 'farmer' ? farmerIcon : buyerIcon}
              >
                <Popup>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{point.name}</p>
                    <p className="text-xs text-slate-600">Type: {point.type === 'farmer' ? 'Farmer' : 'Buyer'}</p>
                    <p className="text-xs text-slate-600">Location: {point.location}</p>
                    <p className="text-xs text-slate-600">Crops: {point.crop}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-2 rounded-3xl border border-emerald-100 bg-white/90 p-3 shadow-sm xl:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nearby List</p>
          {points.map((point) => (
            <div key={point.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-2.5 text-xs">
              <p className="font-bold text-slate-800">{point.name}</p>
              <p className="text-slate-600">{point.distance}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
