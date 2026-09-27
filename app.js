const DEFAULT_PRODUCTS = [
  {
    id: "p1", title: "Samsung Galaxy A54 5G", price: 185000, category: "Telemóveis", location: "Bissau", condition: "Usado", age: "Hoje", emoji: "📱", color: "linear-gradient(145deg,#dbe9e5,#9fbeb5)", seller: "Mamadú Djaló", sellerSince: "Vendedor há 2 anos", views: 128,
    description: "Telemóvel em muito bom estado, com 128 GB de memória. Inclui capa, carregador e caixa original. A bateria dura o dia inteiro. Entrega em Bissau a combinar."
  },
  {
    id: "p2", title: "Mota Haojue 125cc", price: 650000, category: "Veículos", location: "Bafatá", condition: "Usado", age: "Ontem", emoji: "🏍️", color: "linear-gradient(145deg,#f5ddc7,#d69b66)", seller: "Braima Sanhá", sellerSince: "Vendedor há 8 meses", views: 204,
    description: "Mota económica e pronta a circular. Revisão feita recentemente, documentos em dia e pneus em bom estado. Pode ser vista no centro de Bafatá."
  },
  {
    id: "p3", title: "Tecido africano — 6 jardas", price: 18000, category: "Moda", location: "Bissau", condition: "Novo", age: "Hoje", emoji: "🧵", color: "linear-gradient(145deg,#fae1bd,#e5a24a)", seller: "Fatumata Indjai", sellerSince: "Vendedora verificada", views: 87,
    description: "Tecido africano de qualidade, cores vivas e resistentes. Cada conjunto tem 6 jardas. Disponível em vários padrões. Entrega em Bissau."
  },
  {
    id: "p4", title: "Ventoinha recarregável", price: 35000, category: "Casa", location: "Safim", condition: "Novo", age: "Há 2 dias", emoji: "🌀", color: "linear-gradient(145deg,#d9efef,#8cc5c4)", seller: "Loja Nô Kumpra", sellerSince: "Loja verificada", views: 61,
    description: "Ventoinha silenciosa com bateria recarregável e três velocidades. Autonomia aproximada de 6 horas. Cabo incluído."
  },
  {
    id: "p5", title: "Portátil HP EliteBook", price: 220000, category: "Eletrónica", location: "Bissau", condition: "Usado", age: "Há 3 dias", emoji: "💻", color: "linear-gradient(145deg,#dce1e8,#96a3b3)", seller: "Carlos Gomes", sellerSince: "Vendedor há 1 ano", views: 173,
    description: "Computador HP EliteBook com Intel Core i5, 8 GB RAM e SSD de 256 GB. Ideal para estudar ou trabalhar. Windows instalado."
  },
  {
    id: "p6", title: "Caju natural — saco 25 kg", price: 27500, category: "Alimentação", location: "Cacheu", condition: "Novo", age: "Esta semana", emoji: "🥜", color: "linear-gradient(145deg,#ece2be,#bca45d)", seller: "Cooperativa Cacheu", sellerSince: "Produtor verificado", views: 95,
    description: "Castanha de caju natural da campanha atual, selecionada e ensacada. Venda por saco de 25 kg. Quantidades maiores sob consulta."
  },
  {
    id: "p7", title: "Sofá de 3 lugares", price: 95000, category: "Casa", location: "Gabú", condition: "Usado", age: "Esta semana", emoji: "🛋️", color: "linear-gradient(145deg,#e7d7ce,#be8b70)", seller: "Saliu Baldé", sellerSince: "Vendedor há 4 meses", views: 48,
    description: "Sofá confortável de três lugares, sem rasgos. Motivo da venda: mudança. Transporte a cargo do comprador."
  },
  {
    id: "p8", title: "Sapatilhas desportivas", price: 24000, category: "Moda", location: "Bissau", condition: "Novo", age: "Há 4 dias", emoji: "👟", color: "linear-gradient(145deg,#e4def2,#afa0d7)", seller: "Boutique Djarama", sellerSince: "Loja verificada", views: 110,
    description: "Sapatilhas leves e confortáveis, disponíveis nos tamanhos 39 a 44. Confirma o tamanho antes de reservar."
  }
];

const CATEGORIES = [
  { name: "Telemóveis", icon: "📱" },
  { name: "Eletrónica", icon: "💻" },
  { name: "Veículos", icon: "🏍️" },
  { name: "Moda", icon: "👕" },
  { name: "Casa", icon: "🪑" },
  { name: "Alimentação", icon: "🥭" }
];
const LOCATIONS = ["Bissau", "Bafatá", "Gabú", "Cacheu", "Safim", "Bissorã"];

const app = document.querySelector("#app");
const state = {
  products: load("mercadogb_products", DEFAULT_PRODUCTS),
  favorites: load("mercadogb_favorites", ["p3", "p5"]),
  filters: { q: "", category: "", location: "", min: "", max: "", condition: [], sort: "recent" },
  createStep: 1,
  draft: {},
  draftImage: ""
};

function load(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function icon(name) { return `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`; }
function money(value) { return `${Number(value).toLocaleString("pt-PT")} FCFA`; }
function esc(value = "") { return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function params() { return new URLSearchParams(location.hash.split("?")[1] || ""); }

function showToast(message, kind = "") {
  const toast = document.createElement("div");
  toast.className = `toast ${kind}`;
  toast.textContent = message;
  document.querySelector("#toast-region").append(toast);
  setTimeout(() => toast.remove(), 2600);
}

function productCard(product) {
  const node = document.querySelector("#product-card-template").content.cloneNode(true);
  const href = `#/anuncio/${product.id}`;
  node.querySelector(".product-media").href = href;
  node.querySelector(".product-title").href = href;
  const visual = node.querySelector(".product-visual");
  visual.style.background = product.image ? "#e6eee9" : product.color;
  visual.innerHTML = product.image ? `<img src="${product.image}" alt="" style="width:100%;height:100%;object-fit:cover">` : product.emoji;
  node.querySelector(".condition-pill").textContent = product.condition;
  node.querySelector(".product-price").textContent = money(product.price);
  node.querySelector(".product-title").textContent = product.title;
  node.querySelector(".product-location").textContent = product.location;
  node.querySelector(".product-time").textContent = product.age;
  const fav = node.querySelector(".favorite-btn");
  fav.dataset.id = product.id;
  fav.classList.toggle("active", state.favorites.includes(product.id));
  fav.setAttribute("aria-label", state.favorites.includes(product.id) ? "Remover dos guardados" : "Guardar anúncio");
  return node;
}

function productGrid(products, emptyMessage = "Nenhum anúncio encontrado") {
  const grid = document.createElement("div");
  grid.className = "product-grid";
  if (!products.length) {
    grid.innerHTML = `<div class="empty-state"><span class="empty-icon">${icon("search")}</span><h3>${emptyMessage}</h3><p>Experimenta alterar a pesquisa ou os filtros.</p><a class="btn btn-primary" href="#/explorar">Ver todos os anúncios</a></div>`;
    return grid;
  }
  products.forEach(product => grid.append(productCard(product)));
  return grid;
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="shell hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Compra e vende na Guiné-Bissau</p>
          <h1>O que procuras está <span>mais perto</span> do que pensas.</h1>
          <p>Encontra produtos, fala diretamente com vendedores e combina a entrega de forma simples.</p>
          <form class="hero-search" id="hero-search">
            <label class="search-field">${icon("search")}<input name="q" type="search" placeholder="Ex.: telemóvel, mota, tecido…" aria-label="Pesquisar produtos"></label>
            <button class="btn btn-primary" type="submit">Pesquisar</button>
          </form>
          <div class="hero-trust"><span>${icon("check")} Anúncios locais</span><span>${icon("message")} Contacto direto</span><span>${icon("shield")} Dicas de segurança</span></div>
        </div>
        <div class="hero-showcase" aria-hidden="true">
          <div class="showcase-main"></div>
          <div class="floating-card floating-price"><small>Em destaque</small><strong>185.000 FCFA</strong></div>
          <div class="floating-card floating-seller"><span class="seller-avatar">MD</span><div><strong>Mamadú</strong><small>✓ Vendedor verificado</small></div></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-head"><div><p class="eyebrow">Explora por categoria</p><h2>Encontra mais depressa</h2></div></div>
        <div class="category-grid">
          ${CATEGORIES.map(cat => `<a class="category-card" href="#/explorar?category=${encodeURIComponent(cat.name)}"><span class="category-icon">${cat.icon}</span><span>${cat.name}</span><small>${state.products.filter(p => p.category === cat.name).length} anúncios</small></a>`).join("")}
        </div>
      </div>
    </section>
    <section class="section section-soft">
      <div class="shell">
        <div class="section-head"><div><p class="eyebrow">Novidades</p><h2>Anúncios recentes</h2><p>Produtos publicados perto de ti.</p></div><a class="text-link" href="#/explorar">Ver todos ${icon("arrow")}</a></div>
        <div id="home-products"></div>
        <div class="sell-strip"><div><h3>Tens algo que já não usas?</h3><p>Cria um anúncio gratuito em poucos passos.</p></div><a class="btn btn-secondary" href="#/criar">${icon("plus")} Publicar anúncio</a></div>
      </div>
    </section>`;
  document.querySelector("#home-products").append(productGrid(state.products.slice(0, 8)));
  document.querySelector("#hero-search").addEventListener("submit", event => {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q");
    location.hash = `#/explorar?q=${encodeURIComponent(q)}`;
  });
}

function renderExplore() {
  const urlParams = params();
  state.filters.q = urlParams.get("q") || "";
  state.filters.category = urlParams.get("category") || "";
  app.innerHTML = `
    <section class="page-hero"><div class="shell"><p class="eyebrow">Marketplace local</p><h1>Explorar anúncios</h1><p>Pesquisa, compara e fala diretamente com o vendedor.</p></div></section>
    <div class="shell search-layout">
      <aside class="filters" id="filters">
        <div class="filter-head"><h2>Filtros</h2><button class="clear-btn" id="clear-filters">Limpar</button></div>
        <div class="field"><label for="category-filter">Categoria</label><select id="category-filter"><option value="">Todas as categorias</option>${CATEGORIES.map(c => `<option value="${c.name}" ${c.name === state.filters.category ? "selected" : ""}>${c.name}</option>`).join("")}</select></div>
        <div class="field"><label for="location-filter">Localização</label><select id="location-filter"><option value="">Toda a Guiné-Bissau</option>${LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join("")}</select></div>
        <div class="field"><span>Preço (FCFA)</span><div class="price-row"><input id="min-filter" type="number" inputmode="numeric" placeholder="Mínimo"><input id="max-filter" type="number" inputmode="numeric" placeholder="Máximo"></div></div>
        <div class="field"><span>Estado</span><div class="check-list"><label class="check-row"><input type="checkbox" name="condition" value="Novo"> Novo</label><label class="check-row"><input type="checkbox" name="condition" value="Usado"> Usado</label></div></div>
      </aside>
      <section>
        <form class="inline-search" id="explore-search"><label class="search-field">${icon("search")}<input id="q-filter" type="search" value="${esc(state.filters.q)}" placeholder="O que procuras?" aria-label="Pesquisar produtos"></label><button class="btn btn-primary">Pesquisar</button></form>
        <div class="results-toolbar"><div><strong id="result-count"></strong><button class="btn btn-outline mobile-filter-btn" id="mobile-filter" type="button">${icon("filter")} Filtros</button></div><select id="sort-filter" aria-label="Ordenar anúncios"><option value="recent">Mais recentes</option><option value="low">Preço mais baixo</option><option value="high">Preço mais alto</option></select></div>
        <div id="results-grid"></div>
      </section>
    </div>`;
  const ids = ["q-filter", "category-filter", "location-filter", "min-filter", "max-filter", "sort-filter"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    const key = id.replace("-filter", "").replace("q", "q");
    if (state.filters[key] !== undefined && id !== "q-filter" && id !== "category-filter") el.value = state.filters[key];
    el.addEventListener(id === "q-filter" ? "input" : "change", updateResults);
  });
  document.querySelectorAll('input[name="condition"]').forEach(el => el.addEventListener("change", updateResults));
  document.querySelector("#explore-search").addEventListener("submit", e => { e.preventDefault(); updateResults(); });
  document.querySelector("#clear-filters").addEventListener("click", clearFilters);
  document.querySelector("#mobile-filter").addEventListener("click", () => document.querySelector("#filters").classList.toggle("open"));
  updateResults();
}

function updateResults() {
  const get = id => document.getElementById(id)?.value || "";
  state.filters = {
    q: get("q-filter"), category: get("category-filter"), location: get("location-filter"),
    min: get("min-filter"), max: get("max-filter"), sort: get("sort-filter") || "recent",
    condition: [...document.querySelectorAll('input[name="condition"]:checked')].map(i => i.value)
  };
  const q = state.filters.q.toLowerCase().trim();
  let products = state.products.filter(p => {
    const haystack = `${p.title} ${p.category} ${p.location}`.toLowerCase();
    return (!q || haystack.includes(q)) &&
      (!state.filters.category || p.category === state.filters.category) &&
      (!state.filters.location || p.location === state.filters.location) &&
      (!state.filters.min || p.price >= Number(state.filters.min)) &&
      (!state.filters.max || p.price <= Number(state.filters.max)) &&
      (!state.filters.condition.length || state.filters.condition.includes(p.condition));
  });
  if (state.filters.sort === "low") products.sort((a,b) => a.price - b.price);
  if (state.filters.sort === "high") products.sort((a,b) => b.price - a.price);
  document.querySelector("#result-count").textContent = `${products.length} ${products.length === 1 ? "anúncio" : "anúncios"}`;
  const target = document.querySelector("#results-grid");
  target.innerHTML = "";
  target.append(productGrid(products));
}

function clearFilters() {
  ["q-filter","category-filter","location-filter","min-filter","max-filter"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("sort-filter").value = "recent";
  document.querySelectorAll('input[name="condition"]').forEach(el => el.checked = false);
  updateResults();
}

function renderListing(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return renderNotFound();
  app.innerHTML = `
    <section class="listing-page"><div class="shell">
      <a class="back-link" href="#/explorar">${icon("back")} Voltar aos anúncios</a>
      <div class="listing-layout">
        <div class="listing-gallery" style="background:${product.image ? "#e6eee9" : product.color}">${product.image ? `<img src="${product.image}" alt="${esc(product.title)}" style="width:100%;height:100%;object-fit:cover">` : product.emoji}</div>
        <aside class="listing-panel">
          <span class="condition-pill">${product.condition}</span><h1>${esc(product.title)}</h1><p class="listing-price">${money(product.price)}</p>
          <div class="listing-details"><span class="detail-chip">${icon("map")} ${product.location}</span><span class="detail-chip">${icon("clock")} ${product.age}</span><span class="detail-chip">${icon("eye")} ${product.views || 0} visualizações</span><span class="detail-chip">${icon("grid")} ${product.category}</span></div>
          <div class="seller-box"><span class="seller-avatar">${product.seller.split(" ").map(n=>n[0]).slice(0,2).join("")}</span><div><strong>${esc(product.seller)}</strong><small>${esc(product.sellerSince)}</small></div><span class="verified">✓ Verificado</span></div>
          <div class="contact-stack"><button class="btn btn-whatsapp contact-seller" data-id="${product.id}">${icon("message")} Contactar no WhatsApp</button><button class="btn btn-outline save-listing" data-id="${product.id}">${icon("heart")} <span>${state.favorites.includes(product.id) ? "Guardado" : "Guardar anúncio"}</span></button></div>
          <div class="safety-note">${icon("shield")} <span>Combina a entrega num local seguro e verifica o produto antes de pagar.</span></div>
        </aside>
        <div class="description-card"><h2>Descrição do anúncio</h2><p>${esc(product.description)}</p></div>
      </div>
    </div></section>`;
  document.querySelector(".contact-seller").addEventListener("click", () => openContact(product));
  document.querySelector(".save-listing").addEventListener("click", event => {
    toggleFavorite(product.id);
    const active = state.favorites.includes(product.id);
    event.currentTarget.querySelector("span").textContent = active ? "Guardado" : "Guardar anúncio";
  });
}

function renderCreate() {
  state.createStep = 1;
  state.draft = {};
  state.draftImage = "";
  app.innerHTML = `
    <section class="flow-page"><div class="narrow-shell">
      <div class="flow-head"><p class="eyebrow">Vende de forma simples</p><h1>Criar um anúncio</h1><p>Preenche os dados essenciais. Podes alterar tudo mais tarde.</p></div>
      <div class="steps" aria-label="Progresso"><div class="step-dot active" data-step-dot="1"><span>1</span> Produto</div><div class="step-line"></div><div class="step-dot" data-step-dot="2"><span>2</span> Detalhes</div><div class="step-line"></div><div class="step-dot" data-step-dot="3"><span>3</span> Confirmar</div></div>
      <form class="form-card" id="listing-form" novalidate>
        <section class="form-step active" data-step="1"><h2>O que estás a vender?</h2><p class="form-intro">Uma boa informação ajuda o comprador a decidir.</p>
          <div class="form-grid"><div class="field span-2"><label for="new-title">Título do anúncio *</label><input id="new-title" name="title" maxlength="60" placeholder="Ex.: Samsung Galaxy A54" required></div>
          <div class="field"><label for="new-category">Categoria *</label><select id="new-category" name="category" required><option value="">Escolher categoria</option>${CATEGORIES.map(c=>`<option>${c.name}</option>`).join("")}</select></div>
          <div class="field"><label for="new-condition">Estado *</label><select id="new-condition" name="condition" required><option value="">Escolher estado</option><option>Novo</option><option>Usado</option></select></div>
          <div class="field span-2"><label>Fotografia do produto</label><label class="upload-zone" id="upload-zone">${icon("upload")}<div><strong>Escolher uma fotografia</strong><small>JPG ou PNG — opcional neste protótipo</small></div><input id="new-image" type="file" accept="image/png,image/jpeg"></label></div></div>
          <p class="error-text" id="step-1-error"></p><div class="form-actions"><a class="btn btn-ghost" href="#/">Cancelar</a><button class="btn btn-primary push" type="button" data-next="2">Continuar ${icon("arrow")}</button></div>
        </section>
        <section class="form-step" data-step="2"><h2>Preço e contacto</h2><p class="form-intro">Indica onde estás e como queres ser contactado.</p>
          <div class="form-grid"><div class="field"><label for="new-price">Preço (FCFA) *</label><input id="new-price" name="price" type="number" inputmode="numeric" min="1" placeholder="Ex.: 25000" required></div>
          <div class="field"><label for="new-location">Localização *</label><select id="new-location" name="location" required><option value="">Escolher região</option>${LOCATIONS.map(l=>`<option>${l}</option>`).join("")}</select></div>
          <div class="field span-2"><label for="new-description">Descrição *</label><textarea id="new-description" name="description" maxlength="500" placeholder="Descreve o estado, o que está incluído e como pode ser entregue…" required></textarea></div>
          <div class="field span-2"><label for="new-phone">WhatsApp *</label><input id="new-phone" name="phone" type="tel" value="+245 " placeholder="+245 955 000 000" required></div></div>
          <p class="error-text" id="step-2-error"></p><div class="form-actions"><button class="btn btn-ghost" type="button" data-back="1">${icon("back")} Voltar</button><button class="btn btn-primary" type="button" data-next="3">Rever anúncio ${icon("arrow")}</button></div>
        </section>
        <section class="form-step" data-step="3"><h2>Confirma o anúncio</h2><p class="form-intro">Revê os dados antes de publicar.</p><div id="review"></div>
          <label class="check-row"><input id="safety-check" type="checkbox"> Confirmo que as informações são verdadeiras e aceito as regras de segurança.</label><p class="error-text" id="step-3-error"></p>
          <div class="form-actions"><button class="btn btn-ghost" type="button" data-back="2">${icon("back")} Corrigir</button><button class="btn btn-primary" type="submit">${icon("check")} Publicar anúncio</button></div>
        </section>
      </form>
    </div></section>`;
  document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => goCreateStep(Number(btn.dataset.next))));
  document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => showCreateStep(Number(btn.dataset.back))));
  document.querySelector("#new-image").addEventListener("change", previewImage);
  document.querySelector("#listing-form").addEventListener("submit", publishListing);
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 3_000_000) { showToast("Escolhe uma imagem com menos de 3 MB"); event.target.value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => {
    state.draftImage = reader.result;
    const old = document.querySelector(".upload-preview");
    if (old) old.remove();
    document.querySelector("#upload-zone").insertAdjacentHTML("beforeend", `<img class="upload-preview" src="${reader.result}" alt="Pré-visualização">`);
  };
  reader.readAsDataURL(file);
}

function goCreateStep(next) {
  const form = document.querySelector("#listing-form");
  const fields = next === 2 ? ["title","category","condition"] : ["price","location","description","phone"];
  const invalid = fields.some(name => !form.elements[name].value.trim());
  if (invalid) {
    document.querySelector(`#step-${next-1}-error`).textContent = "Preenche todos os campos obrigatórios para continuar.";
    fields.map(name=>form.elements[name]).find(el=>!el.value.trim())?.focus();
    return;
  }
  if (next === 3 && Number(form.elements.price.value) <= 0) {
    document.querySelector("#step-2-error").textContent = "Indica um preço válido.";
    return;
  }
  document.querySelector(`#step-${next-1}-error`).textContent = "";
  state.draft = Object.fromEntries(new FormData(form).entries());
  if (next === 3) renderReview();
  showCreateStep(next);
}

function showCreateStep(step) {
  state.createStep = step;
  document.querySelectorAll(".form-step").forEach(el => el.classList.toggle("active", Number(el.dataset.step) === step));
  document.querySelectorAll(".step-dot").forEach(el => el.classList.toggle("active", Number(el.dataset.stepDot) <= step));
  window.scrollTo({top:0, behavior:"smooth"});
}

function renderReview() {
  const d = state.draft;
  document.querySelector("#review").innerHTML = `<div class="review-listing"><div class="review-visual">${state.draftImage ? `<img src="${state.draftImage}" alt="">` : CATEGORIES.find(c=>c.name===d.category)?.icon || "📦"}</div><div class="review-data"><span class="condition-pill">${esc(d.condition)}</span><h3>${esc(d.title)}</h3><p class="listing-price">${money(d.price)}</p><p>${esc(d.location)} · Contacto por WhatsApp</p><p>${esc(d.description)}</p></div></div>`;
}

function publishListing(event) {
  event.preventDefault();
  if (!document.querySelector("#safety-check").checked) { document.querySelector("#step-3-error").textContent = "Confirma as informações antes de publicar."; return; }
  const d = state.draft;
  const product = {
    id: `user-${Date.now()}`, title:d.title.trim(), price:Number(d.price), category:d.category, location:d.location,
    condition:d.condition, age:"Agora", emoji:CATEGORIES.find(c=>c.name===d.category)?.icon || "📦", color:"linear-gradient(145deg,#e2eee7,#b7d4c6)", image:state.draftImage,
    seller:"Charles Junior", sellerSince:"Novo vendedor", views:0, description:d.description.trim(), phone:d.phone
  };
  state.products.unshift(product);
  save("mercadogb_products", state.products);
  document.querySelector("#view-new-listing").href = `#/anuncio/${product.id}`;
  document.querySelector("#success-dialog").showModal();
}

function renderBuyer() {
  const favorites = state.products.filter(p => state.favorites.includes(p.id));
  app.innerHTML = `<section class="dashboard-page"><div class="shell">
    <div class="dashboard-head"><div><p class="eyebrow">Área do comprador</p><h1>Olá, Charles 👋</h1><p>Guarda anúncios e volta a eles quando quiseres.</p></div><a class="btn btn-primary" href="#/explorar">${icon("search")} Encontrar produtos</a></div>
    <div class="buyer-tabs"><button class="tab-btn active">Guardados (${favorites.length})</button><button class="tab-btn" id="recent-tab">Vistos recentemente</button></div>
    <div id="buyer-products"></div>
  </div></section>`;
  document.querySelector("#buyer-products").append(productGrid(favorites, "Ainda não guardaste anúncios"));
  document.querySelector("#recent-tab").addEventListener("click", () => showToast("O histórico começa a aparecer quando visitas anúncios."));
}

function renderSeller() {
  const own = state.products.filter(p => p.id.startsWith("user-") || ["p3","p8"].includes(p.id));
  app.innerHTML = `<section class="dashboard-page"><div class="shell">
    <div class="dashboard-head"><div><p class="eyebrow">Área do vendedor</p><h1>O teu negócio num só lugar</h1><p>Acompanha os anúncios e os contactos recebidos.</p></div><a class="btn btn-primary" href="#/criar">${icon("plus")} Novo anúncio</a></div>
    <div class="stat-grid"><div class="stat-card"><span>Anúncios ativos</span><strong>${own.length}</strong></div><div class="stat-card"><span>Visualizações</span><strong>${own.reduce((s,p)=>s+(p.views||0),0)}</strong></div><div class="stat-card"><span>Contactos esta semana</span><strong>${Math.max(2, own.length + 1)}</strong></div></div>
    <div class="dash-grid"><div class="dash-card"><div class="dash-card-head"><h2>Os meus anúncios</h2><a class="text-link" href="#/criar">Adicionar ${icon("plus")}</a></div><div class="seller-list">${own.map(p=>`<a class="seller-listing" href="#/anuncio/${p.id}"><span class="seller-listing-visual" style="background:${p.image ? "#e6eee9" : p.color}">${p.image ? `<img src="${p.image}" alt="">` : p.emoji}</span><div><h3>${esc(p.title)}</h3><p>${money(p.price)}</p></div><span class="listing-status">Ativo</span></a>`).join("")}</div></div>
      <aside class="dash-card"><div class="profile-card"><span class="profile-avatar">CJ</span><div><h3>Charles Junior</h3><p>Conta de vendedor · Bissau</p></div></div><hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><div class="dash-card-head"><h2>Atividade</h2></div><div class="activity-list"><div class="activity"><span class="activity-icon">${icon("eye")}</span><p>O anúncio “Tecido africano” recebeu novas visitas.<br><small>Hoje, 09:30</small></p></div><div class="activity"><span class="activity-icon">${icon("message")}</span><p>Um comprador pediu informações.<br><small>Ontem, 18:42</small></p></div><div class="activity"><span class="activity-icon">${icon("check")}</span><p>O teu perfil está pronto para vender.<br><small>Esta semana</small></p></div></div></aside>
    </div></div></section>`;
}

function renderNotFound() {
  app.innerHTML = `<section class="section"><div class="narrow-shell"><div class="empty-state"><span class="empty-icon">${icon("search")}</span><h3>Página não encontrada</h3><p>O conteúdo que procuras pode ter sido removido.</p><a class="btn btn-primary" href="#/">Voltar ao início</a></div></div></section>`;
}

function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index >= 0) { state.favorites.splice(index,1); showToast("Removido dos guardados"); }
  else { state.favorites.push(id); showToast("Anúncio guardado", "success"); }
  save("mercadogb_favorites", state.favorites);
  document.querySelectorAll(`.favorite-btn[data-id="${id}"]`).forEach(btn => btn.classList.toggle("active", state.favorites.includes(id)));
}

function openContact(product) {
  document.querySelector("#contact-title").textContent = `Falar com ${product.seller.split(" ")[0]}`;
  document.querySelector("#message-preview").textContent = `Olá! Vi o anúncio “${product.title}” no Mercado GB. Ainda está disponível?`;
  document.querySelector("#contact-dialog").showModal();
}

function route() {
  document.querySelector("#mobile-menu").classList.remove("open");
  const path = location.hash.replace(/^#/, "").split("?")[0] || "/";
  if (path === "/") renderHome();
  else if (path === "/explorar") renderExplore();
  else if (path === "/criar") renderCreate();
  else if (path === "/comprador") renderBuyer();
  else if (path === "/vendedor") renderSeller();
  else if (path.startsWith("/anuncio/")) renderListing(path.split("/").pop());
  else renderNotFound();
  updateNavigation(path);
  window.scrollTo(0, 0);
  setTimeout(() => app.focus({preventScroll:true}), 0);
}

function updateNavigation(path) {
  document.querySelectorAll("[data-nav]").forEach(link => link.classList.remove("active"));
  let key = path === "/" ? "home" : path.split("/")[1];
  document.querySelector(`[data-nav="${key}"]`)?.classList.add("active");
  document.querySelectorAll(".desktop-nav a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${path}`));
}

document.addEventListener("click", event => {
  const fav = event.target.closest(".favorite-btn");
  if (fav) { event.preventDefault(); toggleFavorite(fav.dataset.id); }
});
document.querySelector("#mobile-menu-btn").addEventListener("click", () => document.querySelector("#mobile-menu").classList.toggle("open"));
document.querySelectorAll("[data-close-dialog]").forEach(btn => btn.addEventListener("click", () => document.querySelector("#contact-dialog").close()));
document.querySelector("#simulate-whatsapp").addEventListener("click", () => { document.querySelector("#contact-dialog").close(); showToast("Demonstração concluída — o WhatsApp abriria agora.", "success"); });
document.querySelectorAll("[data-close-success]").forEach(el => el.addEventListener("click", () => document.querySelector("#success-dialog").close()));
document.querySelector("#view-new-listing").addEventListener("click", () => document.querySelector("#success-dialog").close());
window.addEventListener("hashchange", route);
route();
