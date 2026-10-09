// Saqib — The Artist · art shop
// Simple cart with localStorage, checkout via TikTok DM.

const PRODUCTS = [
  {
    id: 'pip-inky-first-splash',
    name: 'Pip & Inky — "First Splash"',
    tag: 'Art Print · A4',
    desc: 'The official Pip & Inky lineup print. Museum-quality matte finish, signed by the artist.',
    price: 1500,
    img: 'images/pip-inky-lineup.webp',
  },
  {
    id: 'pip-happy-tears',
    name: 'Pip — "Happy Tears"',
    tag: 'Art Print · A4',
    desc: 'Everyone\'s favourite emotional close-up. A heart-melter for any wall or desk.',
    price: 1200,
    img: 'images/pip-closeup.webp',
  },
  {
    id: 'studio-debate',
    name: 'Pip & Inky — "Studio Debate"',
    tag: 'Art Print · A3',
    desc: 'The big dramatic studio scene, printed large. For true fans of the series.',
    price: 2000,
    img: 'images/pip-inky-studio.webp',
  },
  {
    id: 'custom-portrait',
    name: 'Custom Portrait Commission',
    tag: 'Commission',
    desc: 'A hand-drawn portrait in Saqib\'s style — you, a loved one, or your pet. Digital + print options.',
    price: 5000,
    img: 'images/pip-inky-lineup.webp',
  },
  {
    id: 'drawing-lesson',
    name: '1-on-1 Drawing Lesson',
    tag: 'Lesson · 60 min',
    desc: 'A private online drawing lesson with Saqib. All levels welcome, materials list provided.',
    price: 2000,
    img: 'images/pip-inky-studio.webp',
  },
  {
    id: 'sticker-pack',
    name: 'Pip & Inky Sticker Pack',
    tag: 'Stickers · 6 pcs',
    desc: 'Waterproof vinyl stickers of Pip & Inky in their most iconic poses.',
    price: 500,
    img: 'images/pip-closeup.webp',
  },
];

const TIKTOK_URL = 'https://www.tiktok.com/@curioussaqibartist';
const fmt = (n) => 'Rs ' + n.toLocaleString('en-PK');

// Images are stored in the repo as base64 text (the GitHub App API can't push
// binary), so we decode them to object URLs at runtime.
const artCache = {};
async function artURL(path) {
  if (artCache[path]) return artCache[path];
  const b64 = (await (await fetch(path)).text()).trim();
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bin], { type: 'image/webp' }));
  artCache[path] = url;
  return url;
}
const art = (path) => artCache[path] || path;

let cart = {};
try {
  cart = JSON.parse(localStorage.getItem('saqib-cart') || '{}');
} catch (e) {
  cart = {};
}

const $ = (id) => document.getElementById(id);

function saveCart() {
  localStorage.setItem('saqib-cart', JSON.stringify(cart));
}

function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function renderProducts() {
  $('productGrid').innerHTML = PRODUCTS.map((p) => `
    <article class="card">
      <img src="${art(p.img)}" alt="${p.name}" loading="lazy" />
      <div class="card-body">
        <span class="card-tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card-foot">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCart() {
  const items = Object.entries(cart);
  $('cartCount').textContent = cartCount();
  $('cartTotal').textContent = fmt(cartTotal());

  if (!items.length) {
    $('cartItems').innerHTML = '<p class="cart-empty">Your cart is empty.<br />Go find something beautiful. 🎨</p>';
    return;
  }

  $('cartItems').innerHTML = items.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <img src="${art(p.img)}" alt="${p.name}" />
        <div class="cart-item-info">
          <strong>${p.name}</strong>
          <span>${fmt(p.price)} each</span>
        </div>
        <div class="qty">
          <button data-dec="${id}" aria-label="Decrease">−</button>
          <span>${qty}</span>
          <button data-inc="${id}" aria-label="Increase">+</button>
        </div>
      </div>
    `;
  }).join('');
}

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  const p = PRODUCTS.find((x) => x.id === id);
  toast(`Added "${p.name}" to cart 🛒`);
}

function openCart() {
  $('cartDrawer').classList.add('open');
  $('cartOverlay').classList.add('open');
}
function closeCart() {
  $('cartDrawer').classList.remove('open');
  $('cartOverlay').classList.remove('open');
}

function checkout() {
  const items = Object.entries(cart);
  if (!items.length) {
    toast('Your cart is empty — add something first 🎨');
    return;
  }
  const lines = items.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return `• ${p.name} × ${qty} — ${fmt(p.price * qty)}`;
  });
  const message = `Hi Saqib! I'd like to order:\n${lines.join('\n')}\nTotal: ${fmt(cartTotal())}`;
  try {
    navigator.clipboard.writeText(message).catch(() => {});
  } catch (e) { /* clipboard unavailable */ }
  toast('Order copied! Paste it into my TikTok DM 💬');
  setTimeout(() => window.open(TIKTOK_URL, '_blank', 'noopener'), 900);
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    if (add) { addToCart(add.dataset.add); return; }
    if (inc) { cart[inc.dataset.inc]++; saveCart(); renderCart(); return; }
    if (dec) {
      const id = dec.dataset.dec;
      cart[id]--;
      if (cart[id] <= 0) delete cart[id];
      saveCart(); renderCart(); return;
    }
  });

  $('cartOpen').addEventListener('click', openCart);
  $('cartClose').addEventListener('click', closeCart);
  $('cartOverlay').addEventListener('click', closeCart);
  $('checkoutBtn').addEventListener('click', checkout);
  $('orderViaCart').addEventListener('click', () => { renderCart(); openCart(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
}

// Boot: decode artwork first, then render.
(async function init() {
  const paths = [...new Set([
    ...PRODUCTS.map((p) => p.img),
    ...[...document.querySelectorAll('img[data-b64img]')].map((el) => el.getAttribute('data-b64img')),
  ])];
  await Promise.all(paths.map((p) => artURL(p).catch(() => null)));
  document.querySelectorAll('img[data-b64img]').forEach((el) => {
    const u = art(el.getAttribute('data-b64img'));
    if (u) el.src = u;
  });
  const icon = document.querySelector('link[rel="icon"]');
  if (icon && artCache['images/logo.webp']) icon.href = artCache['images/logo.webp'];
  bindEvents();
  renderProducts();
  renderCart();
})();
