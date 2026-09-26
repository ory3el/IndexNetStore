/*function injectEcommeUI() {
  if (document.getElementById('cartSidebar')) return;

  document.body.insertAdjacentHTML('afterbegin', `
  <!-- CART SIDEBAR -->
  <div class="overlay" id="cartOverlay" onclick="closeCart()"></div>
  <div class="cart-sb" id="cartSidebar">
    <div class="cart-hd">
      <h3>Carrinho <span style="color:var(--muted);font-size:15px" id="cartCount">(0)</span></h3>
      <button class="cart-cls" onclick="closeCart()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cart-body" id="cartItems"></div>
    <div class="cart-ft">
      <div class="cart-tots">
        <div class="ct-row"><span class="lbl">Subtotal</span><span id="cartSub">R$ 0,00</span></div>
        <div class="ct-row"><span class="lbl">Frete</span><span style="color:var(--green)">Grátis acima de R$199</span></div>
        <div class="ct-row ttl"><span class="lbl">Total</span><span class="amt" id="cartTotal">R$ 0,00</span></div>
      </div>
      <button class="btn-ckout" onclick="checkout()">
        <svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Finalizar Compra
      </button>
      <button class="btn-cont" onclick="closeCart()"><- Continuar Comprando</button>
    </div>
  </div>

  <!-- FAV SIDEBAR -->
  <div class="overlay" id="favOverlay" onclick="closeFav()"></div>
  <div class="fav-sb" id="favSidebar">
    <div class="fav-hd">
      <h3>Lista de Desejos <span style="color:var(--muted);font-size:15px" id="favCount">(0)</span></h3>
      <button class="fav-cls" onclick="closeFav()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="fav-body" id="favItems"></div>
    <div class="fav-ft">
      <div class="fav-tots">
        <div class="ct-row ttl"><span class="lbl">Total</span><span class="amt" id="favTotal">R$ 0,00</span></div>
      </div>
      <button class="btn-ckout" onclick="addAllFavToCart()">
        <svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Adicionar tudo ao carrinho
      </button>
      <button class="btn-cont" onclick="closeFav()"><- Continuar Comprando</button>
    </div>
  </div>

  <!-- NOTIFICATION SIDEBAR -->
  <div class="overlay" id="notifOverlay" onclick="closeNotif()"></div>
  <div class="notif-sb" id="notifSidebar">
    <div class="notif-hd">
      <h3>Notificações <span style="color:var(--muted);font-size:15px" id="notifCount">(0)</span></h3>
      <button class="notif-cls" onclick="closeNotif()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="notif-body"></div>
    <div class="notif-ft">
      <button class="btn-ckout" onclick="window.location.href = '/notifications'">
        Ver Mais Notificações
        <span class="btn-arrow">&gt;</span>
      </button>
      <button class="btn-cont" onclick="closeNotif()">
        Fechar Notificações
      </button>
    </div>
  </div>

  <!-- MORE SIDEBAR -->
  <div class="overlay" id="moreOverlay" onclick="closeMore()"></div>
  <div class="more-sb" id="moreSidebar" role="dialog" aria-label="Menu" aria-hidden="true">
    <div class="more-hd">
      <h3>Principais Atalhos</h3>
      <button class="more-cls" aria-label="Fechar menu" onclick="closeMore()">
        <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="more-body">
      <!-- THEME SWITCH -->
      <div class="theme-switch-wrap">
        <p class="acc-label">Aparência</p>
        <div class="theme-switch" id="themeSwitch" role="radiogroup" aria-label="Tema da interface">
          <button class="theme-opt" data-theme-choice="light" role="radio" aria-checked="false" title="Tema claro">
            <i class="fa-solid fa-sun" aria-hidden="true"></i><span>Claro</span>
          </button>
          <button class="theme-opt" data-theme-choice="auto" role="radio" aria-checked="false" title="Seguir o sistema">
            <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i><span>Automático</span>
          </button>
          <button class="theme-opt" data-theme-choice="dark" role="radio" aria-checked="false" title="Tema escuro">
            <i class="fa-solid fa-moon" aria-hidden="true"></i><span>Escuro</span>
          </button>
        </div>
      </div>
      <div class="acc-menu-group" style="gap:10px">
        <button class="btn-acc-option" onclick="buttonLink('/settings')">
          <div class="btn-content">
            <span class="btn-title"><i class="fa-solid fa-gear"></i> Configurações</span>
            <p class="btn-txt">Gerencie e personalize as preferências do sistema, o comportamento das ferramentas e os parâmetros da sua conta.</p>
          </div>
          <span class="btn-arrow">&gt;</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/track-order')">
          <div class="btn-content">
            <span class="btn-title"><i class="fa-solid fa-truck"></i> Acompanhar Pedido</span>
            <p class="btn-txt">Acompanhe o status e a localização exata das suas entregas em tempo real.</p>
          </div>
          <span class="btn-arrow">&gt;</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/sellers')">
          <div class="btn-content">
            <span class="btn-title"><i class="fa-solid fa-sack-dollar"></i> Página do Vendedor</span>
            <p class="btn-txt">Seu canal direto de vendas para atrair e converter clientes.</p>
          </div>
          <span class="btn-arrow">&gt;</span>
        </button>
        <button class="btn-acc-option active" onclick="buttonLink('/affiliates')">
          <div class="btn-content">
            <span class="btn-title"><i class="fa-solid fa-handshake"></i> Programa de Afiliados</span>
            <p class="btn-txt">Gere links, divulgue produtos e acompanhe suas comissões.</p>
          </div>
          <span class="btn-arrow">&gt;</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/terms')">
          <div class="btn-content">
            <span class="btn-title"><i class="fa-solid fa-file-contract"></i> Termos e Condições de Uso</span>
          </div>
          <span class="btn-arrow">&gt;</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/support')">
          <div class="btn-content">
            <span class="btn-title"><i class="fa-solid fa-circle-question"></i> Suporte</span>
          </div>
          <span class="btn-arrow">&gt;</span>
        </button>
      </div>
    </div>
    <div class="notif-ft">
      <button class="btn-cont" onclick="closeMore()">Fechar Menu</button>
    </div>
  </div>

  <!-- ACC SIDEBAR -->
  <div class="overlay" id="accOverlay" onclick="closeAcc()"></div>
  <div class="acc-sb" id="accSidebar">
    <div class="acc-hd">
      <h3>Minha Conta</h3>
      <button class="acc-cls" onclick="closeAcc()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="acc-body">
      <button class="acc-profile-summary" onclick="buttonLink('/settings')">
        <div class="acc-avatar-large">
          <img id="accSidebarAvatar" src="/images/icons/full/user.webp" alt="Avatar">
        </div>
        <div class="acc-info" style="gap: 3px; display: flex; align-items: baseline;">
          <strong id="accSidebarName"></strong>
          <span id="accSidebarEmail"></span>
        </div>
      </button>
      <div class="acc-menu-group">
        <p class="acc-label">Atalhos</p>
        <button class="btn-acc-option" onclick="buttonLink('/settings')">
          <i class="fa-solid fa-user-pen"></i>
          <span>Editar Perfil</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/my-orders')">
          <i class="fa-solid fa-box-open"></i>
          <span>Minhas Compras</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/reviews')">
          <i class="fa-solid fa-star"></i>
          <span>Minhas Avaliações</span>
        </button>
        <button class="btn-acc-option" onclick="openFav(); closeAcc();">
          <i class="fa-solid fa-heart"></i>
          <span>Lista de Desejos</span>
        </button>
      </div>
      <div class="acc-menu-group">
        <p class="acc-label">Suporte</p>
        <button class="btn-acc-option" onclick="buttonLink('/support')">
          <i class="fa-solid fa-circle-question"></i>
          <span>Ajuda & FAQ</span>
        </button>
        <button class="btn-acc-option" onclick="buttonLink('/terms')">
          <i class="fa-solid fa-file-contract"></i>
          <span>Termos de Uso</span>
        </button>
      </div>
      <div class="acc-ft">
        <button class="btn-logout-sb" onclick="openConfirmLogout()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          Sair da Conta
        </button>
      </div>
    </div>
  </div>
    
  <!-- PRODUCT MODAL -->
  <div class="modal-ov" id="modalOverlay" onclick="handleModalClick(event)">
    <div class="modal">
      <div class="modal-img-area">
        <div class="modal-img" id="modalImg">
          <button class="btn-mwish1" id="mWish" onclick="addFromModal2()">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button class="mcls" onclick="closeProductModal()">
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="mArrows">
            <button class="pArrow1" onclick="previousImg()"><i class="fa-solid fa-chevron-right arrow0 arrow1"></i></button>
            <button class="pArrow2" onclick="nextImg()"><i class="fa-solid fa-chevron-right arrow0 arrow2"></i></button>
          </div>
          <span id="mEmoji"></span>
        </div>
        <div class="m-qty-ctrl1">
          <button class="qb1" onclick="chgQty(-1)">−</button>
          <span class="m-qty-num1" id="mQty">1</span>
          <button class="qb1" onclick="chgQty(1)">+</button>
        </div>
        <div class="modal-gallery" id="modalGallery"></div>
      </div>
      <div class="modal-info">
        <div class="m-cat" id="mCat"></div>
        <div class="m-name" id="mName"></div>
        <div class="m-desc" id="mDesc"></div>
        <div class="m-price-row">
          <span class="m-price" id="mPrice"></span>
          <span class="m-old" id="mOld"></span>
          <span class="m-disc" id="mDisc"></span>
        </div>
        <div class="m-feats" id="mFeats"></div>
        <hr class="m-div">
        <div class="m-qty-row">
          <span class="m-qty-lbl">Quantidade:</span>
          <div class="m-qty-ctrl0">
            <button class="qb" onclick="chgQty(-1)">−</button>
            <span class="m-qty-num" id="mQty">1</span>
            <button class="qb" onclick="chgQty(1)">+</button>
          </div>
        </div>
        <div class="m-btns">
          <span class="m-price1" id="mPrice1"></span>
          <button class="btn-madd" onclick="addFromModal()">
            <svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.5" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Adicionar ao Carrinho
          </button>
          <button class="btn-mwish" id="mWish" onclick="addFromModal2()">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div class="toast" id="toast">
    <div class="toast-icon">✓</div>
    <span id="toastMsg">Produto adicionado!</span>
  </div>

  <!-- BACK TO TOP -->
  <button class="back-top" id="backTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <!-- QUICKLINK -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/quicklink/2.3.0/quicklink.umd.js"></script>
  <script>
    // Start the Quicklink
    window.addEventListener('load', () => {
      quicklink.listen();
    });
  </script>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = "https://cedrpcezoaqaeivrfuxn.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_mgumCH-bhkDOZfzqaMjKzQ_OwPVESs0";
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let userId = null;
</script>
<script src="/files/scripts/auth-session-check.js"></script>
<script src="/files/scripts/console-warning.js"></script>
  `);
  initEcommeUI()
}
function initEcommeUI() {*/

/* ─── UTILS ─────────────────────────────────────────────────────────── */
const fmt = p => p != null ? 'R$ ' + Number(p).toFixed(2).replace('.', ',') : '';
const $ = id => document.getElementById(id);

function starsHtml(r) {
  let s = '';
  const f = Math.floor(r);
  for (let i = 0; i < f; i++) s += '★';
  for (let i = f; i < 5; i++) s += '☆';
  return s;
}

function fishYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ------------------------------------------------
if (typeof systemPrefersDark === 'undefined') {
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function effectiveTheme(pref) {
    return pref === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : pref;
  }

  function updateThemeSwitchUI(pref) {
    document.querySelectorAll('.theme-opt').forEach(function (btn) {
      var isActive = btn.dataset.themeChoice === pref;
      btn.setAttribute('aria-checked', String(isActive));
    });
  }

  async function saveThemeToSupabase(pref) {
    try {
      if (typeof supabaseClient === 'undefined') return;
      const {data: { user }, error: userError} = await supabaseClient.auth.getUser();
      if (userError || !user) return;
    
      const { error } = await supabaseClient.from('user_settings').upsert({user_id: user.id, theme: pref}, {onConflict: 'user_id'});
      if (error) console.error('Erro ao salvar tema no Supabase:', error);
    } catch (error) {
      console.error('Erro ao sincronizar tema com o Supabase:', error);
    }
  }
  
  function applyTheme(pref, opts) {
    opts = opts || {};
    if (!['light', 'dark', 'auto'].includes(pref)) pref = 'light';
    try {
      localStorage.setItem('ecomme-theme', pref);
      const raw = localStorage.getItem('ecomme_settings');
      const settings = raw ? JSON.parse(raw) : {};
      localStorage.setItem('ecomme_settings', JSON.stringify({...settings, theme: pref}));
    } catch (error) {
      console.warn('Não foi possível salvar o tema localmente:', error);
    }
    const root = document.documentElement;
    if (!opts.silent) root.classList.add('theme-transition');
    root.setAttribute('data-theme', effectiveTheme(pref));
    root.setAttribute('data-theme-pref', pref);
    updateThemeSwitchUI(pref);
    if (!opts.silent) {
      window.setTimeout(function () {
        root.classList.remove('theme-transition');
      }, 420);
    }
    if (opts.saveToSupabase !== false) saveThemeToSupabase(pref);
  }

  function initTheme() {
    var pref = document.documentElement.getAttribute('data-theme-pref') || 'auto';
    updateThemeSwitchUI(pref);

    // Live-follow the OS theme while the user's preference is "auto"
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () {
        var currentPref = document.documentElement.getAttribute('data-theme-pref') || 'auto';
        if (currentPref === 'auto') applyTheme('auto', {silent: false, saveToSupabase: false});
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }
}

/* ── THEME ───────────────────────────────────────────────────────── */
function initThemeToggle() {
  var wrap = document.getElementById('themeSwitch');
  if (!wrap) return;
  wrap.querySelectorAll('.theme-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.dataset.themeChoice);
    });
  });
}

/* ─── STATE ─────────────────────────────────────────────────────────── */
let cart = [];
let fav = [];
let curId = null;
let mQtyVal = 1;
let view = 'grid';
let modalImages = [];
let modalImageIndex = 0;

let products = [];
let shuffled = [];

const EDGE_IMAGE_ZONE = 'https://image.sellerium.workers.dev';
const EDGE_IMAGE_PRESETS = {
  grid: 'grid',
  list: 'list',
  thumbnail: 'thumbnail',
  modal: 'modal'
};

// ============================================================

const PRODUCT_REFRESH_INTERVAL = 10000;
let productRefreshTimer = null;
let productRealtimeChannel = null;
let productRefreshRunning = false;
let productDataSignature = '';
let pageIsVisible = true;

// ============================================================

document.addEventListener('visibilitychange', () => {
    pageIsVisible = document.visibilityState === 'visible';
    if (pageIsVisible) {
      refreshProductsIfNeeded();
    }
  }
);

// ============================================================

document.body.style.cursor = "default";

function buttonLink(url) {
  window.location.href = url;
}

function goToLogin() {
  const atualPage = window.location.pathname + window.location.search;
  window.location.href = '/login?redirect=' + encodeURIComponent(atualPage);
}

function injectPrefetch(url) {
  if (!document.querySelector(`link[href="${url}"]`)) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
}

// ============================================================

// EXECUTE DATABASE
window.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initThemeToggle();
    setupModalSwipe();
    setupModalAutoPlay();
    initEcommeTranslationObserver();
    const loginBtn = document.getElementById('authLoginBtn');
    const profileContainer = document.getElementById('headerProfileContainer');
    /*const productsLoaded = await loadProductsFromSupabase();
    if (!productsLoaded) {
      return;
    }*/

    const {data: { user }, error: userError} = await supabaseClient.auth.getUser();
    if (!user || userError) {
      userId = null;
      if (loginBtn) {
        loginBtn.classList.remove('hidden');
      }
      if (profileContainer) {
        profileContainer.classList.add('hidden');
      }
      injectPrefetch('/login');
      return;
    }

    userId = user.id;
    await loadFromSupabase();
    if (loginBtn) {
      loginBtn.classList.add('hidden');
    }
    if (profileContainer) {
      profileContainer.classList.remove('hidden');
    }

    const {data: profile, error: profileError} = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileError && profile) {
      const fullName = profile.full_name || 'Cliente';
      const email = user.email || '';
      if ($('accSidebarName')) {
        $('accSidebarName').textContent = fullName;
      }
      if ($('accSidebarEmail')) {
        $('accSidebarEmail').textContent = email;
      }
      if (profile.avatar_url && $('accSidebarAvatar')) {
        $('accSidebarAvatar').src = profile.avatar_url;
        $('accSidebarAvatar').style.display = "flex";
        if ($('accSidebarIcon')) $('accSidebarIcon').style.display = "none";
      }
    }
    startProductsRealtime();
    startProductRefresh();
  }
);

// HEADER
function initHeaderAuthListener() {
  const loginBtn = document.getElementById('authLoginBtn');
  const profileContainer = document.getElementById('headerProfileContainer');
  const bellBtn = document.getElementById('bellBtn');
  const headerAvatar = document.getElementById('headerAvatar');

  if (!loginBtn || !profileContainer) return;
  
  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (session && session.user) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (bellBtn) bellBtn.classList.remove('hidden');
      if (profileContainer) profileContainer.classList.remove('hidden');

      try {
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profileData && profileData.avatar_url) {
          headerAvatar.src = profileData.avatar_url;      
          headerAvatar.style.filter = 'none';
          headerAvatar.style.width = '100%';
          headerAvatar.style.height = '100%';
          headerAvatar.style.borderRadius = '100%';
          headerAvatar.style.objectFit = 'cover';
        } else {
          headerAvatar.src = "/images/icons/full/user.webp";
        }
      } catch (err) {
        console.error("Erro ao carregar o avatar do header:", err);
      }
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (profileContainer) profileContainer.classList.add('hidden');
      if (bellBtn) bellBtn.classList.add('hidden');
      if (headerAvatar) headerAvatar.src = "/images/icons/full/user.webp";
    }
  });
}
initHeaderAuthListener();

// ============================================================

function createProductsSignature(
  productList
) {
  return productList
    .map(product => ({
      id: String(product.id),
      name: product.name,
      price: product.price,
      old: product.old,
      discount: product.discount,
      rating: product.rating,
      reviews: product.reviews,
      shipping: product.shipping,
      badge: product.badge,
      desc: product.desc,
      cat: product.cat,
      image_url: product.image_url,
      gallery_urls: product.gallery_urls,
      features: product.features
    })) .map(product => JSON.stringify(product)) .join('|');
}

// ============================================================

async function refreshProductsIfNeeded() {
  if (
    !pageIsVisible ||
    productRefreshRunning
  ) {return;}
  
  productRefreshRunning = true;
  
  try {
    const {data, error} = await supabaseClient
      .from('products')
      .select('*')
      .order(
        'id',
        {ascending: true}
      );

    if (error) {
      console.error('Erro na atualização automática dos produtos:',error);
      return;
    }

    const updatedProducts = (data || []).map(normalizeProduct);
    const newSignature = createProductsSignature(updatedProducts);
    if (newSignature === productDataSignature) {
      return;
    }

    productDataSignature = newSignature;
    products = updatedProducts;
    shuffled = [...products];
    virtualStartIndex = -1;
    virtualEndIndex = -1;
    virtualColumns = 0;
  } finally {productRefreshRunning = false;}
}

// ============================================================

function startProductRefresh() {
  if (productRefreshTimer) {
    clearInterval(productRefreshTimer);
  }

  productRefreshTimer = setInterval( () => {
    refreshProductsIfNeeded();},
    PRODUCT_REFRESH_INTERVAL
    );
}

// ============================================================

function startProductsRealtime() {
  if (
    productRealtimeChannel
  ) {
    supabaseClient.removeChannel(
      productRealtimeChannel
    );
  }

  productRealtimeChannel = supabaseClient.channel('products-live')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'products'
    },
        
        payload => { if (!pageIsVisible) {return;}
          refreshProductsIfNeeded();
        }
      )
      .subscribe(status => {/*console.log('Products Realtime:',status);*/});
}

// ============================================================

const catalogSearchDebounce = null;
let userIsSearching = false;

function setupProductSearch() {
  const inputs = [$('heroSearch'), $('headerSearch')].filter(Boolean);

  inputs.forEach(
    input => {
      input.addEventListener(
        'input',
        () => {
          userIsSearching = true;
          clearTimeout(
            window.catalogSearchTimer
          );
          inputs.forEach(
            other => {
              if (
                other !== input
              ) {
                other.value =
                  input.value;
              }
            }
          );
          window.catalogSearchTimer =
            setTimeout(
              async () => {
                userIsSearching = false;
                await resetCatalogAndLoad();
              },
              400
            );
        }
      );
    }
  );
}

// ============================================================

function prepareProductImageAnimations(
  container = document
) {
  const images =
    container.querySelectorAll(
      'img.product-image-reveal'
    );
  images.forEach(
    img => {
      const markLoaded = () => {
        img.classList.add(
          'is-loaded'
        );
      };
      if (img.complete) {
        requestAnimationFrame(
          markLoaded
        );
      } else {
        img.addEventListener(
          'load',
          markLoaded,
          {
            once: true
          }
        );
        img.addEventListener(
          'error',
          () => {
            img.classList.add(
              'is-loaded'
            );
          },
          {
            once: true
          }
        );
      }
    }
  );
}

// ============================================================
function getOptimizedImageUrl(
  sourceUrl,
  preset = 'grid'
) {
  if (!sourceUrl) {
    return '';
  }
  try {
    const workerUrl =
      new URL(
        EDGE_IMAGE_ZONE
      );
    workerUrl.searchParams.set(
      'preset',
      preset
    );
    workerUrl.searchParams.set(
      'src',
      sourceUrl
    );
    return workerUrl.toString();
  } catch (error) {
    console.error(
      'Erro ao gerar URL otimizada:',
      error
    );
    return sourceUrl;
  }
}
// ============================================================

/* ─── CART ───────────────────────────────────────────────────────────── */
function addToCart(id, qty = 1) {
  if (!userId) {
    showAuth(
      "Para adicionar produtos ao carrinho e salvá-los na sua conta, é necessário fazer login ou criar uma nova conta.",
      "Conta Necessária",
      "🔒"
    );
    return;
  }

  const normalizedId = String(id);
  const p = products.find(
    x => String(x.id) === normalizedId
  );
  if (!p) {
    console.error("Produto não encontrado para o carrinho:", normalizedId);
    return;
  }
  const ex = cart.find(
    x => String(x.id) === normalizedId
  );
  if (ex) {
    ex.qty += qty;
  } else {
    cart.push({
      ...p,
      id: normalizedId,
      qty
    });
  }
  updateCart();
  showToast(`${p.name} adicionado ao carrinho! 🛒`);
  syncToSupabase();
}

function removeFromCart(id) {
  const normalizedId = String(id);
  cart = cart.filter(
    x => String(x.id) !== normalizedId
  );
  updateCart();
  syncToSupabase();
}

function changeCartQty(id, d) {
  const normalizedId = String(id);
  const item = cart.find(
    x => String(x.id) === normalizedId
  );
  if (item) {
    item.qty += d;
    if (item.qty <= 0) {
      removeFromCart(normalizedId);
    } else {
      updateCart();
      syncToSupabase();
    }
  }
}

// UPDATE CART -------------------------- //
function updateCart() {
  const validCart = cart
    .map(item => {
      const product = products.find(
        p => String(p.id) === String(item.id)
      );

      if (!product) return null;

      return {
        ...product,
        qty: item.qty
      };
    })
    .filter(Boolean);

  cart = validCart;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  if ($('cartBadge')) {
    $('cartBadge').textContent = count;
    $('cartBadge').style.display = count > 0 ? 'flex' : 'none';
  }

  if ($('cartCount')) $('cartCount').textContent = `(${count})`;
  if ($('cartSub')) $('cartSub').textContent = window.ecommeFormatPrice(total);
  if ($('cartTotal')) $('cartTotal').textContent = window.ecommeFormatPrice(total);

  const el = $('cartItems');

  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty-st">
        <span>🛒</span>
        <p>Seu carrinho está vazio</p>
      </div>
    `;
    return;
  }

  el.innerHTML = cart.map(item => {
    const images = getProductImages(item);
    const image = images[0] || null;
    const optimizedImage = image ? getOptimizedImageUrl( image, EDGE_IMAGE_PRESETS.thumbnail ) : null;

    return `
      <div class="ci">
        <div class="ci-img" onclick="openProduct('${item.id}'); closeCart()">
          ${
            image
              ? `<img
                   src="${optimizedImage}"
                   alt="${item.name}"
                   style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                 >`
              : item.emoji
          }
        </div>
        <div class="ci-info">
          <div class="ci-name" data-no-translate>${item.name}</div>
          <div class="ci-price" data-no-translate>
            ${window.ecommeFormatPrice(item.price)}
          </div>
          <div class="ci-qty">
            <button
              class="qb"
              onclick="changeCartQty('${item.id}', -1)"
            >
              −
            </button>
            <span class="qn">${item.qty}</span>
            <button
              class="qb"
              onclick="changeCartQty('${item.id}', 1)"
            >
              +
            </button>
          </div>
        </div>
        <button
          class="del"
          onclick="confirmRemoveFromCart('${item.id}', '${item.name.replace(/'/g, "\\'")}')"
          title="Remover do Carrinho">
          <i class="fa-regular fa-trash-can"></i>
        </button>
        <button class="cart-item-towish ${fav.some(f => String(f.id) === String(item.id)) ? 'on' : ''}" data-product-id="${item.id}"
          onclick="event.stopPropagation(); toggleFav('${item.id}');"
          title="${fav.some(f => String(f.id) === String(item.id)) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
    `;
  }).join('');
}

function updateCartWishButtons() {
  document.querySelectorAll('.cart-item-towish[data-product-id]').forEach(button => {
    const productId = String(button.dataset.productId);
    const isFav = fav.some(
      item => String(item.id) === productId
    );
    button.classList.toggle('on', isFav);
    button.title = isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  });
}

function openCart() {
  closeMore();
  closeFav();
  closeNotif();
  closeAcc();
  $('cartSidebar').classList.add('on');
  $('cartOverlay').classList.add('on');
  document.body.classList.add("nobodyscroll");
  updateCart();
}

function closeCart() {
  if ($('cartSidebar')) $('cartSidebar').classList.remove('on');
  if ($('cartOverlay')) $('cartOverlay').classList.remove('on');
  document.body.classList.remove("nobodyscroll");
}

function checkout() {
  if (!cart.length) {
    showAlert("Para finalizar a compra, é necessário adicionar produtos ao carrinho primeiro!", "Sem Itens no Carrinho", "ℹ️");
    return;
  }
  showToast('Redirecionando para o pagamento... 🔒');
  window.location.href = "/checkout"
  setTimeout(closeCart, 1200);
}

let cartItemPendingDelete = null;
function confirmRemoveFromCart(id, productName) {
  cartItemPendingDelete = String(id);
  showConfirm(`Remover "${productName}" do carrinho? Você pode adicioná-lo novamente quando quiser.`, 'Remover do Carrinho', '<i class="fa-solid fa-trash-can"></i>');
}

/* ─── FAV ───────────────────────────────────────────────────────── */
function toggleFav(id) {
  if (!userId) {
    showAuth(
      "Para adicionar itens à sua lista de desejos e salvá-los na sua conta, é necessário fazer login ou criar uma nova conta.",
      "Conta Necessária",
      "🔒"
    );
    return;
  }

  const normalizedId = String(id);

  const ex = fav.find(
    x => String(x.id) === normalizedId
  );

  if (ex) {
    removeFromFav(normalizedId);
    showToast(
      'Removido da Lista de Desejos! 💔'
    );
  } else {
    addToFav(normalizedId, 1);
  }

  if ($('mWish')) {
    $('mWish').classList.toggle(
      'on',
      fav.some(
        x => String(x.id) === normalizedId
      )
    );
  }
  if ($('mWish1')) {
    $('mWish1').classList.toggle(
      'on',
      fav.some(
        x => String(x.id) === normalizedId
      )
    );
  }
  updateCartWishButtons();
}

function addToFav(id, qty = 1) {
  if (!userId) {
    showAuth(
      "Para adicionar itens à sua lista de desejos e salvá-los na sua conta, é necessário fazer login ou criar uma nova conta.",
      "Conta Necessária",
      "🔒"
    );
    return;
  }
  const normalizedId = String(id);
  const p = products.find(
    x => String(x.id) === normalizedId
  );
  if (!p) {
    console.error("Produto não encontrado para favoritos:", normalizedId);
    return;
  }
  const ex = fav.find(
    x => String(x.id) === normalizedId
  );
  if (ex) {
    ex.qty += qty;
  } else {
    fav.push({
      ...p,
      id: normalizedId,
      qty
    });
  }
  updateFav();
  showToast(`${p.name} salvo nos favoritos! ❤️`);
  syncToSupabase();
}

function removeFromFav(id) {
  const normalizedId = String(id);
  fav = fav.filter(
    x => String(x.id) !== normalizedId
  );
  updateFav();
  syncToSupabase();
}

function changeFavQty(id, d) {
  const normalizedId = String(id);
  const item = fav.find(
    x => String(x.id) === normalizedId
  );
  if (item) {
    item.qty += d;
    if (item.qty <= 0) {
      removeFromFav(normalizedId);
    } else {
      updateFav();
      syncToSupabase();
    }
  }
}

// UPDATE FAV ------------------------- //
function updateFav() {
  const validFav = fav
    .map(item => {
      const product = products.find(
        p => String(p.id) === String(item.id)
      );

      if (!product) return null;

      return {
        ...product,
        qty: item.qty
      };
    })
    .filter(Boolean);

  fav = validFav;

  const total = fav.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const count = fav.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  if ($('wishBadge')) {
    $('wishBadge').textContent = count;
    $('wishBadge').style.display = count > 0 ? 'flex' : 'none';
  }

  if ($('favCount') && $('favTotal')) {
    $('favCount').textContent = `(${count})`;
    $('favTotal').textContent = window.ecommeFormatPrice(total);
  }

  const el = $('favItems');
  if (!fav.length) {
    el.innerHTML = `
      <div class="fav-empty-st">
        <span>❤️</span>
        <p>Nenhum produto salvo no momento</p>
      </div>
    `;
    return;
  }

  if ($('favItems')) {
   el.innerHTML = fav.map(item => {
    const images = getProductImages(item);
    const image = images[0] || null;
    const optimizedImage = image ? getOptimizedImageUrl(image, EDGE_IMAGE_PRESETS.thumbnail) : null;

    return `
      <div class="ci">
        <div class="ci-img" onclick="openProduct('${item.id}'); closeFav()">
          ${
            image
              ? `<img
                   src="${optimizedImage}"
                   alt="${item.name}"
                   style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                 >`
              : item.emoji
          }
        </div>
        <div class="ci-info">
          <div class="ci-name" data-no-translate>
            ${item.name}
          </div>
          <div class="ci-price" data-no-translate>
            ${window.ecommeFormatPrice(item.price)}
          </div>
          <button
            class="btn-madd"
            onclick="
              addToCart('${item.id}', 1);
              removeFromFav('${item.id}');
              closeFav();
              openCart();
            "
          >
            Adicionar ao Carrinho
          </button>
        </div>
        <button
          class="del"
          onclick="removeFromFav('${item.id}')"
        >
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;
   }).join('');
  }
}

function openFav() {
  closeMore();
  closeCart();
  closeNotif();
  closeAcc();
  $('favSidebar').classList.add('on');
  $('favOverlay').classList.add('on');
  document.body.classList.add("nobodyscroll");
}

function closeFav() {
  if ($('favSidebar')) $('favSidebar').classList.remove('on');
  if ($('favOverlay')) $('favOverlay').classList.remove('on');
  document.body.classList.remove("nobodyscroll");
}

function addAllFavToCart() {
  if (!fav.length) {
    showToast('Adicione produtos primeiro! 😊');
    return;
  }
  fav.forEach(produto => {
    addToCart(String(produto.id), 1);
  });
  fav = [];
  updateFav();
  closeFav();
  openCart();
  showToast('Todos os itens foram para o carrinho! 🛒');
}

function moveFromCartToFav(id) {
  addToFav(String(id), 1);
  showToast('Produto adicionado à Lista de Desejos! ❤️');
}

/* ---------------------------------------- */
async function loadProductsFromSupabase() {
  const {data, error} = await supabaseClient
    .from('products')
    .select('*')
    .order('id', {ascending: true});

  if (error) {
    console.error(
      'Erro ao carregar produtos:',
      error
    );

    products = [];
    shuffled = [];
    return false;
  }

  products = (data || []).map(normalizeProduct);
  shuffled = [...products];
  productDataSignature = createProductsSignature(products);
  return true;
}

/* ─── NOTIFICATION ───────────────────────────────────────────────── */
function openNotif() {
  closeCart();
  closeFav();
  closeAcc();
  closeMore();
  if (typeof closeMore === 'function') closeMore();
  $('notifSidebar').classList.add('on');
  $('notifOverlay').classList.add('on');
  document.body.classList.add("nobodyscroll");
}

function closeNotif() {
  if ($('notifSidebar')) $('notifSidebar').classList.remove('on');
  if ($('notifOverlay')) $('notifOverlay').classList.remove('on');
  document.body.classList.remove("nobodyscroll");
}

/* ─── MORE ───────────────────────────────────────────────────────── */
function openMore() {
  closeFav();
  closeCart();
  closeAcc();
  closeNotif();
  if (typeof closeMore === 'function') closeNotif();
  $('moreSidebar').classList.add('on');
  $('moreOverlay').classList.add('on');
  document.body.classList.add("nobodyscroll");
}

function closeMore() {
  if ($('moreSidebar')) $('moreSidebar').classList.remove('on');
  if ($('moreOverlay')) $('moreOverlay').classList.remove('on');
  document.body.classList.remove("nobodyscroll");
}

/* ─── ACC SIDEBAR ────────────────────────────────────────────────── */
function openAcc() {
  closeCart();
  closeFav();
  closeNotif();
  closeMore();

  const sb = document.getElementById('accSidebar');
  const ov = document.getElementById('accOverlay');
  if (sb) sb.classList.add('on');
  if (ov) ov.classList.add('on');
  document.body.classList.add("nobodyscroll");
}

function closeAcc() {
  const sb = document.getElementById('accSidebar');
  const ov = document.getElementById('accOverlay');
  if (sb) sb.classList.remove('on');
  if (ov) ov.classList.remove('on');
  document.body.classList.remove("nobodyscroll");
}

/* ----------------------------------- */
let modalImageRequestId = 0;
function showModalImage(index, direction = 'next', animate = true) {
  const mEmoji = $('mEmoji');
  const modalGallery = $('modalGallery');
  if (!mEmoji || !modalImages.length) return;
  const requestId = ++modalImageRequestId;
  const oldImage = mEmoji.querySelector('.modal-main-image');
  modalImageIndex = (index + modalImages.length) % modalImages.length;
  const image = modalImages[modalImageIndex];
  if (!image) return;
  const optimizedImage = getOptimizedImageUrl(
    image,
    EDGE_IMAGE_PRESETS.modal
  );

  const newImage = new Image();
  newImage.alt = 'Imagem do produto';
  newImage.decoding = 'async';
  newImage.fetchPriority = 'high';
  newImage.className = 'modal-main-image';

  const mountImage = () => {
    if (requestId !== modalImageRequestId) return;

    newImage.className =
      `modal-main-image ${
        animate
          ? (direction === 'next'
              ? 'modal-enter-next'
              : 'modal-enter-prev')
          : ''
      }`;

    if (animate && oldImage) {
      oldImage.classList.add(
        direction === 'next'
          ? 'modal-exit-next'
          : 'modal-exit-prev'
      );
    }

    mEmoji.appendChild(newImage);
    if (animate) {
      newImage.addEventListener(
        'animationend',
        () => {
          mEmoji
            .querySelectorAll('.modal-main-image')
            .forEach(img => {
              if (img !== newImage) {
                img.remove();
              }
            });
        },
        { once: true }
      );
    } else {
      mEmoji
        .querySelectorAll('.modal-main-image')
        .forEach(img => {
          if (img !== newImage) {
            img.remove();
          }
        });
    }
  };

  newImage.onload = mountImage;
  newImage.onerror = () => {
    if (requestId !== modalImageRequestId) return;
    if (!oldImage) {
      newImage.className = 'modal-main-image';
      mEmoji.appendChild(newImage);
    }
  };

  newImage.src = optimizedImage;
  if (newImage.complete && newImage.naturalWidth > 0) {
    requestAnimationFrame(mountImage);
  }

  if (modalGallery) {
    modalGallery
      .querySelectorAll('.modal-gallery-thumb')
      .forEach((button, buttonIndex) => {
        button.classList.toggle(
          'on',
          buttonIndex === modalImageIndex
        );
      });

    const activeThumb =
      modalGallery.querySelector(
        '.modal-gallery-thumb.on'
      );

    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: animate ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'center'
      });
    }
  }
}

/* ----------------------------------------- */
function mobileArrowFeedback(button, callback) {
  if (!button) {
    callback();
    return;
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    button.classList.remove('mobile-clicked');
    void button.offsetWidth;
    button.classList.add('mobile-clicked');
    callback();
    setTimeout(() => {
      button.classList.remove('mobile-clicked');
    }, 220);
  } else {
    callback();
  }
}

/* ----------------------------------------- */
let modalLastImageInteraction = 0;
const MODAL_FAST_CLICK_THRESHOLD = 350;

function shouldAnimateModalImage() {
  const now = performance.now();
  const elapsed = now - modalLastImageInteraction;
  modalLastImageInteraction = now;
  return elapsed >= MODAL_FAST_CLICK_THRESHOLD;
}

function changeModalImageManually(index, direction = 'next') {
  const animate = shouldAnimateModalImage();
  showModalImage(index, direction, animate);
  resetModalAutoPlayAfterManualInteraction();
}

/* ----------------------------------------- */
function previousImg() {
  if (modalImages.length <= 1) return;
  const button = document.querySelector('.pArrow1');
  mobileArrowFeedback(button, () => {
    changeModalImageManually(modalImageIndex - 1, 'prev');
  });
}

function nextImg() {
  if (modalImages.length <= 1) return;
  const button = document.querySelector('.pArrow2');
  mobileArrowFeedback(button, () => {
    changeModalImageManually(modalImageIndex + 1, 'next');
  });
}

/* ----------------------------------------- */
function updateModalNavigationVisibility() {
  const buttons = document.querySelectorAll('.mArrows');
  const visible = modalImages.length > 1;
  buttons.forEach(button => {button.style.display = visible ? 'flex' : 'none';});
}

/* ----------------------------------------- */
document.addEventListener('keydown', event => {
    const modal = $('modalOverlay');
    if (!modal || !modal.classList.contains('on')) {return;}
    if (event.key === 'ArrowLeft') {previousImg();}
    if (event.key === 'ArrowRight') {nextImg();}
  }
);

/* ----------------------------------------- */
let modalTouchStartX = 0;
let modalTouchEndX = 0;

function setupModalSwipe() {
  const area = $('mEmoji');
  if (!area) {return;}

  area.addEventListener('touchstart', event => {
    modalTouchStartX = event.changedTouches[0].clientX;
  }, {passive: true});

  area.addEventListener('touchend', event => {
      modalTouchEndX = event.changedTouches[0].clientX;
      const delta = modalTouchEndX - modalTouchStartX;
      if (Math.abs(delta) < 50) {return;}
      if (delta > 0) {previousImg();} else {nextImg();}
  }, {passive: true});
}

/* ----------------------------------------- */
let productModalHistoryOpen = false;

function openProductModalHistory() {
  if (productModalHistoryOpen) return;
  history.pushState(
    {
      ...(history.state || {}),
      productModal: true
    }, '', window.location.href
  );
  productModalHistoryOpen = true;
}

function closeProductModal() {
  if (!productModalHistoryOpen) {
    stopModalAutoPlay();
    closeModal();
    return;
  }
  history.back();
}

window.addEventListener('popstate', () => {
  if (!productModalHistoryOpen) return;
  productModalHistoryOpen = false;
  closeModal();
});

/* ----------------------------------------- */
let modalAutoPlayTimer = null;
let modalAutoPlayResumeTimer = null;

const MODAL_AUTO_PLAY_INTERVAL = 3000;
const MODAL_AUTO_PLAY_MANUAL_DELAY = 6000;

function startModalAutoPlay(delay = 0) {
  stopModalAutoPlay();
  if (modalImages.length <= 1) return;
  
  const start = () => {
    if (modalImages.length <= 1) return;

    modalAutoPlayTimer = setInterval(() => {
      if (modalImages.length <= 1) {
        stopModalAutoPlay();
        return;
      }
      showModalImage(modalImageIndex + 1, 'next', true);
    }, MODAL_AUTO_PLAY_INTERVAL);
  };

  if (delay > 0) {
    modalAutoPlayResumeTimer = setTimeout(() => {
      modalAutoPlayResumeTimer = null;
      start();
    }, delay);
  } else {
    start();
  }
}

function stopModalAutoPlay() {
  if (modalAutoPlayTimer) {
    clearInterval(modalAutoPlayTimer);
    modalAutoPlayTimer = null;
  }

  if (modalAutoPlayResumeTimer) {
    clearTimeout(modalAutoPlayResumeTimer);
    modalAutoPlayResumeTimer = null;
  }
}

function resetModalAutoPlayAfterManualInteraction() {
  startModalAutoPlay(
    MODAL_AUTO_PLAY_MANUAL_DELAY
  );
}

function setupModalAutoPlay() {
  const modalImgArea = document.querySelector('.modal-img-area');
  if (!modalImgArea) return;
  modalImgArea.addEventListener('mouseenter', stopModalAutoPlay);
  modalImgArea.addEventListener('mouseleave', () => {startModalAutoPlay();});
}

/* ─── MODAL ──────────────────────────────────────────────────────── */
function openProduct(id) {
  document.body.classList.add("noscroll");
  const normalizedId = String(id);
  const p = products.find(
    x => String(x.id) === normalizedId
  );

  if (!p) {
    console.error("Produto não encontrado:", normalizedId);
    document.body.classList.remove("noscroll");
    return;
  }
  openProductModalHistory();
  curId = normalizedId;
  mQtyVal = 1;
  $('mQty').textContent = 1;
  
  const images = getProductImages(p);
  modalImages = images;
  modalImageIndex = 0;
  updateModalNavigationVisibility();
  const mainImage = images[0] || null;
  const optimizedMainImage = mainImage ? getOptimizedImageUrl(mainImage, EDGE_IMAGE_PRESETS.modal) : null;
  const mEmoji = $('mEmoji');

  if (mEmoji) {
    if (modalImages.length > 0) {
      mEmoji.innerHTML = '';
    } else {
      mEmoji.innerHTML = p.emoji || '';
    }
  }

  const modalGallery = $('modalGallery');
  if (modalGallery) {
    modalGallery.innerHTML = '';
    images.forEach((image, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'modal-gallery-thumb' + (index === 0 ? ' on' : '');
      const thumbnail = getOptimizedImageUrl(image, EDGE_IMAGE_PRESETS.thumbnail);

      button.innerHTML = `
        <img
          src="${thumbnail}"
          alt="${p.name} - imagem ${index + 1}"
          loading="lazy"
          decoding="async">
      `;
      button.addEventListener('click', () => {
        const direction = index >= modalImageIndex ? 'next' : 'prev';
        changeModalImageManually(index, direction);
        resetModalAutoPlayAfterManualInteraction();
      });
      modalGallery.appendChild(button);
    });

  modalGallery.style.display = images.length > 1 ? 'flex' : 'none';
  showModalImage(modalImageIndex, 'next', false);

  $('mCat').textContent =
    Array.isArray(p.cat)
      ? p.cat.join(', ')
      : p.cat;

  $('mName').textContent = p.name;
  $('mDesc').textContent = p.desc;
  $('mPrice').textContent = window.ecommeFormatPrice(p.price);
  $('mPrice1').textContent = window.ecommeFormatPrice(p.price);
  $('mOld').textContent = p.old > 0 ? window.ecommeFormatPrice(p.old) : '';
  $('mDisc').textContent = p.discount > 0 ? `-${p.discount}% OFF` : '';
  $('mFeats').innerHTML = p.features.map(f =>
      `<div class="m-feat">
        <div class="fchk">✓</div>
        ${f}
      </div>`
    ).join('');
    
  if ($('mWish')) $('mWish').classList.toggle('on', fav.some(x => String(x.id) === normalizedId));
  if ($('mWish1')) $('mWish1').classList.toggle('on', fav.some(x => String(x.id) === normalizedId));
  $('modalOverlay').classList.add('on');
 }
 startModalAutoPlay();
};

function handleModalClick(e) { if (e.target === $('modalOverlay')) closeProductModal(); }
function closeModal()        { $('modalOverlay').classList.remove('on'); document.body.classList.remove("noscroll"); }
function chgQty(d)           { mQtyVal = Math.max(1, mQtyVal + d); $('mQty').textContent = mQtyVal; }

function addFromModal() {
  addToCart(String(curId), mQtyVal);
  closeModal();
  openCart();
}
function addFromModal2() {
  addToFav(String(curId), mQtyVal);
  closeModal();
  openFav();
}

// ── HYDRATE USER SAVED ITEMS ──
function hydrateUserItems(savedItems) {
  if (!Array.isArray(savedItems)) return [];
  return savedItems
    .map(item => {
      const product = products.find(
        p => String(p.id) === String(item.id)
      );
      if (!product) return null;
      return {
        ...product,
        qty: Math.max(1, Number(item.qty) || 1)
      };
    })
    .filter(Boolean);
}

// ── SYNC CART AND WISHLIST WITH SUPABASE ──
async function syncToSupabase() {
  if (!userId) return;

  const cartToSave = cart.map(item => ({
    id: String(item.id),
    qty: Number(item.qty) || 1
  }));

  const favToSave = fav.map(item => ({
    id: String(item.id),
    qty: Number(item.qty) || 1
  }));

  const { error } = await supabaseClient
    .from('profiles')
    .update({
      cart: cartToSave,
      fav: favToSave
    })
    .eq('id', userId);

  if (error) {
    console.error(
      'Erro ao sincronizar carrinho/favoritos:',
      error
    );
  }
}

//--------------------------------------------------------
async function loadFromSupabase() {
  if (!userId) return;
  const {
    data,
    error
  } = await supabaseClient
    .from('profiles')
    .select('cart, fav')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(
      'Erro ao carregar carrinho/favoritos:',
      error
    );
    return;
  }
  cart = hydrateUserItems(
    data?.cart
  );
  fav = hydrateUserItems(
    data?.fav
  );
  updateCart();
  updateFav();
}

//--------------------------------------------------------
function normalizeProduct(p) {
  return {
    ...p,

    id: String(p.id),
    name: p.name || 'Produto sem nome',
    desc: p.desc || '',
    price: Number(p.price) || 0,
    old: Number(p.old) || 0,
    discount: Number(p.discount) || 0,
    rating: Number(p.rating) || 0,
    reviews: Number(p.reviews) || 0,
    emoji: p.emoji || '📦',
    shipping: Boolean(p.shipping),
    badge: p.badge || 'new',
    
    features: Array.isArray(p.features)
      ? p.features
      : [],

    cat: Array.isArray(p.cat)
      ? p.cat
      : (p.cat ? [p.cat] : []),

    image_url: p.image_url || null,
    gallery_urls: Array.isArray(p.gallery_urls)
      ? p.gallery_urls.filter(Boolean).slice(0, 5)
      : []
  };
}

function getProductImages(product) {
  const images = [];
  if (product.image_url) {
    images.push(product.image_url);
  }
  if (Array.isArray(product.gallery_urls)) {
    product.gallery_urls.forEach(url => {
      if (url && !images.includes(url)) {
        images.push(url);
      }
    });
  }
  return images.slice(0, 5);
}

const pLoading = document.getElementById('pLoading');
function pLoadingNone() {
  if (pLoading) {
    pLoading.style.display = 'none';
  }
}
function pLoadingFlex() {
  if (pLoading) {
    pLoading.style.display = 'flex';
  }
}

// ── STYLES INJECTOR ──
function injectModalStyles() {
  if (document.getElementById('modal-alert-styles')) return;

  const style = document.createElement('style');
  style.id = 'modal-alert-styles';
  style.textContent = `
    .modal-alert-container {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      /*background: rgba(0, 0, 0, 0.6);*/
      backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      z-index: 500000;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .modal-alert-container.active {
      opacity: 1; pointer-events: auto;
    }
    .modal-alert-content {
      /*background: rgba(255, 255, 255, 0.8);*/
      background: var(--white);
      backdrop-filter: blur(12px);
      padding: 30px;
      border-radius: 36px;
      max-width: 440px;
      width: 90%;
      text-align: center;
      box-shadow: 0 0 100px rgba(25,100,255,0.5);
      transform: scale(0.8);
      transition: transform 0.3s ease;
    }
    .modal-alert-container.active .modal-alert-content {
      transform: scale(1);
    }
    .modal-alert-icon {
      font-size: 44px;
      margin-bottom: 15px;
    }
    .modal-alert-content h3 {
      margin: 0 0 10px 0;
      font-family: 'Sora', 'Poppins', sans-serif;
      color: var(--text);
      font-size: 20px;
      font-weight: 700;
    }
    .modal-alert-content p {
      color: var(--muted);
      font-size: 14.5px;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }
    .modal-alert-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .btn-alert-confirm {
      background: #2563EB;
      color: #fff;
      border: none;
      padding: 11px 24px;
      border-radius: 250px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.2s, background 0.2s;
    }
    .btn-alert-confirm:hover {
      background: var(--blue2);
      transform: scale(1.05);
    }
    .btn-alert-confirm-red {
      background: #eb2525;
      color: #fff;
      border: none;
      padding: 11px 24px;
      border-radius: 250px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn-alert-confirm-red:hover {
      background: #d81d1d;
    }
    .btn-alert-cancel {
      background: var(--white);
      border: 1px solid var(--text1);
      color: var(--black);
      padding: 11px 24px;
      border-radius: 250px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn-alert-cancel:hover {
      background: var(--surface);
    }
  `;
  document.head.appendChild(style);
}

// ── POP-UP WARNING ──
async function showAlert(message, title, icon) {
  injectModalStyles();
  
  let alertModal = document.getElementById('alertModal');
  
  if (!alertModal) {
    alertModal = document.createElement('div');
    alertModal.id = 'alertModal';
    alertModal.className = 'modal-alert-container';
    alertModal.innerHTML = `
      <div class="modal-alert-content">
        <div class="modal-alert-icon" id="alertIcon">${icon}</div>
        <h3 id="alertTitle">${title}</h3>
        <p id="alertMsg">${message}</p>
        <div class="modal-alert-buttons">
          <button class="btn-alert-confirm" onclick="closeAlert()">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(alertModal);
  } else {

    document.getElementById('alertMsg').textContent = message;
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertIcon').textContent = icon;
  }
  
  alertModal.offsetHeight;
  alertModal.classList.add('active');
}

// ── POP-UP CONFIRM ──
let confirmTimerId = null;

async function showConfirm(message, title, icon) { 
  injectModalStyles();
  
  let confirmModal = document.getElementById('confirmModal');
  if (!confirmModal) {
    confirmModal = document.createElement('div');
    confirmModal.id = 'confirmModal';
    confirmModal.className = 'modal-alert-container';
    confirmModal.innerHTML = `
      <div class="modal-alert-content">
        <div class="modal-alert-icon" id="confirmIcon">${icon}</div>
        <h3 id="confirmTitle">${title}</h3>
        <p id="confirmMsg">${message}</p>
        <div class="modal-alert-buttons">
          <button class="btn-alert-cancel" onclick="closeConfirm()">Cancelar</button>
          <button class="btn-alert-confirm" id="btnConfirmRemove" onclick="confirmRemove()">Remover Produto</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal); 
  } else {
    document.getElementById('confirmMsg').innerHTML = message;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmIcon').innerHTML = icon; 
  }
  
  // ── LOGIC 1s ──
  const confirmBtn = document.getElementById('btnConfirmRemove');
  let timeLeft = 1;
  
  confirmBtn.disabled = true;
  confirmBtn.style.opacity = '0.5';
  confirmBtn.style.cursor = 'not-allowed';
  confirmBtn.style.transition = 'all 0.3s ease';
  confirmBtn.textContent = `Remover Produto (${timeLeft}s)`;
  
  if (confirmTimerId) clearInterval(confirmTimerId);
  
  confirmTimerId = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      confirmBtn.textContent = `Remover Produto (${timeLeft}s)`;
    } else {
      clearInterval(confirmTimerId);
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
      confirmBtn.textContent = 'Remover Produto';
    }
  }, 1000);
  
  confirmModal.offsetHeight;
  confirmModal.classList.add('active');
}
  
function closeAlert() {
  const alertModal = document.getElementById('alertModal');
  if (alertModal) {
    alertModal.classList.remove('active');
  }
}

function confirmRemove() {
  const confirmModal = document.getElementById('confirmModal');
  
  if (!cartItemPendingDelete) return;
  removeFromCart(cartItemPendingDelete);
  cartItemPendingDelete = null;
  
  if (confirmModal) {
    confirmModal.classList.remove('active');
  }
}

function closeConfirm() {
  const confirmModal = document.getElementById('confirmModal');
  if (confirmModal) {
    confirmModal.classList.remove('active');
  }
  if (confirmTimerId) clearInterval(confirmTimerId);
}

// ── POP-UP LOGOUT ──
let confirmRedTimerId = null;

async function showConfirmRed(message, title, icon) { 
  injectModalStyles();
  
  let confirmRedModal = document.getElementById('confirmRedModal');
  
  if (!confirmRedModal) {
    confirmRedModal = document.createElement('div');
    confirmRedModal.id = 'confirmRedModal';
    confirmRedModal.className = 'modal-alert-container';
    confirmRedModal.innerHTML = `
      <div class="modal-alert-content">
        <div class="modal-alert-icon" id="confirmRedIcon">${icon}</div>
        <h3 id="confirmRedTitle">${title}</h3>
        <p id="confirmRedMsg">${message}</p>
        <div class="modal-alert-buttons">
          <button class="btn-alert-cancel" onclick="closeConfirmRed()">Voltar</button>
          <button class="btn-alert-confirm-red" id="btnConfirmLogout" onclick="confirmLogout()">Sair da conta</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmRedModal); 
  } else {
    document.getElementById('confirmRedMsg').innerHTML = message;
    document.getElementById('confirmRedTitle').textContent = title;
    document.getElementById('confirmRedIcon').innerHTML = icon; 
  }
  
  // ── LOGIC 3s ──
  const confirmRedBtn = document.getElementById('btnConfirmLogout');
  let timeLeft = 3;
  
  confirmRedBtn.disabled = true;
  confirmRedBtn.style.opacity = '0.5';
  confirmRedBtn.style.cursor = 'not-allowed';
  confirmRedBtn.style.transition = 'all 0.3s ease';
  confirmRedBtn.textContent = `Sair da conta (${timeLeft}s)`;
  
  if (confirmRedTimerId) clearInterval(confirmRedTimerId);
  
  confirmRedTimerId = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      confirmRedBtn.textContent = `Sair da conta (${timeLeft}s)`;
    } else {
      clearInterval(confirmRedTimerId);
      confirmRedBtn.disabled = false;
      confirmRedBtn.style.opacity = '1';
      confirmRedBtn.style.cursor = 'pointer';
      confirmRedBtn.textContent = 'Sair da conta';
    }
  }, 1000);
  
  confirmRedModal.offsetHeight;
  confirmRedModal.classList.add('active');
}
  
function closeAlert() {
  const alertModal = document.getElementById('alertModal');
  if (alertModal) {
    alertModal.classList.remove('active');
  }
}

function confirmLogout() {
  const confirmRedModal = document.getElementById('confirmRedModal');
  doLogout();
  
  if (confirmRedModal) {
    confirmRedModal.classList.remove('active');
  }
}

function closeConfirmRed() {
  const confirmRedModal = document.getElementById('confirmRedModal');
  if (confirmRedModal) {
    confirmRedModal.classList.remove('active');
  }
  if (confirmRedTimerId) clearInterval(confirmRedTimerId);
}

// TOAST
function showToast(msg) {
  const t = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toastMsg) toastMsg.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
function toast(msg) {
  showToast(msg);
}

// BACK TO TOP
const backTop = document.getElementById('backTop');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    if (backTop) backTop.classList.toggle('visible',window.scrollY > 400);
    scrollTicking = false;
  });
}, { passive: true });

// KEYBOARD ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeNotif(); closeCart(); closeFav(); closeMore(); closeAcc(); }
});

// ---------------------------------
supabaseClient.auth.onAuthStateChange(
  async (event, session) => {
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem(
        'local_session_id'
      );
      if (typeof stopSessionCheck === 'function') {
        stopSessionCheck();
      }
    }
  }
);

// LOGOUT
const waitt = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function doLogout() {
  toast('Saindo da conta... 👋', 'info');
  const localSessionId = localStorage.getItem('local_session_id');
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (localSessionId && user) {
    const { error: deleteError } = await supabaseClient
        .from('user_sessions')
        .delete()
        .eq('id', localSessionId)
        .eq('user_id', user.id);
    
    if (deleteError) {console.error('Erro ao remover sessão do banco:', deleteError);}
  }
  sessionStorage.setItem('remote_logout_notice_shown', 'true');
  localStorage.removeItem('local_session_id');
  const { error: signOutError } = await supabaseClient.auth.signOut({scope: 'local'});
  if (signOutError) {console.error('Erro ao fazer logout:', signOutError); }
  toast('Você saiu da conta.', 'info');
  await waitt(700);
  window.location.reload();
}

/* ----------------------------------------------------- */
function openConfirmLogout() {
  closeAcc();
  showConfirmRed('Tem certeza que quer sair? <br>Suas informações não serão perdidas.', 'Sair da Conta', '<i class="fa-solid fa-right-from-bracket"></i>');
}
