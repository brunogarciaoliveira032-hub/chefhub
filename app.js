const data = {
  categories: [
    { name: "Fogões e Fornos", key: "Cocção", image: "assets/product-range.png" },
    { name: "Refrigeradores e Freezers", key: "Refrigeração", image: "assets/product-fridge.png" },
    { name: "Utensílios de Cozinha", key: "Utensílios", image: "assets/product-utensils.png" },
    { name: "Chapas e Fritadeiras", key: "Cocção", image: "assets/product-griddle.png" },
    { name: "Balcões e Estufas", key: "Exposição", image: "assets/product-display.png" },
    { name: "Pequenos Equipamentos", key: "Preparo", image: "assets/product-mixer.png" }
  ],
  products: [
    { id: 1, name: "Fogão Industrial 6 Bocas com Forno", store: "GastroBR", category: "Cocção", price: 4890, rating: "4,8", reviews: 32, image: "assets/product-range.png" },
    { id: 2, name: "Forno Combinado 10 GN Digital", store: "EquipMais", category: "Cocção", price: 12990, rating: "4,9", reviews: 18, image: "assets/product-display.png" },
    { id: 3, name: "Fogão Industrial 4 Bocas Aço Inox", store: "ChefPro", category: "Cocção", price: 2690, rating: "4,7", reviews: 12, image: "assets/product-griddle.png" },
    { id: 4, name: "Refrigerador Comercial Inox 2 Portas", store: "GastroBR", category: "Refrigeração", price: 6790, rating: "4,8", reviews: 21, image: "assets/product-fridge.png" },
    { id: 5, name: "Kit de Utensílios Profissionais", store: "ChefPro", category: "Utensílios", price: 459.9, rating: "4,9", reviews: 43, image: "assets/product-utensils.png" },
    { id: 6, name: "Batedeira Planetária Profissional", store: "MegaCozinha", category: "Preparo", price: 2890, rating: "4,7", reviews: 15, image: "assets/product-mixer.png" },
    { id: 7, name: "Balcão Térmico para Buffet", store: "MegaCozinha", category: "Exposição", price: 3190, rating: "4,8", reviews: 9, image: "assets/product-display.png" }
  ],
  partners: ["GastroBR", "ChefPro", "MegaCozinha"]
};

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const state = {
  screen: "welcome",
  category: "Cocção",
  selectedProduct: 1,
  quantity: 1,
  cart: JSON.parse(localStorage.getItem("chefhub-mobile-cart") || "[]"),
  deferredInstall: null
};

function brand() {
  return `<div class="mobile-brand"><span class="hat"><svg viewBox="0 0 68 62"><path d="M16 39a14 14 0 1 1 14.4-19.6A14.4 14.4 0 0 1 53 30.8c0 7.7-6.2 14-14 14H22v9l-7 4z"/><path d="M12 59c12-10 24-13 39-12"/></svg></span><b>Chef<span>Hub</span></b></div>`;
}

function nav(active) {
  const items = [["home", "⌂", "Início"], ["categories", "☷", "Categorias"], ["orders", "▤", "Pedidos"], ["favorites", "♡", "Favoritos"], ["profile", "♙", "Perfil"]];
  return `<nav class="tab-bar" aria-label="Navegação do aplicativo">${items.map(([screen, icon, label]) => `<button class="tab-item ${active === screen ? "active" : ""}" data-screen="${screen}"><span class="tab-icon">${icon}</span><span>${label}</span></button>`).join("")}</nav>`;
}

function topBar(title, actions = "") {
  return `<div class="topline"><button class="back-button" data-back aria-label="Voltar">‹</button><h1 class="screen-title">${title}</h1><div class="top-actions">${actions || "<span class='more-button'></span>"}</div></div>`;
}

function productFor(id) { return data.products.find(product => product.id === Number(id)); }
function cartTotal() { return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }
function cartCount() { return state.cart.reduce((sum, item) => sum + item.quantity, 0); }
function persistCart() { localStorage.setItem("chefhub-mobile-cart", JSON.stringify(state.cart)); }

function homeScreen() {
  return `<section class="mobile-page home-page"><div class="topline">${brand()}<div class="top-actions"><button class="top-icon" data-screen="cart" aria-label="Carrinho"><svg viewBox="0 0 24 24"><path d="M3 4h2l1.4 10.3h11.2L20 7H7"/><circle cx="9" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/></svg></button></div></div><p class="location">São Paulo, SP</p><form class="home-search" id="homeSearch"><span>⌕</span><input id="homeSearchInput" placeholder="O que você está procurando?" /><button aria-label="Pesquisar">⌕</button></form><article class="home-hero"><h1>Equipamentos e utensílios para o seu negócio.</h1><p>Qualidade, segurança e entrega rápida.</p><button class="tiny-orange" data-screen="categories">Ver ofertas</button></article><div class="round-shortcuts"><button class="shortcut" data-screen="products" data-category="Cocção"><span>♨</span>Equipamentos</button><button class="shortcut" data-screen="products" data-category="Utensílios"><span>⚔</span>Utensílios</button><button class="shortcut" data-screen="products" data-category="Refrigeração"><span>▥</span>Refrigeração</button><button class="shortcut" data-screen="categories"><span>•••</span>Mais</button></div><div class="section-title"><h2>Lojas Parceiras</h2><button class="orange-text" data-screen="store">Ver todas ›</button></div><div class="partner-mini-list">${data.partners.map((partner, index) => `<button class="partner-mini" data-screen="store"><span>${["♨", "⚔", "▰"][index]}</span><b>${partner}</b><small>★★★★★</small></button>`).join("")}</div></section>${nav("home")}`;
}

function categoriesScreen() {
  return `<section class="mobile-page">${topBar("Categorias", "<button class='top-icon' data-screen='cart' aria-label='Carrinho'>⌑</button>")}<label class="category-search">⌕ <input id="categorySearch" placeholder="Buscar categorias..." /></label><div class="category-grid" id="categoryGrid">${data.categories.map(category => `<button class="category-card" data-screen="products" data-category="${category.key}"><img src="${category.image}" alt="" /><b>${category.name}</b><small>Ver produtos</small></button>`).join("")}</div></section>${nav("categories")}`;
}

function productsScreen() {
  const filters = ["Todos", "Cocção", "Refrigeração", "Utensílios", "Exposição", "Preparo"];
  const visible = data.products.filter(product => state.category === "Todos" || product.category === state.category);
  return `<section class="mobile-page">${topBar(state.category === "Todos" ? "Produtos" : (state.category === "Cocção" ? "Fogões e Fornos" : state.category), "<button class='top-icon' data-screen='cart' aria-label='Carrinho'>⌑</button><button class='more-button'>⋮</button>")}<div class="filter-pills">${filters.map(filter => `<button class="${state.category === filter ? "active" : ""}" data-filter="${filter}">${filter === "Cocção" ? "Fogões" : filter}</button>`).join("")}</div><div class="product-list">${visible.map(product => `<article class="product-row" data-product="${product.id}"><img src="${product.image}" alt="${product.name}" /><div><span class="partner-tag">◉ Parceiro</span><h2>${product.name}</h2><p class="stars">★★★★★ <small>(${product.reviews})</small></p><strong>${money.format(product.price)}</strong></div><button class="add-small" data-add="${product.id}" aria-label="Adicionar ao carrinho">+</button></article>`).join("")}</div></section>${nav("categories")}`;
}

function storeScreen() {
  const cards = data.categories.slice(0, 3);
  return `<section class="mobile-page">${topBar("", "<button class='top-icon' aria-label='Favoritar'>♡</button><button class='top-icon' aria-label='Compartilhar'>⌯</button>")}<div class="store-hero"></div><div class="store-summary"><div class="store-logo">♨</div><h1>GastroBR</h1><p class="stars">★★★★★ <b>4,8</b> (256 avaliações)</p><div class="badges"><span class="badge"><b>◉</b> Parceiro Oficial</span><span class="badge">◯ Entrega Rápida</span></div><p>Especialista em equipamentos para cozinhas profissionais. Trabalhamos com as melhores marcas e garantimos qualidade e suporte.</p><div class="store-facts"><div class="fact"><span>▰</span>Entrega para todo o Brasil</div><div class="fact"><span>⌖</span>Atendimento Especializado</div></div></div><div class="section-title"><h2>Categorias da loja</h2><button class="orange-text" data-screen="products">Ver todas ›</button></div><div class="store-cats">${cards.map(card => `<button class="store-cat" data-screen="products" data-category="${card.key}"><img src="${card.image}" alt="" />${card.name.split(" ").slice(0,2).join(" ")}</button>`).join("")}</div><button class="wide-button" data-screen="products">Ver loja</button></section>${nav("")}`;
}

function detailScreen() {
  const product = productFor(state.selectedProduct);
  return `<section class="mobile-page"><div class="floating-tag">◉ Parceiro</div>${topBar("", "<button class='top-icon' aria-label='Compartilhar'>⌯</button><button class='top-icon' aria-label='Favoritar'>♡</button>")}<div class="detail-image"><img src="${product.image}" alt="${product.name}" /></div><div class="detail-content"><p class="partner-tag">${product.store}</p><h1>${product.name}</h1><p class="stars">★★★★★ <small>(${product.reviews} avaliações)</small></p><strong class="detail-price">${money.format(product.price)}</strong><p class="detail-note">ou 12x de ${money.format(product.price / 12)} sem juros</p><p class="stock">● Em estoque</p><p class="detail-note">▱ Entrega em até 5 dias úteis</p><div class="quantity-row"><div class="quantity-control"><button data-detail-quantity="-1">−</button><b>${state.quantity}</b><button data-detail-quantity="1">+</button></div><button class="add-cart-button" data-add-detail="${product.id}">Adicionar ao carrinho</button></div></div></section>${nav("")}`;
}

function cartScreen() {
  const items = state.cart;
  return `<section class="mobile-page cart-page">${topBar("Carrinho", "<button class='orange-text' data-clear-cart>Limpar</button>")}<div>${items.length ? items.map(item => `<article class="cart-row"><img src="${item.image}" alt="" /><div><h2>${item.name}</h2><p>${money.format(item.price)}</p><div class="quantity-control"><button data-cart-quantity="${item.id}" data-change="-1">−</button><b>${item.quantity}</b><button data-cart-quantity="${item.id}" data-change="1">+</button></div></div><strong>${money.format(item.quantity * item.price)}</strong></article>`).join("") : `<div class="empty-state"><span>⌑</span><h2>Seu carrinho está vazio.</h2><p>Escolha os itens para sua cozinha.</p><button class="wide-button" data-screen="categories">Explorar produtos</button></div>`}</div>${items.length ? `<div class="order-summary"><div><span>Subtotal</span><span>${money.format(cartTotal())}</span></div><div><span>Frete (entrega padrão)</span><span>${money.format(49.9)}</span></div><div><span>Total</span><span>${money.format(cartTotal()+49.9)}</span></div></div><div class="checkout-bottom"><button data-screen="checkout">Finalizar compra</button></div>` : ""}</section>`;
}

function checkoutScreen() {
  return `<section class="mobile-page cart-page">${topBar("Finalizar pedido")}<div class="checkout-stepper"><span class="active"><b>1</b>Entrega</span><span><b>2</b>Pagamento</span><span><b>3</b>Revisão</span></div><article class="checkout-card"><h2>◉ Endereço de entrega <button class="change">Alterar</button></h2><p>Rua Claudio de Souza, 123</p><p>Santana · São Paulo, SP</p></article><article class="checkout-card"><h2>Forma de entrega</h2><label class="delivery-choice active"><input checked type="radio" name="delivery" /><span><b>Entrega Padrão</b><small>5 a 10 dias úteis · ${money.format(49.9)}</small></span></label><label class="delivery-choice"><input type="radio" name="delivery" /><span><b>Entrega Expressa</b><small>2 a 3 dias úteis · ${money.format(89.9)}</small></span></label></article><article class="checkout-card"><h2>Resumo do pedido</h2><p>${cartCount()} ${cartCount() === 1 ? "item" : "itens"}<span class="change">${money.format(cartTotal())}</span></p><p>Frete <span class="change">${money.format(49.9)}</span></p><p><b>Total</b><span class="change"><b>${money.format(cartTotal()+49.9)}</b></span></p></article><div class="checkout-bottom"><button data-order-confirm>Continuar</button></div></section>`;
}

function orderScreen() {
  return `<section class="mobile-page cart-page">${topBar("Acompanhar pedido")}<article class="tracking-status"><p>✓ Pedido #CH123456</p><b>Em transporte</b><p>12/09/2026 · 14:32</p><div class="progress-track"><i class="done"></i><i class="done"></i><i class="current"></i><i></i></div><div class="progress-labels"><span>Pedido<br />realizado</span><span>Em<br />preparação</span><span>Em<br />transporte</span><span>Entregue</span></div></article><div class="map-card"><span class="map-route"></span><span class="map-pin">⌖</span></div><article class="tracking-help"><span>◯</span><div><b>Rastreio da entrega</b><p>Seu pedido está a caminho! Previsão de entrega: 15/09/2026</p></div></article><button class="wide-button" data-screen="home">Ver detalhes</button></section>${nav("orders")}`;
}

function profileScreen() {
  const links = [["▤", "Meus pedidos", "orders"], ["⌖", "Endereços", "checkout"], ["♡", "Meus favoritos", "favorites"], ["⌂", "Lojas parceiras", "store"], ["?", "Suporte", "home"], ["⚙", "Configurações", "home"]];
  return `<section class="mobile-page"><div class="profile-head"><div class="avatar">BG</div><h1>Bruno Garcia</h1><p>brunogarcia@email.com</p></div><ul class="profile-menu">${links.map(([icon, label, screen]) => `<li><button data-screen="${screen}"><span>${icon}</span>${label}<span>›</span></button></li>`).join("")}</ul></section>${nav("profile")}`;
}

function favoritesScreen() { return `<section class="mobile-page">${topBar("Favoritos")}<div class="empty-state"><span>♡</span><h2>Seus favoritos ficam aqui.</h2><p>Toque no coração de um produto para guardá-lo.</p><button class="wide-button" data-screen="categories">Explorar categorias</button></div></section>${nav("favorites")}`; }

function welcomeScreen() {
  const install = state.deferredInstall ? `<div class="install-banner"><span>Instale o ChefHub nesta tela.</span><button data-install>Instalar</button></div>` : "";
  return `<section class="welcome"><div class="welcome-brand"><span class="chef-hat-large"><svg viewBox="0 0 68 62"><path d="M16 39a14 14 0 1 1 14.4-19.6A14.4 14.4 0 0 1 53 30.8c0 7.7-6.2 14-14 14H22v9l-7 4z"/><path d="M12 59c12-10 24-13 39-12"/></svg></span><h1>Chef<span>Hub</span></h1><small>EQUIPAMENTOS PARA SUA COZINHA</small></div><div class="welcome-copy"><h2>Tudo o que sua cozinha precisa, <em>em um só lugar.</em></h2><div class="store-badges"><div class="store-badge"><b>●</b> Disponível na<br /><strong>App Store</strong></div><div class="store-badge"><b>▶</b> Disponível no<br /><strong>Google Play</strong></div></div><button class="wide-button" data-screen="home">Começar agora</button><p class="welcome-login">Já tem uma conta? <button data-screen="profile">Entrar</button></p>${install}</div></section>`;
}

function render() {
  const screens = { welcome: welcomeScreen, home: homeScreen, categories: categoriesScreen, products: productsScreen, store: storeScreen, detail: detailScreen, cart: cartScreen, checkout: checkoutScreen, orders: orderScreen, profile: profileScreen, favorites: favoritesScreen };
  app.innerHTML = (screens[state.screen] || homeScreen)();
}

function showToast(message) { toast.textContent = message; toast.classList.add("visible"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2500); }
function addToCart(id, quantity = 1) { const item = productFor(id); const existing = state.cart.find(product => product.id === id); if (existing) existing.quantity += quantity; else state.cart.push({ ...item, quantity }); persistCart(); showToast("Item adicionado ao carrinho."); }
function changeCart(id, change) { const item = state.cart.find(product => product.id === id); if (!item) return; item.quantity += change; if (item.quantity <= 0) state.cart = state.cart.filter(product => product.id !== id); persistCart(); render(); }
function go(screen) { state.screen = screen; render(); window.scrollTo(0, 0); }

document.addEventListener("click", event => {
  const screen = event.target.closest("[data-screen]");
  const filter = event.target.closest("[data-filter]");
  const product = event.target.closest("[data-product]");
  const add = event.target.closest("[data-add]");
  const detailAdd = event.target.closest("[data-add-detail]");
  const cartChange = event.target.closest("[data-cart-quantity]");
  const detailQuantity = event.target.closest("[data-detail-quantity]");
  if (screen) { if (screen.dataset.category) state.category = screen.dataset.category; go(screen.dataset.screen); }
  if (filter) { state.category = filter.dataset.filter; render(); }
  if (product && !event.target.closest("[data-add]")) { state.selectedProduct = Number(product.dataset.product); state.quantity = 1; go("detail"); }
  if (add) { addToCart(Number(add.dataset.add)); }
  if (detailAdd) { addToCart(Number(detailAdd.dataset.addDetail), state.quantity); go("cart"); }
  if (cartChange) changeCart(Number(cartChange.dataset.cartQuantity), Number(cartChange.dataset.change));
  if (detailQuantity) { state.quantity = Math.max(1, state.quantity + Number(detailQuantity.dataset.detailQuantity)); render(); }
  if (event.target.closest("[data-clear-cart]")) { state.cart = []; persistCart(); render(); }
  if (event.target.closest("[data-order-confirm]")) { state.cart = []; persistCart(); go("orders"); showToast("Pedido confirmado com sucesso!"); }
  if (event.target.closest("[data-back]")) { go(state.screen === "products" ? "categories" : "home"); }
  if (event.target.closest("[data-install]")) { state.deferredInstall.prompt(); state.deferredInstall.userChoice.finally(() => { state.deferredInstall = null; render(); }); }
});

document.addEventListener("submit", event => {
  if (event.target.id === "homeSearch") { event.preventDefault(); const input = document.querySelector("#homeSearchInput"); state.category = "Todos"; go("products"); if (input?.value) showToast(`Mostrando resultados para “${input.value}”.`); }
});

document.addEventListener("input", event => {
  if (event.target.id === "categorySearch") { const query = event.target.value.toLocaleLowerCase("pt-BR"); document.querySelectorAll(".category-card").forEach(card => { card.hidden = !card.textContent.toLocaleLowerCase("pt-BR").includes(query); }); }
});

window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); state.deferredInstall = event; if (state.screen === "welcome") render(); });
window.addEventListener("appinstalled", () => { state.deferredInstall = null; showToast("ChefHub instalado no seu dispositivo."); });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
render();
