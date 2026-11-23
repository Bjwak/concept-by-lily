# Integración de banner personalizado

Admin guarda la ruta del banner en `store_settings.settings.banner_path` (JSONB), por `store_id`.

- Bucket: `product-images`
- Ruta: `library/store-banners/<store_id>/<archivo>`
- El catálogo carga `store_settings` y aplica el banner con `getPublicUrl()`.
- Si no hay `banner_path`, conserva el banner estático.

No se necesita otra columna: `store_settings.settings` ya es JSONB. La política `concept_library_upload_staff` permite al personal autorizado cargar archivos dentro de `library`.

El catálogo público está en `Bjwak/concept-by-lily`, rama `main`.
