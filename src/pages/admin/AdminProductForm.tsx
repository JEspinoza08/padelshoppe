import { useEffect, useMemo, useState } from "react";
import { X, ImagePlus, Plus, Trash2 } from "lucide-react";
import { ProductFormValues } from "../../lib/adminTypes";
import { supabase } from "../../lib/supabase";

type Props = {
  product: ProductFormValues;
  onClose: () => void;
  onSave: (values: ProductFormValues) => Promise<void>;
};

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
};

const categories = [
  "palas",
  "zapatillas",
  "bolsos",
  "accesorios",
  "ropa",
  "ofertas",
];
const labels = ["Nuevo", "Oferta", "Más vendido", "Recomendado"];
const levels = ["Principiante", "Intermedio", "Avanzado"];
const styles = ["Control", "Potencia", "Equilibrio"];

export default function AdminProductForm({ product, onClose, onSave }: Props) {
  const [values, setValues] = useState<ProductFormValues>(product);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [newBrand, setNewBrand] = useState("");
  const [savingBrand, setSavingBrand] = useState(false);

  const featuresText = useMemo(
    () => values.features.join("\n"),
    [values.features],
  );

  const loadBrands = async () => {
    setLoadingBrands(true);

    const { data, error } = await supabase
      .from("brands")
      .select("id, name, slug, logo_url, is_active")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error(error);
    } else {
      setBrands((data || []) as Brand[]);
    }

    setLoadingBrands(false);
  };
  const slugifyBrand = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateBrand = async () => {
    const cleanName = newBrand.trim().toUpperCase();

    if (!cleanName) {
      alert("Escribe el nombre de la marca.");
      return;
    }

    const alreadyExists = brands.some(
      (brand) => brand.name.trim().toLowerCase() === cleanName.toLowerCase(),
    );

    if (alreadyExists) {
      alert("Esta marca ya está registrada.");
      return;
    }

    setSavingBrand(true);

    const { data, error } = await supabase
      .from("brands")
      .insert({
        name: cleanName,
        slug: slugifyBrand(cleanName),
        logo_url: null,
        is_active: true,
      })
      .select("id, name, slug, logo_url, is_active")
      .single();

    if (error) {
      console.error("Error registrando marca:", error);
      alert(`No se pudo registrar la marca: ${error.message}`);
      setSavingBrand(false);
      return;
    }

    const createdBrand = data as Brand;

    setBrands((currentBrands) =>
      [...currentBrands, createdBrand].sort((a, b) =>
        a.name.localeCompare(b.name, "es"),
      ),
    );

    setField("brand", createdBrand.name);
    setNewBrand("");
    setSavingBrand(false);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const setField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };
  const addVariant = () => {
    setValues((prev) => ({
      ...prev,
      product_variants: [
        ...(prev.product_variants || []),
        {
          variant_type: prev.category === "zapatillas" ? "shoe_size" : "size",
          variant_value: "",
          stock: 0,
          is_active: true,
        },
      ],
    }));
  };

  const updateVariant = (
    index: number,
    key: "variant_type" | "variant_value" | "stock" | "is_active",
    value: string | number | boolean,
  ) => {
    setValues((prev) => ({
      ...prev,
      product_variants: (prev.product_variants || []).map((variant, i) =>
        i === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setValues((prev) => ({
      ...prev,
      product_variants: (prev.product_variants || []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop() || "webp";
    const fileName = `productos/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("productos").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(selectedFiles.map(uploadImage));

      setValues((prev) => {
        const currentGallery = prev.product_images || [];
        const nextMainImage = prev.image_url || uploadedUrls[0];
        const galleryUrls = prev.image_url ? uploadedUrls : uploadedUrls.slice(1);

        return {
          ...prev,
          image_url: nextMainImage,
          product_images: [
            ...currentGallery,
            ...galleryUrls.map((image_url, index) => ({
              image_url,
              sort_order: currentGallery.length + index,
            })),
          ],
        };
      });
    } catch (error: any) {
      alert(error?.message || "No se pudieron subir las imágenes.");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      product_images: (prev.product_images || [])
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, imageIndex) => ({ ...image, sort_order: imageIndex })),
    }));
  };

  const setAsMainImage = (index: number) => {
    setValues((prev) => {
      const gallery = [...(prev.product_images || [])];
      const selected = gallery[index];
      if (!selected) return prev;

      gallery.splice(index, 1);
      if (prev.image_url) {
        gallery.unshift({ image_url: prev.image_url, sort_order: 0 });
      }

      return {
        ...prev,
        image_url: selected.image_url,
        product_images: gallery.map((image, imageIndex) => ({
          ...image,
          sort_order: imageIndex,
        })),
      };
    });
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
    <div
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl p-5 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">
              {values.id ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-sm text-gray-400">
              Completa los datos principales del producto.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nombre">
            <input
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              className="input-admin"
            />
          </Field>

          <Field label="Marca">
            <div className="space-y-3">
              <select
                value={values.brand}
                onChange={(e) => setField("brand", e.target.value)}
                className="input-admin"
                required
                disabled={loadingBrands}
              >
                <option value="">
                  {loadingBrands
                    ? "Cargando marcas..."
                    : "Selecciona una marca"}
                </option>

                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Ej: HEAD"
                  className="input-admin"
                />

                <button
                  type="button"
                  onClick={handleCreateBrand}
                  disabled={savingBrand || !newBrand.trim()}
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingBrand ? "Agregando..." : "Agregar marca"}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                La nueva marca se guardará en Supabase y quedará seleccionada
                automáticamente.
              </p>
            </div>
          </Field>

          <Field label="Categoría">
            <select
              value={values.category}
              onChange={(e) => setField("category", e.target.value)}
              className="input-admin capitalize"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Etiqueta">
            <select
              value={values.label}
              onChange={(e) => setField("label", e.target.value)}
              className="input-admin"
            >
              {labels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Precio actual">
            <input
              type="number"
              min="0"
              value={values.price}
              onChange={(e) => setField("price", Number(e.target.value))}
              required
              className="input-admin"
            />
          </Field>

          <Field label="Precio anterior / tachado">
            <input
              type="number"
              min="0"
              value={values.original_price ?? ""}
              onChange={(e) =>
                setField(
                  "original_price",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className="input-admin"
            />
          </Field>

          {!values.has_variants && (
            <Field label="Stock disponible">
              <input
                type="number"
                min="0"
                value={values.stock}
                onChange={(e) => setField("stock", Number(e.target.value))}
                required
                className="input-admin"
              />
            </Field>
          )}

          <Field label="Tipo de juego">
            <select
              value={values.play_style}
              onChange={(e) => setField("play_style", e.target.value)}
              className="input-admin"
            >
              {styles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Peso">
            <select
              value={values.weight ?? ""}
              onChange={(e) => setField("weight", e.target.value || null)}
              className="input-admin"
            >
              <option value="">No aplica</option>
              <option value="Ligera">Ligera</option>
              <option value="Pesada">Pesada</option>
            </select>
          </Field>

          <Field label="Fotos del producto">
            <div className="space-y-4">
              <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-4 text-sm text-gray-300">
                <ImagePlus size={18} />
                {uploading ? "Subiendo fotos..." : "Seleccionar una o varias fotos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={(e) => {
                    if (e.target.files?.length) handleImageUpload(e.target.files);
                    e.currentTarget.value = "";
                  }}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-500">
                La primera foto será la portada. Puedes subir varias a la vez y cambiar la portada cuando quieras.
              </p>

              {values.image_url && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Portada</p>
                  <div className="relative w-28 overflow-hidden rounded-xl border border-[#f04b2f]/60 bg-zinc-800 p-2">
                    <img
                      src={values.image_url}
                      alt="Portada del producto"
                      className="h-24 w-full object-contain"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-[#f04b2f] px-2 py-1 text-[10px] font-black uppercase text-white">Principal</span>
                  </div>
                </div>
              )}

              {(values.product_images || []).length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Galería adicional</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(values.product_images || []).map((image, index) => (
                      <div key={`${image.image_url}-${index}`} className="rounded-xl border border-white/10 bg-zinc-800 p-2">
                        <img src={image.image_url} alt={`Foto ${index + 2}`} className="h-24 w-full rounded-lg object-contain" />
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={() => setAsMainImage(index)} className="flex-1 rounded-lg bg-white/10 px-2 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                            Hacer portada
                          </button>
                          <button type="button" onClick={() => removeGalleryImage(index)} aria-label="Quitar foto" className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Field>
        </div>
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-bold text-white">
                Variantes del producto
              </p>
              <p className="text-xs text-gray-400">
                Úsalo para ropa con tallas o zapatillas con números.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={values.has_variants}
                onChange={(e) => setField("has_variants", e.target.checked)}
              />
              Tiene variantes
            </label>
          </div>

          {values.has_variants && (
            <div className="space-y-3">
              {(values.product_variants || []).map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center rounded-xl border border-white/10 bg-zinc-950 p-3"
                >
                  <select
                    value={variant.variant_type}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "variant_type",
                        e.target.value as "size" | "shoe_size",
                      )
                    }
                    className="input-admin"
                  >
                    <option value="size">Talla</option>
                    <option value="shoe_size">Número zapatilla</option>
                  </select>

                  <input
                    value={variant.variant_value}
                    onChange={(e) =>
                      updateVariant(index, "variant_value", e.target.value)
                    }
                    placeholder={
                      variant.variant_type === "shoe_size" ? "Ej: 39" : "Ej: M"
                    }
                    className="input-admin"
                  />

                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, "stock", Number(e.target.value))
                    }
                    placeholder="Stock"
                    className="input-admin"
                  />

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-sm font-bold text-white"
              >
                <Plus size={16} />
                Agregar variante
              </button>
            </div>
          )}
        </div>
        <Field label="Descripción">
          <textarea
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={3}
            className="input-admin"
          />
        </Field>

        <Field label="Características, una por línea">
          <textarea
            value={featuresText}
            onChange={(e) =>
              setField(
                "features",
                e.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            rows={5}
            className="input-admin"
          />
        </Field>

        <Field label="Recomendado para">
          <textarea
            value={values.recommended_for}
            onChange={(e) => setField("recommended_for", e.target.value)}
            rows={2}
            className="input-admin"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-bold text-white mb-2">Nivel</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={values.level.includes(level)}
                    onChange={() => toggleLevel(level)}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-2">Visibilidad</p>
            <label className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={values.is_active}
                onChange={(e) => setField("is_active", e.target.checked)}
              />
              Producto visible en catálogo
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-5 py-3 rounded-xl bg-[#e84c2b] hover:bg-[#d83f20] disabled:opacity-60 text-white font-bold"
          >
            {saving
              ? "Guardando..."
              : uploading
                ? "Subiendo imagen..."
                : "Guardar producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-bold text-white mb-2">{label}</span>
      {children}
    </label>
  );
}
