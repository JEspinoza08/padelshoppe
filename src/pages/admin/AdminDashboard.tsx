import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Edit, LogOut, Package, Plus, Search, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminProduct, ProductFormValues } from '../../lib/adminTypes';
import AdminProductForm from './AdminProductForm';

const emptyProduct: ProductFormValues = {
  name: '',
  brand: 'NOX',
  category: 'palas',
  price: 0,
  original_price: null,
  label: 'Nuevo',
  image_url: '',
  description: '',
  features: [],
  recommended_for: '',
  level: ['Intermedio'],
  play_style: 'Equilibrio',
  weight: null,
  is_offer: false,
  stock: 0,
  is_active: true,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<ProductFormValues | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) setError(error.message);
    else setProducts((data || []) as AdminProduct[]);

    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLogged(Boolean(data.session));
      setCheckingSession(false);
      if (data.session) loadProducts();
      else setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.brand, p.category, p.label].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [products, query]);

  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const lowStock = products.filter((p) => Number(p.stock || 0) <= 3).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const handleSave = async (values: ProductFormValues) => {
  const payload = {
    ...values,
    slug: slugify(values.name),
    original_price: values.original_price || null,
    is_offer: Boolean(values.original_price && values.original_price > values.price),
    updated_at: new Date().toISOString(),
  };

  const { error } = values.id
    ? await supabase.from('products').update(payload).eq('id', values.id)
    : await supabase.from('products').insert(payload);

  if (error) {
    alert(error.message);
    return;
  }

  setEditing(null);
  await loadProducts();
};

  const handleDelete = async (product: AdminProduct) => {
    const ok = confirm(`¿Eliminar ${product.name}?`);
    if (!ok) return;

    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) alert(error.message);
    else await loadProducts();
  };

  if (!checkingSession && !isLogged) return <Navigate to="/admin/login" replace />;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <span className="text-[#e84c2b] font-bold text-sm uppercase">PadelShop Perú</span>
            <h1 className="text-3xl md:text-4xl font-black mt-1">Panel administrativo</h1>
            <p className="text-gray-400 mt-2">Gestiona productos, precios, disponibilidad y stock.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(emptyProduct)}
              className="inline-flex items-center gap-2 bg-[#e84c2b] hover:bg-[#d83f20] text-white font-bold rounded-xl px-4 py-3"
            >
              <Plus size={18} /> Nuevo producto
            </button>
            <button
  onClick={() => navigate("/admin/orders")}
  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3"
>
  Pedidos
</button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3"
            >
              <LogOut size={18} /> Salir
            </button>
          </div>
        </header>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Productos</p>
            <p className="text-3xl font-black mt-2">{products.length}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Stock total</p>
            <p className="text-3xl font-black mt-2">{totalStock}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Stock bajo</p>
            <p className="text-3xl font-black mt-2">{lowStock}</p>
          </div>
        </section>

        <div className="relative mb-5">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, marca o categoría..."
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-white outline-none focus:border-[#e84c2b]"
          />
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 p-4">{error}</div>}

        <section className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Cargando productos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No hay productos registrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-gray-300">
                  <tr>
                    <th className="text-left p-4">Producto</th>
                    <th className="text-left p-4">Categoría</th>
                    <th className="text-left p-4">Precio</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.03]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center"><Package size={18} /></div>
                          )}
                          <div>
                            <p className="font-bold text-white line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-gray-300">{product.category}</td>
                      <td className="p-4 text-gray-300">S/ {product.price}</td>
                      <td className="p-4">
                        <span className={`font-bold ${product.stock <= 3 ? 'text-red-400' : 'text-emerald-400'}`}>{product.stock}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.is_active ? 'bg-emerald-500/10 text-emerald-300' : 'bg-gray-500/10 text-gray-400'}`}>
                          {product.is_active ? 'Activo' : 'Oculto'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditing(product)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10" title="Editar">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(product)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editing && (
        <AdminProductForm
          product={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
