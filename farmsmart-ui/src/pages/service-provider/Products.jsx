const products = [
  { id: 1, name: 'Bio Fertilizer Pack', category: 'Fertilizer', price: 850, stock: 42 },
  { id: 2, name: 'Drip Irrigation Kit', category: 'Irrigation', price: 4200, stock: 15 },
  { id: 3, name: 'Neem Pesticide', category: 'Crop Protection', price: 560, stock: 33 },
];

export default function Products() {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800">Products</h2>
        <p className="mt-1 text-sm text-slate-600">Manage your available inventory for farmer orders.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-emerald-700">{product.category}</p>
            <p className="mt-3 text-sm font-semibold text-slate-600">Price: Rs {product.price.toLocaleString()}</p>
            <p className="text-sm font-semibold text-slate-600">Stock: {product.stock} units</p>
          </article>
        ))}
      </div>
    </section>
  );
}
