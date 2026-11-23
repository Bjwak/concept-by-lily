# Concept by Lily

Catálogos públicos conectados al proyecto Supabase de producción.

- **Admin:** `Bjwak/concept-by-lily-admin` (`main`).
- **Catálogos:** este repositorio (`main`).
- **Supabase producción:** `ftzfsxcnfcqdmwhpardt`.

Los tres catálogos comparten `js/catalogo.js`:
- Mujer: `937fc539-9b4f-4f8f-a0d6-676408a5359a`
- Cosméticos: `a6ebf309-4a7e-4a9a-9411-fa956e4d4349`
- Hombre: `8c109c37-c8ed-4726-b950-24a453ba999b`

Admin y catálogo leen/escriben en el mismo proyecto. El catálogo carga productos, categorías, variantes, imágenes, ajustes por tienda, pedidos y seguimiento. La configuración de marca, contacto, colores, moneda y banner se administra desde Admin mediante `store_settings`.

Nunca exponer claves `service_role` ni secretos en el frontend. La clave pública `sb_publishable_...` es la utilizada por el catálogo. El bucket `product-images` debe permitir lectura pública y las escrituras deben permanecer protegidas por RLS.

Desarrollo local: `npx.cmd --yes http-server -p 5500`. No abrir con `file://`.

URL pública esperada: `https://bjwak.github.io/concept-by-lily/`.

Los recursos gráficos estáticos que todavía no se han trasladado se sirven temporalmente desde los archivos históricos de Beta. El código y la publicación del catálogo ya viven en este repositorio; esos recursos podrán copiarse a Supabase Storage posteriormente.
