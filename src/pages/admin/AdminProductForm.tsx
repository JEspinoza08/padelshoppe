import { useMemo, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { ProductFormValues } from '../../lib/adminTypes';
import { supabase } from '../../lib/supabase';

type Props = {
  product: ProductFormValues;
  onClose: () => void;
  onSave: (values: ProductFormValues) => Promise<void>;
};

const categories = ['palas', 'zapatillas', 'bolsos', 'accesorios', 'ropa', 'ofertas'];
const labels = ['Nuevo', 'Oferta', 'Más vendido', 'Recomendado'];
const levels = ['Principiante', 'Intermedio', 'Avanzado'];
const styles = ['Control', 'Potencia', 'Equilibrio'];

export default function AdminProductForm({ product, onClose, onSave }: Props) {
  const [values, setValues] = useState<ProductFormValues>(product);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const featuresText = useMemo(() => values.features.join('\n'), [values.features]);

  const setField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    const ext = file.name.split('.').pop();
    const fileName = `productos/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('productos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('productos')
      .getPublicUrl(fileName);

    setField('image_url', data.publicUrl);
    setUploading(false);
  };

  const toggleLevel = (level: string) => {
    setValues((prev) => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter((item) => item !== level)
        : [...prev.level, level],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    await onSave(values);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl p-5 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">{values.id ? 'Editar producto' : 'Nuevo producto'}</h2>
            <p className="text-sm text-gray-400">Completa los datos principales del producto.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white">
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nombre">
            <input value={values.name} onChange={(e) => setField('name', e.target.value)} required className="input-admin" />
          </Field>

          <Field label="Marca">
            <input value={values.brand} onChange={(e) => setField('brand', e.target.value)} required className="input-admin" />
          </Field>

          <Field label="Categoría">
            <select value={values.category} onChange={(e) => setField('category', e.target.value)} className="input-admin capitalize">
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>

          <Field label="Etiqueta">
            <select value={values.label} onChange={(e) => setField('label', e.target.value)} className="input-admin">
              {labels.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>

          <Field label="Precio actual">
            <input type="number" min="0" value={values.price} onChange={(e) => setField('price', Number(e.target.value))} required className="input-admin" />
          </Field>

          <Field label="Precio anterior / tachado">
            <input type="number" min="0" value={values.original_price ?? ''} onChange={(e) => setField('original_price', e.target.value ? Number(e.target.value) : null)} className="input-admin" />
          </Field>

          <Field label="Stock disponible">
            <input type="number" min="0" value={values.stock} onChange={(e) => setField('stock', Number(e.target.value))} required className="input-admin" />
          </Field>

          <Field label="Tipo de juego">
            <select value={values.play_style} onChange={(e) => setField('play_style', e.target.value)} className="input-admin">
              {styles.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>

          <Field label="Peso">
            <select value={values.weight ?? ''} onChange={(e) => setField('weight', e.target.value || null)} className="input-admin">
              <option value="">No aplica</option>
              <option value="Ligera">Ligera</option>
              <option value="Pesada">Pesada</option>
            </select>
          </Field>

          <Field label="Imagen del producto">
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-4 text-sm text-gray-300">
                <ImagePlus size={18} />
                {uploading ? 'Subiendo imagen...' : 'Seleccionar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />
              </label>

              {values.image_url && (
                <div className="flex items-center gap-3">
                  <img
                    src={values.image_url}
                    alt="Vista previa"
                    className="w-20 h-20 rounded-xl object-cover border border-white/10 bg-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => setField('image_url', '')}
                    className="text-sm text-red-300 hover:text-red-200"
                  >
                    Quitar imagen
                  </button>
                </div>
              )}
            </div>
          </Field>
        </div>

        <Field label="Descripción">
          <textarea value={values.description} onChange={(e) => setField('description', e.target.value)} rows={3} className="input-admin" />
        </Field>

        <Field label="Características, una por línea">
          <textarea
            value={featuresText}
            onChange={(e) => setField('features', e.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
            rows={5}
            className="input-admin"
          />
        </Field>

        <Field label="Recomendado para">
          <textarea value={values.recommended_for} onChange={(e) => setField('recommended_for', e.target.value)} rows={2} className="input-admin" />
        </Field>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-bold text-white mb-2">Nivel</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <label key={level} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={values.level.includes(level)} onChange={() => toggleLevel(level)} />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-2">Visibilidad</p>
            <label className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={values.is_active} onChange={(e) => setField('is_active', e.target.checked)} />
              Producto visible en catálogo
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-white/10 pt-5">
          <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold">Cancelar</button>
          <button type="submit" disabled={saving || uploading} className="px-5 py-3 rounded-xl bg-[#e84c2b] hover:bg-[#d83f20] disabled:opacity-60 text-white font-bold">
            {saving ? 'Guardando...' : uploading ? 'Subiendo imagen...' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-bold text-white mb-2">{label}</span>
      {children}
    </label>
  );
}