import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const buyers = [
  {
    id: 'buyer-1',
    name: 'Green Valley Traders',
    location: 'Mandya',
    crops: ['Ragi', 'Rice'],
    lat: 12.521,
    lng: 76.895,
    distanceKm: 2.3,
  },
  {
    id: 'buyer-2',
    name: 'Agro Bharat Procurement',
    location: 'Mysuru',
    crops: ['Cotton', 'Ragi', 'Maize'],
    lat: 12.306,
    lng: 76.642,
    distanceKm: 5.7,
  },
  {
    id: 'buyer-3',
    name: 'Kaveri Crop Market',
    location: 'Srirangapatna',
    crops: ['Rice', 'Sugarcane'],
    lat: 12.422,
    lng: 76.693,
    distanceKm: 3.9,
  },
  {
    id: 'buyer-4',
    name: 'Rural Harvest Hub',
    location: 'Nanjangud',
    crops: ['Cotton', 'Tur Dal', 'Ragi'],
    lat: 12.117,
    lng: 76.684,
    distanceKm: 8.2,
  },
];

const cropOptions = ['All Crops', 'Ragi', 'Cotton', 'Rice', 'Maize', 'Sugarcane', 'Tur Dal'];

export default function ServiceProviders() {
  const [selectedCrop, setSelectedCrop] = useState('All Crops');

  const filteredBuyers = useMemo(() => {
    if (selectedCrop === 'All Crops') return buyers;
    return buyers.filter((buyer) => buyer.crops.includes(selectedCrop));
  }, [selectedCrop]);

  const nearestBuyerId = useMemo(() => {
    if (!filteredBuyers.length) return null;
    return filteredBuyers.reduce((nearest, current) =>
      current.distanceKm < nearest.distanceKm ? current : nearest
    ).id;
  }, [filteredBuyers]);

  const mapCenter = filteredBuyers.length
    ? [filteredBuyers[0].lat, filteredBuyers[0].lng]
    : [12.3, 76.7];

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Buyer Discovery</h2>
            <p className="mt-1 text-sm text-slate-600">Find nearby buyers and view crop-wise procurement points.</p>
          </div>
          <div className="w-full md:w-72">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Find Buyers for Selected Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(event) => setSelectedCrop(event.target.value)}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
            >
              {cropOptions.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <div className="h-[520px] overflow-hidden rounded-3xl border border-emerald-100 shadow-sm">
            <MapContainer center={mapCenter} zoom={10} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredBuyers.map((buyer) => (
                <Marker key={buyer.id} position={[buyer.lat, buyer.lng]}>
                  <Popup>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">{buyer.name}</p>
                      <p className="text-xs text-slate-600">{buyer.location}</p>
                      <p className="text-xs text-slate-700">
                        <span className="font-semibold">Crops:</span> {buyer.crops.join(', ')}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="h-[520px] space-y-3 overflow-y-auto rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
            <h3 className="text-lg font-black text-slate-800">Buyer List</h3>
            {filteredBuyers.length ? (
              filteredBuyers.map((buyer) => {
                const isNearest = buyer.id === nearestBuyerId;
                return (
                  <article key={buyer.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-800">{buyer.name}</p>
                        <p className="text-xs text-slate-600">{buyer.location}</p>
                      </div>
                      {isNearest ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          <LocateFixed className="h-3 w-3" />
                          Nearest
                        </span>
                      ) : null}
                    </div>

                    <p className="mb-2 text-xs text-slate-700">
                      <span className="font-semibold">Crops:</span> {buyer.crops.join(', ')}
                    </p>

                    <p className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                      <MapPin className="h-4 w-4" />
                      {buyer.distanceKm.toFixed(1)} km away
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center text-sm font-medium text-slate-500">
                No buyers found for selected crop.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
