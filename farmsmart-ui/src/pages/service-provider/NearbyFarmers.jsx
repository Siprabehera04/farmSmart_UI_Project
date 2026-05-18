import RequestsList from '../../components/service-provider/requests/RequestsList';
import MapView from '../../components/service-provider/map/MapView';

export default function NearbyFarmers() {
  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800">Leads & Map Intelligence</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review active farmer leads and track nearby farmers/buyers on the map.
        </p>
      </div>

      <RequestsList />
      <MapView />
    </section>
  );
}
