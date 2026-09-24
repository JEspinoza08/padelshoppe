# WhatsApp + galería de productos

## 1. Supabase
Antes de desplegar esta versión, abre **Supabase > SQL Editor** y ejecuta el archivo:

`SUPABASE_GALERIA_PRODUCTOS.sql`

Esto crea `product_images`, donde se guardan las fotos adicionales. La columna existente `products.image_url` continúa siendo la portada principal.

## 2. Panel admin
Al crear o editar un producto, en **Fotos del producto** puedes seleccionar varias imágenes.
- Si el producto todavía no tiene foto, la primera subida queda como portada.
- Las demás quedan en la galería.
- Puedes usar **Hacer portada** para intercambiar una foto adicional con la principal.
- Puedes quitar fotos adicionales antes de guardar.

## 3. Vista cliente
Al abrir el detalle de un producto se muestra una galería con miniaturas, flechas anterior/siguiente y contador de imágenes.

## 4. WhatsApp
Se agregó un botón flotante de WhatsApp en las vistas públicas. Usa el número configurado en `src/data/products.ts` (`WHATSAPP_NUMBER`) y no aparece dentro de `/admin`.
