import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://ftzfsxcnfcqdmwhpardt.supabase.co",
  "sb_publishable_eRUu-PSs6VrdbtHMET1AvQ_pkZ_WHUv"
);

const STORE_LINKS = {
  "8c109c37-c8ed-4726-b950-24a453ba999b": "hombre",
  "937fc539-9b4f-4f8f-a0d6-676408a5359a": "mujer",
  "a6ebf309-4a7e-4a9a-9411-fa956e4d4349": "cosmeticos"
};

let activeStoreIds = null;
let homepageSettings = null;

const HOME_DEFAULTS = {
  template: "three",
  logo_image_path: null,
  logo_position: "center",
  logo_size: "medium",
  logo_mode: "with_name",
  logo_show_tagline: true,
  visible_store_ids: Object.keys(STORE_LINKS),
  sections: { navigation: true, hero: true, collections: true, new_arrivals: true, closing: true, footer: true },
  texts: {
    header_tagline: "ESTILO · BELLEZA · PERSONALIDAD",
    hero_eyebrow: "BIENVENIDOS A CONCEPT BY LILY",
    hero_title: "Encuentra algo que hable de ti.",
    hero_description: "Detalles que acompañan tu estilo, productos que te hacen sentir bien y pequeños favoritos que se vuelven parte de ti.",
    hero_cta: "Explorar colecciones",
    hero_note: "ESTILO PROPIO. TODOS LOS DÍAS.",
    collections_eyebrow: "ENCUENTRA TU PRÓXIMO FAVORITO",
    collections_title: "¿Qué estás buscando?",
    collections_aside: "Tres espacios, muchas formas de expresar quién eres.",
    new_eyebrow: "DESCUBRE LO NUEVO",
    new_title: "Recién llegados",
    new_aside: "Nuevos detalles para encontrar tu favorito.",
    closing_text: "Pequeños detalles. Grandes formas de expresar quién eres.",
    closing_brand: "CONCEPT BY LILY",
    footer_description: "Descubre accesorios, moda y belleza para expresar tu estilo."
  },
  cards: {}
};

async function loadHomepageSettings() {
  const { data, error } = await supabase.from("homepage_settings")
    .select("settings").eq("id", 1).maybeSingle();
  if (error) {
    console.warn("No se pudo cargar la configuración de la portada:", error.message);
    homepageSettings = null;
  } else {
    homepageSettings = data?.settings || null;
  }
  applyHomepageSettings();
}

function applyHomepageSettings() {
  const config = homepageSettings || HOME_DEFAULTS;
  const texts = { ...HOME_DEFAULTS.texts, ...(config.texts || {}) };
  const sections = { ...HOME_DEFAULTS.sections, ...(config.sections || {}) };
  const visibleIds = new Set(Array.isArray(config.visible_store_ids) ? config.visible_store_ids : HOME_DEFAULTS.visible_store_ids);

  document.querySelectorAll("[data-home-section]").forEach(section => {
    const key = section.dataset.homeSection;
    section.hidden = sections[key] === false;
  });
  const main = document.querySelector("main");
  if (main) {
    const mainSections = [...main.querySelectorAll("[data-home-section]")].filter(section =>
      ["hero", "collections", "new_arrivals", "closing"].includes(section.dataset.homeSection)
    );
    const sectionMap = new Map(mainSections.map(section => [section.dataset.homeSection, section]));
    const order = Array.isArray(config.section_order) ? config.section_order : ["hero", "collections", "new_arrivals", "closing"];
    order.forEach(key => { if (sectionMap.has(key)) main.appendChild(sectionMap.get(key)); });
    mainSections.forEach(section => { if (!order.includes(section.dataset.homeSection)) main.appendChild(section); });
  }

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value ?? "";
  };
  setText("#header-tagline", texts.header_tagline);
  const siteHeader = document.querySelector(".site-header");
  const brand = document.querySelector(".site-header .brand");
  const brandLogo = document.getElementById("brand-logo-image");
  const brandMark = document.querySelector(".site-header .brand-mark");
  const brandName = document.querySelector(".site-header .brand-name");
  const logoPath = config.logo_image_path || "";
  const logoUrl = logoPath ? imageUrl(logoPath) : "";
  const logoPosition = ["left", "center", "right"].includes(config.logo_position) ? config.logo_position : "center";
  const logoSize = ["small", "medium", "large"].includes(config.logo_size) ? config.logo_size : "medium";
  if (siteHeader) { siteHeader.dataset.logoPosition = logoPosition; siteHeader.dataset.logoSize = logoSize; }
  if (brandLogo) {
    if (logoUrl) { brandLogo.src = logoUrl; brandLogo.hidden = false; }
    else { brandLogo.removeAttribute("src"); brandLogo.hidden = true; }
  }
  const imageOnly = Boolean(logoUrl && config.logo_mode === "image_only");
  if (brandMark) brandMark.hidden = Boolean(logoUrl);
  if (brandName) brandName.hidden = imageOnly;
  if (brand) brand.classList.toggle("has-custom-logo", Boolean(logoUrl));
  const tagline = document.getElementById("header-tagline");
  if (tagline) tagline.hidden = config.logo_show_tagline === false;
  const eyebrow = document.querySelector("#hero-eyebrow");
  if (eyebrow) {
    const decorative = eyebrow.querySelector(":scope > span");
    eyebrow.textContent = texts.hero_eyebrow || "";
    if (decorative) eyebrow.prepend(decorative);
  }
  setText("#intro-title", texts.hero_title);
  setText("#hero-description", texts.hero_description);
  const cta = document.querySelector("#hero-cta");
  if (cta) {
    const arrow = cta.querySelector("span");
    cta.textContent = (texts.hero_cta || "") + " ";
    if (arrow) cta.append(arrow);
  }
  const note = document.querySelector("#hero-note");
  if (note) {
    const line = note.querySelector(".note-line");
    note.textContent = texts.hero_note || "";
    if (line) note.prepend(line);
  }
  setText("#collections-eyebrow", texts.collections_eyebrow);
  setText("#collections-title", texts.collections_title);
  setText("#collectionsAside", texts.collections_aside);
  setText("#new-eyebrow", texts.new_eyebrow);
  setText("#new-title", texts.new_title);
  setText("#new-aside", texts.new_aside);
  setText("#closing-text", texts.closing_text);
  setText("#closing-brand", texts.closing_brand);
  setText("#footer-description", texts.footer_description);

  const heroImage = document.querySelector(".intro-visual .visual-main img");
  if (heroImage) {
    const path = config.hero_image_path || "";
    const source = path ? imageUrl(path) : "";
    if (source) { heroImage.src = source; heroImage.hidden = false; }
    else { heroImage.removeAttribute("src"); heroImage.hidden = true; }
  }

  const cards = config.cards || {};
  document.querySelectorAll(".collection-card[data-store-id]").forEach(card => {
    const storeId = card.dataset.storeId;
    const slug = STORE_LINKS[storeId];
    const cardConfig = cards[slug] || {};
    card.hidden = !(visibleIds.has(storeId) && (activeStoreIds === null || activeStoreIds.has(storeId)));
    const title = card.querySelector(".card-title");
    const action = card.querySelector(".card-action");
    const number = card.querySelector(".card-number");
    if (title) title.textContent = cardConfig.title || title.textContent;
    if (action) {
      const arrow = action.querySelector("span");
      action.textContent = (cardConfig.action || "Explorar colección") + " ";
      if (arrow) action.append(arrow);
    }
    if (number && cardConfig.eyebrow) number.textContent = cardConfig.eyebrow;
    let cardImage = card.querySelector(".collection-card-image");
    if (cardConfig.image_path) {
      const url = imageUrl(cardConfig.image_path);
      if (url) {
        if (!cardImage) {
          cardImage = document.createElement("img");
          cardImage.className = "collection-card-image";
          cardImage.alt = "";
          cardImage.setAttribute("aria-hidden", "true");
          cardImage.draggable = false;
          card.prepend(cardImage);
        }
        cardImage.src = url;
        const x = Math.max(0, Math.min(100, Number(cardConfig.image_position_x ?? 50)));
        const y = Math.max(0, Math.min(100, Number(cardConfig.image_position_y ?? 50)));
        const zoom = Math.max(100, Math.min(200, Number(cardConfig.image_zoom ?? 100)));
        cardImage.style.objectPosition = x + "% " + y + "%";
        cardImage.style.transform = "scale(" + (zoom / 100) + ")";
        card.style.removeProperty("background-image");
      }
    } else {
      cardImage?.remove();
      card.style.removeProperty("background-image");
    }
  });

  const grid = document.querySelector(".collection-grid");
  if (grid) {
    const visibleCards = [...grid.querySelectorAll(".collection-card")].filter(card => !card.hidden);
    const count = visibleCards.length;
    const template = count <= 1 ? "one" : count === 2 ? "two" : "three";
    grid.dataset.template = template;
    const layoutDefaults = { one: { primary: "cosmeticos" }, two: { left: "cosmeticos", right: "mujer" }, three: { left: "cosmeticos", right_top: "mujer", right_bottom: "hombre" } };
    const layout = { ...layoutDefaults[template], ...(config.layout?.[template] || {}) };
    const slotBySlug = new Map(Object.entries(layout).map(([slot, slug]) => [slug, slot]));
    const slugById = new Map(Object.entries(STORE_LINKS).map(([id, slug]) => [id, slug]));
    const order = template === "one" ? ["primary"] : template === "two" ? ["left", "right"] : ["left", "right_top", "right_bottom"];
    visibleCards.forEach(card => { const slug = slugById.get(card.dataset.storeId); const slot = slotBySlug.get(slug) || order[0]; card.dataset.layoutPosition = slot; card.style.gridArea = slot; });
    visibleCards.sort((a,b) => order.indexOf(a.dataset.layoutPosition) - order.indexOf(b.dataset.layoutPosition)).forEach(card => grid.appendChild(card));
  }

  const backgroundPath = config.background_image_path || "";
  let layer = document.getElementById("homepageBackgroundLayer");
  if (backgroundPath) {
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "homepageBackgroundLayer";
      layer.className = "homepage-background-layer";
      layer.setAttribute("aria-hidden", "true");
      document.body.prepend(layer);
    }
    const url = imageUrl(backgroundPath);
    layer.style.backgroundImage = 'linear-gradient(rgba(255,250,252,.62),rgba(255,250,252,.62)),url("' + url.replace(/"/g, "%22") + '")';
    document.body.classList.add("homepage-has-background");
  } else {
    layer?.remove();
    document.body.classList.remove("homepage-has-background");
  }
}

async function loadStoreVisibility() {
  const { data, error } = await supabase.from("stores").select("id,is_active");
  if (error) {
    console.warn("No se pudo consultar el estado de las tiendas:", error.message);
    return null;
  }
  activeStoreIds = new Set((data || []).filter(store => store.is_active).map(store => store.id));
  applyHomepageSettings();
  const allLink = document.getElementById("allCollectionsLink");
  const preferred = ["937fc539-9b4f-4f8f-a0d6-676408a5359a","a6ebf309-4a7e-4a9a-9411-fa956e4d4349","8c109c37-c8ed-4726-b950-24a453ba999b"];
  const first = preferred.find(id => activeStoreIds.has(id));
  if (allLink) {
    allLink.hidden = !first;
    if (first) allLink.href = "acceso/index.html?tienda=" + encodeURIComponent(STORE_LINKS[first]);
  }
  return activeStoreIds;
}

const money = (amount, currency = "NIO") => {
  try {
    return new Intl.NumberFormat("es-NI", { style: "currency", currency }).format(Number(amount || 0));
  } catch {
    return `C$ ${Number(amount || 0).toFixed(2)}`;
  }
};

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

const imageUrl = path => { const value = String(path || "").trim(); const prefix = "https://ftzfsxcnfcqdmwhpardt.supabase.co/storage/v1/object/public/product-images/"; if (value.startsWith(prefix)) return value; if (!value || /^https?:/i.test(value)) return ""; return supabase.storage.from("product-images").getPublicUrl(value).data?.publicUrl || ""; };

async function loadNewArrivals() {
  const container = document.getElementById("newProducts");
  const message = document.getElementById("newProductsMessage");
  if (!container || !message) return;

  try {
    // La carga de tiendas se inicia en el bootstrap; si se demora, no bloqueamos las novedades.
    const { data: products, error } = await supabase
      .from("products")
      .select("id, store_id, category_id, name, price, currency, created_at, is_archived")
      .eq("is_active", true)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(24);

    if (error) throw error;
    const visibleHomepageIds = new Set(Array.isArray(homepageSettings?.visible_store_ids) ? homepageSettings.visible_store_ids : Object.keys(STORE_LINKS));
    const visibleProducts = (products || []).filter(product => (activeStoreIds === null || activeStoreIds.has(product.store_id)) && visibleHomepageIds.has(product.store_id));
    const productIds = visibleProducts.map(product => product.id);
    if (!productIds.length) {
      message.textContent = "Muy pronto encontrarás aquí nuestros productos disponibles.";
      return;
    }

    const [categoriesResult, imagesResult, variantsResult] = await Promise.allSettled([
      supabase.from("categories").select("id, name").eq("is_active", true),
      supabase.from("product_images").select("product_id, image_path, is_primary, sort_order, is_active").in("product_id", productIds).eq("is_active", true).order("sort_order"),
      supabase.from("product_variants").select("product_id, stock, is_active").in("product_id", productIds).eq("is_active", true)
    ]);
    const unwrap = (result, label) => {
      if (result.status === "rejected") { console.warn("No se pudieron cargar " + label + " para novedades:", result.reason); return []; }
      if (result.value.error) { console.warn("No se pudieron cargar " + label + " para novedades:", result.value.error.message); return []; }
      return result.value.data || [];
    };
    const categories = unwrap(categoriesResult, "categorías");
    const images = unwrap(imagesResult, "imágenes");
    const variants = unwrap(variantsResult, "variantes");
    const categoryMap = new Map(categories.map(category => [category.id, category.name]));
    const cards = visibleProducts.map(product => {
      const image = images.find(item => item.product_id === product.id && item.is_primary)
        || images.find(item => item.product_id === product.id);
      const available = variants.some(variant => variant.product_id === product.id && Number(variant.stock) > 0);
      const storeSlug = STORE_LINKS[product.store_id];
      if (!storeSlug) return "";
      const href = `acceso/index.html?tienda=${encodeURIComponent(storeSlug)}`;
      const picture = image?.image_path
        ? `<img src="${escapeHtml(imageUrl(image.image_path))}" alt="${escapeHtml(product.name)}" loading="lazy">`
        : `<div class="new-product-placeholder">Concept by Lily</div>`;

      return `<article class="new-product-card">
        <a class="new-product-link" href="${href}">
          <div class="new-product-image">${picture}<span class="new-product-tag">${available ? "NUEVO" : "AGOTADO"}</span></div>
          <div class="new-product-info">
            <p class="new-product-category">${escapeHtml(categoryMap.get(product.category_id) || "Colección")}</p>
            <h3 class="new-product-name">${escapeHtml(product.name)}</h3>
            <p class="new-product-price">${money(product.price, product.currency)}</p>
          </div>
        </a>
      </article>`;
    }).filter(Boolean);

    if (!cards.length) {
      message.textContent = "Muy pronto encontrarás aquí nuestros productos disponibles.";
      return;
    }

    container.innerHTML = cards.slice(0, 4).join("");
    message.textContent = "Una selección de las últimas incorporaciones a nuestras colecciones.";
  } catch (error) {
    console.error("No se pudieron cargar las novedades:", error);
    message.textContent = "Estamos preparando nuevas sorpresas para ti.";
  }
}

const withHomepageTimeout = (promise, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error("Tiempo de espera agotado al cargar " + label)), 10000))
]);
Promise.allSettled([
  withHomepageTimeout(loadHomepageSettings(), "la configuración de portada"),
  withHomepageTimeout(loadStoreVisibility(), "las tiendas")
]).then(() => {
  applyHomepageSettings();
  return loadNewArrivals();
}).catch(error => {
  console.error("No se pudo iniciar la portada:", error);
  loadNewArrivals();
});
