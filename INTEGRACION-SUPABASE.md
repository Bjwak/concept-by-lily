# Integración Admin → Catálogos → Supabase

- Admin: `Bjwak/concept-by-lily-admin`, rama `main`.
- Catálogos: `Bjwak/concept-by-lily`, rama `main`.
- Supabase de producción: `ftzfsxcnfcqdmwhpardt`.

Ambas aplicaciones utilizan el mismo proyecto Supabase. El catálogo utiliza la clave publicable; nunca incluir `service_role` ni secretos en el navegador.

## Tiendas
- Mujer: `937fc539-9b4f-4f8f-a0d6-676408a5359a`
- Cosméticos: `a6ebf309-4a7e-4a9a-9411-fa956e4d4349`
- Hombre: `8c109c37-c8ed-4726-b950-24a453ba999b`

## Datos y funciones
El motor compartido `js/catalogo.js` consulta tiendas, categorías, productos, variantes, colores, imágenes, `store_settings` y las tablas de pedidos usadas por checkout y seguimiento. Cada catálogo define su `storeId` en `window.CATALOG_CONFIG`.

Admin guarda la configuración en `store_settings.settings` (JSONB) por `store_id`: marca, WhatsApp, redes sociales, visibilidad de precios/stock/descripciones, colores, moneda y banner.

Los banners personalizados se guardan en `product-images/library/store-banners/<store_id>/<archivo>`. Si no hay `banner_path`, se conserva el banner estático.

## Seguridad
- La clave publicable puede estar en el frontend.
- Nunca exponer `service_role`, contraseñas o secretos.
- RLS debe limitar la lectura pública a datos que corresponda publicar.
- Las escrituras administrativas requieren autenticación y políticas de roles.
- El bucket `product-images` debe ser público para lectura de imágenes; las escrituras deben seguir protegidas.

El proyecto Supabase Staging es exclusivo para desarrollo y pruebas. El catálogo público de producción debe seguir conectado al proyecto `ftzfsxcnfcqdmwhpardt`.
