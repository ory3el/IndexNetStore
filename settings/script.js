// ── NAV LINKS ──────────────────────────────────────
function buttonLink(url) {
  window.location.href = url;
}

function goToLogin() {
  const atualPage = window.location.pathname + window.location.search;
  window.location.href = '/login?redirect=' + encodeURIComponent(atualPage);
}

// FAVICON
if (typeof favicon !== 'undefined') {
  const favicon = document.getElementById('favicon');
}

function checkTheme(e) {
  if (e.matches) {
    favicon.href = '/images/favicon-light.png';
  } else {
    favicon.href = '/images/favicon-blue.png';
  }
}
const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
checkTheme(mqDark);
mqDark.addEventListener('change', checkTheme);

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

  function applyTheme(pref, opts) {
    opts = opts || {};
    try { localStorage.setItem('site-theme', pref); } catch (e) {}
    var root = document.documentElement;
    if (!opts.silent) root.classList.add('theme-transition');
    root.setAttribute('data-theme', effectiveTheme(pref));
    root.setAttribute('data-theme-pref', pref);
    updateThemeSwitchUI(pref);
    if (!opts.silent) {
      window.setTimeout(function () { root.classList.remove('theme-transition'); }, 420);
    }
  }

  function initTheme() {
    var pref = document.documentElement.getAttribute('data-theme-pref') || 'auto';
    updateThemeSwitchUI(pref);

    // Live-follow the OS theme while the user's preference is "auto"
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () {
        var currentPref = document.documentElement.getAttribute('data-theme-pref') || 'auto';
        if (currentPref === 'auto') applyTheme('auto', { silent: false });
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

// ── PANEL NAV ──────────────────────────────────────────────
const labels = {profile:'Meu Perfil',orders:'Meus Pedidos',wishlist:'Lista de Desejos',cart:'Meu Carrinho',coupons:'Meus Cupons',addresses:'Endereços',payments:'Pagamentos',notifications:'Notificações',security:'Segurança',reviews:'Avaliações',settings:'Configurações',logout:'Sair da Conta'};

function showPanel(id, btn){
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if(panel) panel.classList.add('active');
  if(btn) btn.classList.add('active');
  else { const nb = document.querySelector(`[data-panel="${id}"]`); if(nb) nb.classList.add('active'); }
  document.getElementById('bcSection').textContent = labels[id] || 'Minha Conta';
  localStorage.setItem('site_settings_section', id);
  window.scrollTo({top:0, behavior:'smooth'});
  if (id === 'wishlist') loadWishlist();
  if (id === 'cart') loadCart();
}

// ── ACTIONS ────────────────────────────────────────────────
function changePwd(){
  const card = document.getElementById('pwdChangeCard');
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
  if(card.style.display === 'block') card.scrollIntoView({behavior:'smooth', block:'nearest'});
}
function removeWish(btn, name){
  const card = btn.closest('.wcard');
  card.style.transition = 'all .3s';
  card.style.opacity = '0';
  card.style.transform = 'scale(.9)';
  setTimeout(() => { card.remove(); toast(`${name} removido dos favoritos`); }, 300);
}
function setTheme(btn, theme){ document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('on')); btn.classList.add('on'); toast(`Tema ${theme==='light'?'claro':theme==='dark'?'escuro':'automático'} ativado`); }
function setAllNotifs(){ document.querySelectorAll('.toggle-inp').forEach(t => t.checked = true); toast('Todas as notificações ativadas! 🔔'); }
function filterOrders(btn, filter){ document.querySelectorAll('.btn-xs.blue, .btn-xs.gray').forEach(b => { if(b.closest('.card') && b.closest('.card').querySelector('.btn-xs')){ b.className = 'btn-xs gray'; } }); btn.className = 'btn-xs blue'; toast(`Filtro aplicado: ${btn.textContent}`,'info'); }
function copyCoupon(code){ navigator.clipboard?.writeText(code); toast(`Cupom ${code} copiado! 📋`); }

// ── MASKS ──────────────────────────────────────────────────
function maskCPF(inp){ let v=inp.value.replace(/\D/g,'').slice(0,11); if(v.length>9) v=v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6,9)+'-'+v.slice(9); else if(v.length>6) v=v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6); else if(v.length>3) v=v.slice(0,3)+'.'+v.slice(3); inp.value=v; }
function maskPhone(inp){ let v=inp.value.replace(/\D/g,'').slice(0,11); if(v.length>6) v='('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7); else if(v.length>2) v='('+v.slice(0,2)+') '+v.slice(2); inp.value=v; }

// ── TOAST ──────────────────────────────────────────────────
/*function toast(msg, type='ok'){
  const t=document.getElementById('t1');
  const ic=document.getElementById('tIco');
  const tx=document.getElementById('toastMsg');
  tx.textContent=msg;
  ic.className=`t-ico ${type}`;
  ic.textContent=type==='ok'?'✓':type==='err'?'!':'ℹ';
  t.classList.add('on');
  clearTimeout(t._t);
  t._t=setTimeout(()=>t.classList.remove('on'),3000);
}*/

// TOAST
function showToast(msg) {
  const t = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toastMsg) toastMsg.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 5000);
}
function toast(msg) {
  showToast(msg);
}

const site_SETTINGS_KEY = 'site_settings';
const DEFAULT_site_SETTINGS = {
  styled_icons: true,
  theme: 'light',
  language: 'pt-BR',
  currency: 'BRL',
  
  profile_public: true,
  purchase_history_visible: false,
  ai_personalization: true,
  share_data_with_partners: true,

  larger_font: false,
  high_contrast: false,

  reduce_animations: false,
  optimize_performance: false
};

let siteSettings = {
  ...DEFAULT_site_SETTINGS
};

let siteCurrencyRates = {
  BRL: 1,
  USD: null,
  EUR: null
};

function normalizesiteSettings(data = {}) {
  return {
    ...DEFAULT_site_SETTINGS,
    ...data
  };
}

function getStoredsiteSettings() {
  try {
    const raw = localStorage.getItem(site_SETTINGS_KEY);
    if (!raw) return null;

    return normalizesiteSettings(JSON.parse(raw));
  } catch (error) {
    console.warn('Não foi possível ler as configurações locais:', error);
    return null;
  }
}

function cachesiteSettings(settings) {
  try {
    localStorage.setItem(site_SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem('site-theme', settings.theme
    );

  } catch (error) {
    console.warn('Não foi possível salvar configurações locais:', error);
  }
}

function getEffectiveTheme(theme) {
  if (theme === 'auto') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applySavedTheme(theme) {
  document.documentElement.setAttribute('data-theme-pref', theme
  );

  document.documentElement.setAttribute('data-theme', getEffectiveTheme(theme));
  document.querySelectorAll('#themeSwitch .theme-opt').forEach(btn => {
    btn.classList.toggle(
      'on',
      btn.dataset.themeChoice === theme
    );
    btn.setAttribute('aria-checked', String(btn.dataset.themeChoice === theme));
  });
}

function setTheme(btn, theme) {
  document
    .querySelectorAll('#themeSwitch .theme-opt')
    .forEach(b => {
      b.classList.remove('on');
      b.setAttribute('aria-checked', 'false');
    });

  btn.classList.add('on');
  btn.setAttribute('aria-checked', 'true');
  document.documentElement.setAttribute('data-theme-pref', theme);
  document.documentElement.setAttribute('data-theme', getEffectiveTheme(theme));
}

function readSettingsFromUI() {
  const selectedTheme = document.querySelector('#themeSwitch .theme-opt.on')?.dataset.themeChoice || 'light';
  return {
    styled_icons: document.getElementById('settingStyledIcons')?.checked ?? true,
    theme: selectedTheme,
    language: document.getElementById('settingLanguage')?.value || 'pt-BR',
    currency: document.getElementById('settingCurrency')?.value || 'BRL',
    profile_public: document.getElementById('settingProfilePublic')?.checked ?? true,
    purchase_history_visible: document.getElementById('settingPurchaseHistory')?.checked ?? false,
    ai_personalization: document.getElementById('settingAiPersonalization')?.checked ?? true,
    share_data_with_partners: document.getElementById('settingPartnerData')?.checked ?? true,
    larger_font: document.getElementById('settingLargerFont')?.checked ?? false,
    high_contrast: document.getElementById('settingHighContrast')?.checked ?? false,
    reduce_animations: document.getElementById('settingReduceAnimations')?.checked ?? false,
    optimize_performance: document.getElementById('settingOptimizePerformance')?.checked ?? false
  };
}

function applySettingsToUI(settings) {
  siteSettings = normalizesiteSettings(settings);
  const setChecked = (id, value) => {
    const el = document.getElementById(id);
    if (el) {
      el.checked = Boolean(value);
    }
  };

  setChecked('settingStyledIcons', siteSettings.styled_icons);
  setChecked('settingProfilePublic', siteSettings.profile_public);
  setChecked('settingPurchaseHistory', siteSettings.purchase_history_visible);
  setChecked('settingAiPersonalization', siteSettings.ai_personalization);
  setChecked('settingPartnerData', siteSettings.share_data_with_partners);
  setChecked('settingLargerFont', siteSettings.larger_font);
  setChecked('settingHighContrast', siteSettings.high_contrast);
  setChecked('settingReduceAnimations', siteSettings.reduce_animations);
  setChecked('settingOptimizePerformance', siteSettings.optimize_performance);
  
  const lang = document.getElementById('settingLanguage');
  if (lang) {
    lang.value = siteSettings.language;
  }

  const currency = document.getElementById('settingCurrency');
  if (currency) {
    currency.value = siteSettings.currency;
  }
  applySavedTheme(siteSettings.theme);
}

async function loadsiteCurrencyRates(currency = siteSettings.currency) {
  if (currency === 'BRL') {
    siteCurrencyRates.BRL = 1;
    return true;
  }

  try {
    const cachedRaw = localStorage.getItem('site_currency_rates');
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      const age = Date.now() - Number(cached.savedAt || 0);

      if (
        age < 6 * 60 * 60 * 1000 &&
        cached.rates &&
        Number(cached.rates.USD) > 0 &&
        Number(cached.rates.EUR) > 0
      ) {
        siteCurrencyRates = cached.rates;
        return Number(
          siteCurrencyRates[currency]
        ) > 0;
      }
    }

  } catch (error) {
    console.warn('Erro ao ler cache das moedas:', error);
  }

  try {
    const response = await fetch('https://api.frankfurter.dev/v2/rates?base=BRL&quotes=USD,EUR');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const rows = await response.json();
    const rates = {
      BRL: 1,
      USD: Number(rows.find(row => row.quote === 'USD')?.rate || 0),
      EUR: Number(rows.find(row => row.quote === 'EUR')?.rate || 0)
    };

    if (!rates.USD || !rates.EUR) {
      throw new Error('Cotação USD/EUR inválida.');
    }

    siteCurrencyRates = rates;
    localStorage.setItem('site_currency_rates', JSON.stringify({ savedAt: Date.now(), rates}));
    return Number(siteCurrencyRates[currency]) > 0;

  } catch (error) {
    console.error('Erro ao carregar cotações:', error);
    return false;
  }
}

function formatsitePrice(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';
  const currency = siteSettings.currency || 'BRL';
  const rate = Number(siteCurrencyRates[currency]);

  if (currency !== 'BRL' && (!Number.isFinite(rate) || rate <= 0)) {
    return '';
  }

  const convertedValue = value * (currency === 'BRL' ? 1 : rate);
  const localeMap = {
    BRL: 'pt-BR',
    USD: 'en-US',
    EUR: 'de-DE'
  };

  return new Intl.NumberFormat(
    localeMap[currency] || 'pt-BR',
    {
      style: 'currency',
      currency: currency
    }
  ).format(convertedValue);
}
window.formatsitePrice = formatsitePrice;

async function loadSavedsiteSettings(accountUserId = null) {
  const localSettings = getStoredsiteSettings();
  siteSettings = normalizesiteSettings(localSettings || DEFAULT_site_SETTINGS);

  if (accountUserId) {
    const {data, error} = await supabaseClient
      .from('user_settings')
      .select('*')
      .eq('user_id', accountUserId)
      .maybeSingle();

    if (error) {
      console.warn('Não foi possível carregar user_settings:', error.message);
    } else if (data) {
      siteSettings = normalizesiteSettings(data);
      cachesiteSettings(siteSettings);
    }
  }

  applySettingsToUI(siteSettings);
  await loadsiteCurrencyRates();
}

async function saveSettings() {
  const saveBtn = document.getElementById('saveSettingsBtn');
  const newSettings = normalizesiteSettings(readSettingsFromUI());

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.style.opacity = '0.65';
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
  }
  
  if (newSettings.currency !== 'BRL') {
    const ratesLoaded = await loadsiteCurrencyRates(newSettings.currency);
    if (!ratesLoaded || !siteCurrencyRates[newSettings.currency]) {
      toast('Não foi possível obter a cotação da moeda agora.', 'err');
      return;
    }
  }

  try {
    let activeUserId = userId;
    if (!activeUserId) {
      const {data: { user }} = await supabaseClient.auth.getUser();
      activeUserId = user?.id || null;
      if (activeUserId) {
        userId = activeUserId;
      }
    }

    siteSettings = newSettings;
    cachesiteSettings(newSettings);
    applySavedTheme(newSettings.theme);

    if (activeUserId) {
      const {error} = await supabaseClient
        .from('user_settings')
        .upsert(
          {
            user_id: activeUserId,
            styled_icons: newSettings.styled_icons,
            theme: newSettings.theme,
            language: newSettings.language,
            currency: newSettings.currency,
            profile_public: newSettings.profile_public,
            purchase_history_visible: newSettings.purchase_history_visible,
            ai_personalization: newSettings.ai_personalization,
            share_data_with_partners: newSettings.share_data_with_partners,
            larger_font: newSettings.larger_font,
            high_contrast: newSettings.high_contrast,
            reduce_animations: newSettings.reduce_animations,
            optimize_performance: newSettings.optimize_performance
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) throw error;
      window.siteLanguage = newSettings.language;
      if (typeof window.siteTranslatePage === 'function') {
        await window.siteTranslatePage(newSettings.language);
      }
      
      toast('Configurações salvas na sua conta! ✓', 'ok');
    } else {
      toast('Configurações salvas neste navegador! ✓', 'ok'
      );
    }

    if (typeof loadWishlist === 'function' && userId) {
      await loadWishlist();
    }

    if (typeof loadCart === 'function' && userId) {
      await loadCart();
    }

    if (typeof renderProducts === 'function') {
      renderProducts();
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    toast('Erro ao salvar configurações: ' + (error.message || 'Erro desconhecido'), 'err');

  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.style.opacity = '1';
      saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar';
    }
  }
}

// -----------------------------------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initThemeToggle();
  const savedSection = localStorage.getItem('site_settings_section');
  if (savedSection) showPanel(savedSection);
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

  if (!user || userError) {
    userId = null;
    await loadSavedsiteSettings(null);
    return;
  }

  userId = user.id;
  await loadSavedsiteSettings(user.id);

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profileError && profile) {
      const fullName = profile.full_name || 'Cliente';
      const email = user.email || '';
      if ($('menuSidebarName')) {
        $('menuSidebarName').textContent = fullName;
      }
      if ($('menuSidebarEmail')) {
        $('menuSidebarEmail').textContent = email;
      }
      if (profile.avatar_url && $('menuSidebarAvatar')) {
        $('menuSidebarAvatar').style.filter = "none";
        $('menuSidebarAvatar').src = profile.avatar_url;
        $('menuSidebarIcon').style.display = "none";
      }
  }
    
/* supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    if (!session) {
      window.location.href = '/login/';
      return;
    }

    const user = session.user;
    userId = user.id;

    // ── NOVIDADE: Buscando os dados direto da tabela 'profiles' ──
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error.message);
      return;
    } */

    const email = user.email || "";
    const fullName = profile.full_name || "Cliente";
    const phone = profile.phone || "";
    
    const cpf = profile.cpf || "";
    const birthDate = profile.birth_date || "";
    const gender = profile.gender || "Selecione uma opção";
    const language = profile.language || "Português (BR)";
    const bio = profile.bio || "";

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";

    const sidebarName = document.getElementById('sidebarName');
    const sidebarEmail = document.getElementById('sidebarEmail');
    if (sidebarName) sidebarName.textContent = fullName;
    if (sidebarEmail) sidebarEmail.textContent = email;

    const inputFirstName = document.getElementById('profileFirstName');
    const inputLastName = document.getElementById('profileLastName');
    const inputEmail = document.getElementById('profileEmail');
    const inputPhone = document.getElementById('profilePhone');
    const photoUrl = profile.avatar_url || "";
      
    const inputCPF = document.getElementById('profileCPF');
    const inputBirth = document.getElementById('profileBirth');
    const inputGender = document.getElementById('profileGender');
    const inputLang = document.getElementById('profileLang');
    const inputBio = document.getElementById('profileBio');

    if (inputFirstName) inputFirstName.value = firstName;
    if (inputLastName) inputLastName.value = lastName;
    if (inputEmail) inputEmail.value = email;

    const securityEmail = document.getElementById('securityEmail');
    if (securityEmail) securityEmail.textContent = email;
  
    if (inputPhone) { inputPhone.value = phone; if (typeof maskPhone === 'function') maskPhone(inputPhone); }
    if (inputCPF) { inputCPF.value = cpf; if (typeof maskCPF === 'function') maskCPF(inputCPF); }
    if (inputBirth) inputBirth.value = birthDate;
    if (inputGender) inputGender.value = gender;
    if (inputLang) inputLang.value = language;
    if (inputBio) inputBio.value = bio;
    fetchAddresses();

    const sessionStillValid = await verifySessionOnLoad();
    if (!sessionStillValid) {
    return;
    }
    await registerCurrentSession();
    await fetchSessions();
    subscribeToSessionChanges();
    startSessionCheck();
    loadWishlist();
    loadCart();
  /*if (event === 'SIGNED_OUT') {
    window.location.href = '/login/';
  }*/

  // ── Renderiza a foto do Google se ela existir ──
  if (photoUrl) {
    const avatarImage = document.getElementById('profileAvatar');
    const sidebarImage = document.getElementById('sidebarAvatar');
    const headerImage = document.getElementById('headerAvatar');
    const menuImage = document.getElementById('menuSidebarAvatar');
    const menuUserIcon = document.getElementById('menuSidebarIcon');
    if (avatarImage) {
      avatarImage.src = photoUrl;
      avatarImage.style.filter = "none";
      avatarImage.style.width = "100%";
      avatarImage.style.height = "100%";
      avatarImage.style.borderRadius = "100%";
      avatarImage.style.objectFit = "cover";
    }
    if (sidebarImage) {
      sidebarImage.src = photoUrl;
      sidebarImage.style.filter = "none";
      sidebarImage.style.width = "100%";
      sidebarImage.style.height = "100%";
      sidebarImage.style.borderRadius = "100%";
      sidebarImage.style.objectFit = "cover";
    }
    if (headerImage) {
      headerImage.src = photoUrl;
      headerImage.style.filter = "none";
      headerImage.style.width = "100%";
      headerImage.style.height = "100%";
      headerImage.style.borderRadius = "100%";
      headerImage.style.objectFit = "cover";
    }
    if (menuImage) {
      menuImage.src = photoUrl;
      menuImage.style.display = "flex"
      menuImage.style.filter = "none";
    }
    if (menuUserIcon) {
      menuUserIcon.style.display = "none"
    }
  }
});

/* ─── MOBILE MENU ────────────────────────────────────────────────── */
function openMenu() {
  const sb = document.getElementById('menuSidebar');
  const ov = document.getElementById('menuOverlay');
  if (sb) sb.classList.add('on');
  if (ov) ov.classList.add('on');
  document.body.classList.add("nobodyscroll");
}

function closeMenu() {
  const sb = document.getElementById('menuSidebar');
  const ov = document.getElementById('menuOverlay');
  if (sb) sb.classList.remove('on');
  if (ov) ov.classList.remove('on');
  document.body.classList.remove("nobodyscroll");
}

// ── FUNÇÃO DE UPLOAD DA FOTO DE PERFIL ─────────────────────
let cropperInstance = null;
let originalFileName = "";

function openCropModal(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast('A imagem deve ter no máximo 5MB ⚠️', 'err');
    event.target.value = '';
    return;
  }

  originalFileName = file.name;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgElement = document.getElementById('imageToCrop');
    imgElement.src = e.target.result;
    document.getElementById('cropModal').classList.add('active');

    if (cropperInstance) cropperInstance.destroy();
    cropperInstance = new Cropper(imgElement, {
      aspectRatio: 1,
      viewMode: 2,
      dragMode: 'move',
      autoCropArea: 1,
      background: false,
    });
  };
  
  reader.readAsDataURL(file);
  event.target.value = '';
}

function closeCropModal() {
  document.getElementById('cropModal').classList.remove('active');
  
  if (cropperInstance) {
    cropperInstance.destroy();
    cropperInstance = null;
  }
}

async function executeCrop() {
  if (!cropperInstance) {
    toast('Erro: O recortador de imagem não foi inicializado corretamente. ⚠️', 'err');
    return;
  }
  toast('Carregando imagem... ⏳', 'info');

  cropperInstance.getCroppedCanvas({
    width: 400,
    height: 400,
    imageSmoothingQuality: 'high'
  }).toBlob(async (blob) => {
    
    if (!blob) {
      toast('Erro ao processar o recorte da imagem.', 'err');
      closeCropModal();
      return;
    }
    closeCropModal();

    try {
      const { data: currentProfile, error: fetchError } = await supabaseClient
        .from('profiles').select('avatar_url').eq('id', userId).single();

      let oldUrl = (!fetchError && currentProfile) ? currentProfile.avatar_url : null;

      const fileExt = originalFileName.split('.').pop() || 'jpg';
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('avatars')
        .upload(fileName, blob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient.storage.from('avatars').getPublicUrl(fileName);
      const publicPhotoUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ avatar_url: publicPhotoUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      if (oldUrl && oldUrl.includes('/avatars/')) {
        const urlParts = oldUrl.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        await supabaseClient.storage.from('avatars').remove([oldFileName]);
      }

      const avatarImage = document.getElementById('profileAvatar');
      const sidebarImage = document.getElementById('sidebarAvatar');
      const headerImage = document.getElementById('headerAvatar');
      const menuImage = document.getElementById('menuSidebarAvatar');
      const menuUserIcon = document.getElementById('menuSidebarIcon');
      
      if (avatarImage) {
        avatarImage.src = publicPhotoUrl;
        avatarImage.style.filter = "none";
        avatarImage.style.width = "100%";
        avatarImage.style.height = "100%";
        avatarImage.style.borderRadius = "100%";
        avatarImage.style.objectFit = "cover";
      }
      if (sidebarImage) {
        sidebarImage.src = publicPhotoUrl;
        sidebarImage.style.filter = "none";
        sidebarImage.style.width = "100%";
        sidebarImage.style.height = "100%";
        sidebarImage.style.borderRadius = "100%";
        sidebarImage.style.objectFit = "cover";
      }
      if (headerImage) {
        headerImage.src = publicPhotoUrl;
        headerImage.style.filter = "none";
        headerImage.style.width = "100%";
        headerImage.style.height = "100%";
        headerImage.style.borderRadius = "100%";
        headerImage.style.objectFit = "cover";
      }
      if (menuImage) {
        menuImage.style.filter = "none";
        menuImage.src = publicPhotoUrl;
        menuImage.style.display = "flex"
      }
      if (menuUserIcon) {
        menuUserIcon.style.display = "none"
      }

      toast('Foto atualizada com sucesso! 🎉', 'ok');

    } catch (error) {
      console.error('Erro no upload:', error.message);
      toast('Erro ao enviar a foto.', 'err');
    }

  }, 'image/jpeg', 0.85);
}
        
// FUNÇÃO SALVAR ATUALIZADA: Faz um UPDATE na tabela 'profiles'
async function saveProfile() {
  if (!userId) return;

  const inputFirstName = document.getElementById('profileFirstName');
  const inputLastName = document.getElementById('profileLastName');
  const inputPhone = document.getElementById('profilePhone');
  
  const inputCPF = document.getElementById('profileCPF');
  const inputBirth = document.getElementById('profileBirth');
  const inputGender = document.getElementById('profileGender');
  const inputLang = document.getElementById('profileLang');
  const inputBio = document.getElementById('profileBio');

  if (!inputFirstName || !inputFirstName.value.trim()) {
    toast('O primeiro nome é obrigatório', 'err');
    return;
  }

  const firstName = inputFirstName.value.trim();
  const lastName = inputLastName ? inputLastName.value.trim() : "";
  const fullName = `${firstName} ${lastName}`.trim();
  
  const phoneRaw = inputPhone ? inputPhone.value.replace(/\D/g, '') : "";
  const cpfRaw = inputCPF ? inputCPF.value.replace(/\D/g, '') : "";
  const birthDate = inputBirth ? inputBirth.value : null;
  const gender = inputGender ? inputGender.value : "";
  const language = inputLang ? inputLang.value : "";
  const bio = inputBio ? inputBio.value.trim() : "";

  toast('Salvando alterações...', 'info');

  // ── ATUALIZANDO NA TABELA 'PROFILES' VIA SQL/API ──
  const { error } = await supabaseClient
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phoneRaw,
      cpf: cpfRaw,
      birth_date: birthDate ? birthDate : null,
      gender: gender,
      language: language,
      bio: bio
    })
    .eq('id', userId);

  if (error) {
    console.error(error);
    toast('Erro ao salvar: ' + error.message, 'err');
  } else {
    toast('Perfil salvo com sucesso! ✓', 'ok');
    
    const sidebarName = document.getElementById('sidebarName');
    if (sidebarName) sidebarName.textContent = fullName;
  }
}

// ── FUNÇÃO PARA REMOVER FOTO (E APAGAR DO SERVIDOR) ──────────
async function removePhoto(event) {
  event.stopPropagation();
  
  if (!userId) return;
  toast('Removendo foto...', 'info');

  try {
    const { data: profile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;
    const oldUrl = profile.avatar_url;

    if (oldUrl) {
      const urlParts = oldUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error: removeError } = await supabaseClient.storage
        .from('avatars')
        .remove([fileName]);

      if (removeError) {
        console.warn("Aviso: Não foi possível apagar o ficheiro do Storage.", removeError.message);
        toast('Algo não está certo.', 'err');
      }
    }

    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId);

    if (updateError) throw updateError;

    const avatarImage = document.getElementById('profileAvatar');
    const sidebarImage = document.getElementById('sidebarAvatar');
    const headerImage = document.getElementById('headerAvatar');
    const menuImage = document.getElementById('menuSidebarAvatar');
    const menuUserIcon = document.getElementById('menuSidebarIcon');
    
    if (avatarImage) {
      avatarImage.src = "/images/icons/full/user.webp";
      avatarImage.style.filter = "var(--img-filter1)";
      avatarImage.style.width = "75%";
      avatarImage.style.height = "auto";
    }
    if (sidebarImage) {
      sidebarImage.src = "/images/icons/full/user.webp";
      sidebarImage.style.filter = "var(--img-filter1)";
      sidebarImage.style.width = "75%";
      sidebarImage.style.height = "auto";
    }
    if (headerImage) {
      headerImage.src = "/images/icons/full/user.webp";
      headerImage.style.filter = "var(--img-filter1)";
      headerImage.style.width = "75%";
      headerImage.style.height = "auto";
    }
    if (menuImage) {
      menuImage.style.filter = "";
      menuImage.src = "";
      menuImage.style.display = "none"
    }
    if (menuUserIcon) {
      menuUserIcon.style.display = "flex"
    }
    toast('Foto de perfil removida com sucesso! 🗑️', 'ok');

  } catch (erro) {
    console.error('Erro ao remover foto:', erro.message);
    toast('Ocorreu um erro ao remover a foto.', 'err');
  }
}

// ── WISHLIST ──────────────────────────────────────────
async function loadWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const countEl = document.getElementById('wishlistCount');
  const sidebarCount = document.getElementById('sWishlistBadge');
  const topButton = document.getElementById('wishTopButton');
  if (!grid || !userId) return;

  try {
    const {
      data: profile,
      error: profileError
    } = await supabaseClient
      .from('profiles')
      .select('fav')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    let fav = profile?.fav || [];
    if (!Array.isArray(fav)) {
      fav = [];
    }

    if (fav.length === 0) {
      grid.innerHTML = `
        <div style="
          grid-column: 1 / -1;
          padding: 50px 20px;
          text-align: center;
          color: var(--muted);
        ">
          <i
            class="fa-regular fa-heart"
            style="font-size:42px;margin-bottom:12px;display:block;"
          ></i>
          <strong style="
            display:block;
            color:var(--text);
            font-size:15px;
            margin-bottom:5px;
          ">
            Sua Lista de Desejos está vazia
          </strong>
          <span style="font-size:12px;">
            Os produtos que você salvar aparecerão aqui.
          </span>
        </div>
      `;
      countEl.textContent = '0 produtos salvos';
      sidebarCount.style.display = "none";
      topButton.style.display = "none";
      sidebarCount.textContent = '0';
      return;
    }

    const productIds = fav
      .map(item => {
        if (typeof item === 'string') {
          return item;
        }
        return item?.id || item?.product_id || item?.productId || null;})
      .filter(Boolean);

    if (productIds.length === 0) {
      throw new Error(
        'A Lista de Desejos não contém IDs de produtos válidos.'
      );
    }

    const {
      data: products,
      error: productsError
    } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) throw productsError;
    const orderedProducts = productIds
      .map(id =>
        products.find(product =>
          String(product.id) === String(id)
        )
      )
      .filter(Boolean);

    sidebarCount.style.display = "block";
    topButton.style.display = "block";
    sidebarCount.textContent = `${orderedProducts.length}`;
    countEl.textContent =
      `${orderedProducts.length} ${
        orderedProducts.length === 1
          ? 'produto salvo'
          : 'produtos salvos'
      }`;

    if (orderedProducts.length === 0) {
      grid.innerHTML = `
        <div style="
          grid-column: 1 / -1;
          padding: 40px;
          text-align:center;
          color:var(--muted);
        ">
          Nenhum produto da sua Lista de Desejos está disponível.
        </div>
      `;
      return;
    }

    grid.innerHTML = orderedProducts
      .map(product => createWishlistCard(product))
      .join('');

  } catch (error) {
    console.error(
      'Erro ao carregar Lista de Desejos:',
      error
    );
    
    countEl.textContent = 'Não foi possível carregar';
    grid.innerHTML = `
      <div style="
        grid-column:1 / -1;
        padding:40px;
        text-align:center;
        color:var(--red);
      ">
        Não foi possível carregar sua Lista de Desejos.
      </div>
    `;
  }
}

function createWishlistCard(product) {
  const name = product.name || product.title || product.nome || 'Produto';
  const category = product.category || product.category_name || product.categoria || 'Produto';
  const price = Number(product.price ?? product.preco ?? 0);
  const oldPrice = Number(product.old_price ?? product.original_price ?? product.compare_at_price ?? 0);
  const image = product.image || product.image_url || product.main_image || product.thumbnail || (Array.isArray(product.images) ? product.images[0] : null);
  const formattedPrice = formatsitePrice(price);
  const formattedOldPrice = oldPrice > price ? formatsitePrice(oldPrice) : '';
  
  return `
    <div class="wcard" onclick="openProduct('${product.id}')" data-product-id="${product.id}">
      <div class="wcard-img">
        ${
          image
            ? `
              <img
                src="${image}"
                alt="${escapeHtml(name)}"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                  display:block;
                "
              >
            `
            : `
              <i
                class="fa-solid fa-image"
                style="font-size:42px;color:var(--muted);"
              ></i>
            `
        }
        <button
          class="wcard-rm"
          onclick="
            event.stopPropagation();
            removeWishlistProduct('${product.id}', '${escapeJs(name)}')
          "
          title="Remover da Lista de Desejos"
        >
          ✕
        </button>
      </div>
      <div class="wcard-info">
        <div class="wcard-cat">
          ${escapeHtml(category)}
        </div>
        <div class="wcard-name">
          ${escapeHtml(name)}
        </div>
        <div>
          <span class="wcard-price">
            ${formattedPrice}
          </span>
          ${
            formattedOldPrice
              ? `
                <span class="wcard-old">
                  ${formattedOldPrice}
                </span>
              `
              : ''
          }
        </div>
      </div>
      <button class="wcard-add" onclick="event.stopPropagation(); addWishlistProductToCart('${product.id}')">
        + Adicionar ao carrinho
      </button>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

async function removeWishlistProduct(productId, productName) {
  if (!userId) {
    toast('Sessão expirada.', 'err');
    return;
  }

  try {
    const {
      data: profile,
      error: profileError
    } = await supabaseClient
      .from('profiles')
      .select('fav')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    let fav = Array.isArray(profile?.fav)
      ? profile.fav
      : [];

    fav = fav.filter(item => {
      const id =
        typeof item === 'string'
          ? item
          : item?.id ||
            item?.product_id ||
            item?.productId;

      return String(id) !== String(productId);
    });

    const {
      error: updateError
    } = await supabaseClient
      .from('profiles')
      .update({
        fav
      })
      .eq('id', userId);

    if (updateError) throw updateError;
    toast(`${productName} removido dos favoritos`, 'ok');
    await loadWishlist();
  } catch (error) {
    console.error('Erro ao remover produto da Lista de Desejos:', error);
    toast('Não foi possível remover o produto.', 'err');
  }
}

// ── CART ──────────────────────────────────────────────
async function loadCart() {
  const grid = document.getElementById('cartGrid');
  const countEl = document.getElementById('cartCount');
  const sidebarCount = document.getElementById('sCartBadge');
  const cTopButton = document.getElementById('cartTopButton');
  if (!grid || !userId) return;

  try {
    const {
      data: profile,
      error: profileError
    } = await supabaseClient
      .from('profiles')
      .select('cart')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    let cart = profile?.cart || [];
    if (!Array.isArray(cart)) {
      cart = [];
    }

    if (cart.length === 0) {
      grid.innerHTML = `
        <div style="
          grid-column: 1 / -1;
          padding: 50px 20px;
          text-align: center;
          color: var(--muted);
        ">
          <i class="fa-solid fa-cart-shopping"
            style="font-size:42px;margin-bottom:12px;display:block;"
          ></i>
          <strong style="
            display:block;
            color:var(--text);
            font-size:15px;
            margin-bottom:5px;
          ">
            Seu Carrinho está vazio
          </strong>
          <span style="font-size:12px;">
            Os produtos que você adicionar aparecerão aqui.
          </span>
        </div>
      `;
      countEl.textContent = '0 produtos salvos';
      sidebarCount.style.display = "none";
      cTopButton.style.display = "none";
      sidebarCount.textContent = '0';
      return;
    }

    const productIds = cart
      .map(item => {
        if (typeof item === 'string') {
          return item;
        }

        return item?.id ||
               item?.product_id ||
               item?.productId ||
               null;
      })
      .filter(Boolean);

    if (productIds.length === 0) {
      throw new Error(
        'O Carrinho não contém IDs de produtos válidos.'
      );
    }

    const {
      data: products,
      error: productsError
    } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) throw productsError;
    const orderedProducts = productIds
      .map(id =>
        products.find(product =>
          String(product.id) === String(id)
        )
      )
      .filter(Boolean);

    sidebarCount.style.display = "block";
    cTopButton.style.display = "block";
    sidebarCount.textContent = `${orderedProducts.length}`;
    countEl.textContent =
      `${orderedProducts.length} ${
        orderedProducts.length === 1
          ? 'produto salvo'
          : 'produtos salvos'
      }`;

    if (orderedProducts.length === 0) {
      grid.innerHTML = `
        <div style="
          grid-column: 1 / -1;
          padding: 40px;
          text-align:center;
          color:var(--muted);
        ">
          Nenhum produto do seu Carrinho está disponível.
        </div>
      `;
      return;
    }

    grid.innerHTML = orderedProducts
      .map(product => createCartCard(product))
      .join('');

  } catch (error) {
    console.error(
      'Erro ao carregar Carrinho:',
      error
    );
    
    countEl.textContent = 'Não foi possível carregar';
    grid.innerHTML = `
      <div style="
        grid-column:1 / -1;
        padding:40px;
        text-align:center;
        color:var(--red);
      ">
        Não foi possível carregar seu Carrinho.
      </div>
    `;
  }
}

function createCartCard(product) {
  const name = product.name || product.title || product.nome || 'Produto';
  const category = Array.isArray(product.cat) ? product.cat.join(', ') : String(product.cat || '');
  const price = Number(product.price ?? product.preco ?? 0);
  const oldPrice = Number(product.old_price ?? product.original_price ?? product.compare_at_price ?? 0);
  const image = product.image || product.image_url || product.main_image || product.thumbnail || (Array.isArray(product.images) ? product.images[0] : null);
  const formattedPrice = formatsitePrice(price);
  const formattedOldPrice = oldPrice > price ? formatsitePrice(oldPrice) : '';

  return `
    <div class="wcard" onclick="openProduct('${product.id}')" data-product-id="${product.id}">
      <div class="wcard-img">
        ${
          image
            ? `
              <img
                src="${image}"
                alt="${escapeHtml(name)}"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                  display:block;
                "
              >
            `
            : `
              <i
                class="fa-solid fa-image"
                style="font-size:42px;color:var(--muted);"
              ></i>
            `
        }
        <button
          class="wcard-rm"
          onclick="
            event.stopPropagation();
            removeCartProduct('${product.id}', '${escapeJs(name)}')
          "
          title="Remover do Carrinho"
        >
          ✕
        </button>
      </div>
      <div class="wcard-info">
        <div class="wcard-cat">
          ${escapeHtml(category)}
        </div>
        <div class="wcard-name">
          ${escapeHtml(name)}
        </div>
        <div>
          <span class="wcard-price">
            ${formattedPrice}
          </span>
          ${
            formattedOldPrice
              ? `
                <span class="wcard-old">
                  ${formattedOldPrice}
                </span>
              `
              : ''
          }
        </div>
      </div>
      <button class="wcard-add" onclick="event.stopPropagation(); buttonLink('/checkout')">
        Comprar agora
      </button>
    </div>
  `;
}

async function removeCartProduct(productId, productName) {
  if (!userId) {
    toast('Sessão expirada.', 'err');
    return;
  }

  try {
    const {
      data: profile,
      error: profileError
    } = await supabaseClient
      .from('profiles')
      .select('cart')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    let cart = Array.isArray(profile?.cart)
      ? profile.cart
      : [];

    cart = cart.filter(item => {
      const id =
        typeof item === 'string'
          ? item
          : item?.id ||
            item?.product_id ||
            item?.productId;

      return String(id) !== String(productId);
    });

    const {
      error: updateError
    } = await supabaseClient
      .from('profiles')
      .update({
        cart
      })
      .eq('id', userId);

    if (updateError) throw updateError;
    toast(`${productName} removido do Carrinho`, 'ok');
    await loadCart();
  } catch (error) {
    console.error('Erro ao remover produto do Carrinho:', error);
    toast('Não foi possível remover o produto.', 'err');
  }
}

// ── SUPABASE: ADDRESSES ───────────────────────────
let currentAddressCount = 0;

async function fetchAddresses() {
  if (!userId) return;

  const { data, error } = await supabaseClient
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar endereços:", error.message);
    return;
  }

  renderAddresses(data);
}

function renderAddresses(addresses) {
  currentAddressCount = addresses.length;
  
  const grid = document.querySelector('.addr-grid');
  if (!grid) return;

  const addCardHtml = `
    <div class="add-card" onclick="openAddressModal()">
      <div class="add-card-ico">📍</div>
      <span>Adicionar novo endereço</span>
    </div>
  `;
  let html = '';

  addresses.forEach(addr => {
    const defaultBadge = addr.is_default ? `<div class="addr-default-badge">🏠 Principal</div>` : '';
    const cardClass = addr.is_default ? 'addr-card default' : 'addr-card';
    const defaultBtn = !addr.is_default ? `<button class="btn-xs blue" onclick="setDefaultAddress('${addr.id}')">⭐ Principal</button>` : '';

    html += `
      <div class="${cardClass}">
        ${defaultBadge}
        <div class="addr-type">${addr.type || 'Casa'}</div>
        <div class="addr-name">${addr.recipient_name}</div>
        <div class="addr-street">
          ${addr.street}, ${addr.number} ${addr.complement ? '- ' + addr.complement : ''}<br>
          ${addr.neighborhood} — ${addr.city}, ${addr.state}<br>
          CEP: ${addr.zip_code}
        </div>
        <div class="addr-actions">
          <button class="btn-xs blue" onclick="editAddress('${addr.id}')">✏️ Editar</button>
          ${defaultBtn}
          <button class="btn-xs gray" onclick="deleteAddress('${addr.id}')">🗑 Excluir</button>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html + addCardHtml;
}

async function setDefaultAddress(addressId) {
  toast('Atualizando...', 'info');

  await supabaseClient
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId);

  const { error } = await supabaseClient
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId);

  if (error) {
    toast('Erro ao atualizar: ' + error.message, 'err');
  } else {
    toast('Definido como principal! ✓', 'ok');
    fetchAddresses();
  }
}

function openAddressModal() {
  if (currentAddressCount >= 5) {
    toast('Limite atingido: Você pode salvar no máximo 5 endereços. ⚠️', 'err');
    return;
  }
  const inputs = ['recipientInp', 'cepInp', 'streetInp', 'numInp', 'compInp', 'neighInp', 'cityInp', 'stateInp'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const modal = document.getElementById('newAddrModal');
  if (modal) modal.classList.add('on');
}

function closeAddressModal() {
  const modal = document.getElementById('newAddrModal');
  if (modal) modal.classList.remove('on');
}
async function fetchCep() {
  const cep = document.getElementById('cepInp').value.replace(/\D/g, '');
  if (cep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        document.getElementById('streetInp').value = data.logradouro;
        document.getElementById('neighInp').value = data.bairro;
        document.getElementById('cityInp').value = data.localidade;
        document.getElementById('stateInp').value = data.uf;
        document.getElementById('numInp').focus();
      }
    } catch (err) {
      console.log('Erro ao buscar CEP', err);
    }
  }
}

async function deleteAddress(addressId) {
  if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

  const { error } = await supabaseClient
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    toast('Erro ao excluir: ' + error.message, 'err');
  } else {
    toast('Endereço excluído', 'ok');
    fetchAddresses();
  }
}

async function submitNewAddress() {
  if (currentAddressCount >= 5) {
    toast('Você já possui 5 endereços cadastrados.', 'err');
    return;
  }

  if (!userId) {
    toast('Sessão expirada. Faça login novamente.', 'err');
    return;
  }

  const cep = document.getElementById('cepInp').value.replace(/\D/g, '');
  const street = document.getElementById('streetInp').value;
  const num = document.getElementById('numInp').value;
  const neigh = document.getElementById('neighInp').value;
  const city = document.getElementById('cityInp').value;
  const state = document.getElementById('stateInp').value;
  
  const recipientName = document.getElementById('recipientInp')?.value || 'Meu Endereço';
  const type = document.getElementById('typeInp')?.value || 'Casa';

  if (!cep || !street || !num || !city) {
    toast('Preencha todos os campos obrigatórios.', 'err');
    return;
  }

  toast('Salvando endereço... ⏳', 'info');

  const { error } = await supabaseClient
    .from('addresses')
    .insert([
      { 
        user_id: userId, 
        type: type,
        recipient_name: recipientName,
        street: street,
        number: num,
        neighborhood: neigh,
        city: city,
        state: state,
        zip_code: cep,
        is_default: currentAddressCount === 0 
      }
    ]);

  if (error) {
    console.error("Erro no insert:", error);
    toast('Erro ao salvar endereço.', 'err');
  } else {
    toast('Endereço salvo com sucesso! 📍', 'ok');
    const formDiv = document.getElementById('newAddrForm');
    if (formDiv) formDiv.classList.remove('on');
    fetchAddresses(); 
    closeAddressModal()
  }
}

// SECURITY SECTION
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Desconhecido";
  let os = "Desconhecido";

  // Browser
  if (/Edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    browser = "Opera";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Firefox";
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = "Samsung Internet";
  } else if (/Chrome\//i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome|Chromium/i.test(ua)) {
    browser = "Safari";
  }

  // OS
  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  return { browser, os };
}

async function registerCurrentSession() {
  if (!userId) return;
  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    console.error('Sessão Auth indisponível:', sessionError);
    return false;
  }

  const session = sessionData.session;
  const { browser, os } = getDeviceInfo();
  let ip = "Desconhecido";

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (res.ok) {
      const data = await res.json();
      ip = data.ip || "Desconhecido";
    }
  } catch (e) {
    console.warn("Não foi possível capturar o IP.");
  }

  let localSessionId = localStorage.getItem('local_session_id');
  if (localSessionId) {
    const { data: existingLocal, error: localError } =
      await supabaseClient
        .from('user_sessions')
        .select('id')
        .eq('id', localSessionId)
        .eq('user_id', userId)
        .maybeSingle();
    
    if (localError || !existingLocal) {
      localStorage.removeItem('local_session_id');
      localSessionId = null;
    }
  }
  if (localSessionId) {
    const { error } = await supabaseClient
      .from('user_sessions')
      .update({
        browser,
        os,
        ip_address: ip,
        last_seen_at: new Date().toISOString()
      })
      .eq('id', localSessionId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao atualizar sessão:', error);
      return false;
    }
    return true;
  }
  const { data, error } = await supabaseClient
    .from('user_sessions')
    .insert([{
      user_id: userId,
      browser,
      os,
      ip_address: ip,
      last_seen_at: new Date().toISOString()
    }])
    .select('id')
    .single();
  
  if (error) {
    console.error('🚨 ERRO AO SALVAR SESSÃO:', error.message);
    return false;
  }
  if (data?.id) {
    localStorage.setItem('local_session_id', data.id);
  }
  return true;
}

async function fetchSessions() {
  if (!userId) return;
  
  const { data: sessions, error } = await supabaseClient
    .from('user_sessions')
    .select(`
      id,
      user_id,
      browser,
      os,
      ip_address,
      created_at,
      last_seen_at
    `)
    .eq('user_id', userId)
    .order('last_seen_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar sessões:", error);
    return;
  }

  const container = document.getElementById('sessionsList');
  if (!container) return;

  const localSessionId = localStorage.getItem('local_session_id');
  let currentSessionHtml = '';
  let otherSessionsHtml = '';

  sessions.forEach(session => {
    const isCurrent = session.id === localSessionId;
    let icon = '💻'; 
    if (session.os.includes('Android') || session.os.includes('iOS')) icon = '📱';
    else if (session.os.includes('macOS')) icon = '🖥️';
    
    const dateSource = session.last_seen_at || session.created_at;
    const dateObj = new Date(dateSource);
    const dateStr =
      dateObj.toLocaleDateString('pt-BR') +
      ' às ' +
      dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

    if (isCurrent) {
      currentSessionHtml += `
        <div class="session-card">
          <div class="session-device">${icon}</div>
          <div class="session-info">
            <strong>${session.browser} · ${session.os}</strong>
            <small>Logado em: ${dateStr} · IP ${session.ip_address || 'Desconhecido'}</small>
          </div>
          <span class="session-curr">Sessão atual</span>
        </div>
      `;
    } 
    else {
      otherSessionsHtml += `
        <div class="session-card">
          <div class="session-device">${icon}</div>
          <div class="session-info">
            <strong>${session.browser} · ${session.os}</strong>
            <small>Logado em: ${dateStr} · IP ${session.ip_address || 'Desconhecido'}</small>
          </div>
          <button class="btn-xs gray" onclick="removeSession('${session.id}')">Encerrar</button>
        </div>
      `;
    }
  });

  if(sessions.length === 0) {
      container.innerHTML = '<div style="font-size: 13px; color: #64748b;">Nenhuma sessão ativa encontrada.</div>';
  } else {
      container.innerHTML = currentSessionHtml + otherSessionsHtml;
  }
}

async function removeSession(sessionId) {
  if (!userId || !sessionId) return;

  const currentSessionId = localStorage.getItem('local_session_id');
  if (sessionId === currentSessionId) {
    toast('Esta é a sessão atual.', 'info');
    return;
  }
  const confirmed = confirm('Tem certeza que deseja encerrar esta sessão?');

  if (!confirmed) return;
  toast('Encerrando sessão...', 'info');
  const { error } = await supabaseClient
    .from('user_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro ao encerrar sessão:', error);
    toast('Erro ao encerrar sessão.', 'err');
    return;
  }
  toast('Sessão encerrada com sucesso.', 'ok');
  await fetchSessions();
}

async function verifySessionOnLoad() {
  const localSessionId = localStorage.getItem('local_session_id');
  if (!localSessionId || !userId) {
    return true;
  }

  const { data, error } = await supabaseClient
    .from('user_sessions')
    .select('id')
    .eq('id', localSessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao verificar sessão:', error);
    return true;
  }
  if (!data) {
    await forceLocalLogout();
    return false;
  }
  return true;
}

let sessionCheckInterval = null;
let sessionCheckRunning = false;
function startSessionCheck() {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
  }

  sessionCheckInterval = setInterval(async () => {
    if (sessionCheckRunning) return;
    sessionCheckRunning = true;
    try {
      const valid = await verifySessionOnLoad();
      if (!valid) {
        stopSessionCheck();
      }
    } catch (error) {
      console.error(
        'Erro na verificação automática da sessão:',
        error
      );
    } finally {
      sessionCheckRunning = false;
    }
  }, 5_000);
}
function stopSessionCheck() {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
  }
}

const waitt2 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function forceLocalLogout() {
  localStorage.removeItem('local_session_id');
  const { error } = await supabaseClient.auth.signOut({
    scope: 'local'
  });

  if (error) {
    console.error('Erro ao encerrar sessão local:', error);
  }

  alert('Sua sessão foi encerrada remotamente por outro dispositivo.');
  await waitt2(1000);
  goToLogin();
}

let intentionalLocalLogout = false;
function subscribeToSessionChanges() {
  if (!userId) return;
  if (sessionsChannel) {
    supabaseClient.removeChannel(sessionsChannel);
    sessionsChannel = null;
  }
  sessionsChannel = supabaseClient
    .channel(`user-sessions-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_sessions',
        filter: `user_id=eq.${userId}`
      },
      async (payload) => {
        if (intentionalLocalLogout) {
          return;
        }
        const localSessionId = localStorage.getItem('local_session_id');
        if (
          payload.eventType === 'DELETE' &&
          payload.old?.id === localSessionId
        ) {
          await forceLocalLogout();
          return;
        }
        await fetchSessions();
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime de sessões conectado.');
      }
      if (status === 'CHANNEL_ERROR') {
        console.error(
          '❌ Erro no Realtime de sessões.'
        );
      }
    });
}

let sessionHeartbeat = null;
async function updateSessionHeartbeat() {
  if (!userId) return;
  const localSessionId = localStorage.getItem('local_session_id');
  if (!localSessionId) return;
  const { error } = await supabaseClient
    .from('user_sessions')
    .update({
      last_seen_at: new Date().toISOString()
    })
    .eq('id', localSessionId)
    .eq('user_id', userId);
  if (error) {
    console.warn(
      'Falha ao atualizar atividade da sessão:',
      error.message
    );
  }
}

function startSessionHeartbeat() {
  if (sessionHeartbeat) {
    clearInterval(sessionHeartbeat);
  }
  updateSessionHeartbeat();
  sessionHeartbeat = setInterval(
    updateSessionHeartbeat,
    60 * 1000
  );
}

// LOGOUT
if (typeof waitt !== 'undefined') {
  const waitt = (ms) => new Promise(resolve => setTimeout(resolve, ms));
}
let sessionsChannel = null;

async function doLogout() {
  if (intentionalLocalLogout) return;
  intentionalLocalLogout = true;
  toast('Saindo da conta... 👋', 'info');
  
  const localSessionId = localStorage.getItem('local_session_id');
  if (localSessionId && userId) {
    const { error } = await supabaseClient
      .from('user_sessions')
      .delete()
      .eq('id', localSessionId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Não foi possível remover o registro da sessão:', error.message);
    }
  }

  localStorage.removeItem('local_session_id');
  const { error: signOutError } =
    await supabaseClient.auth.signOut({
      scope: 'local'
    });
  
  if (signOutError) {
    console.error('Erro ao fazer logout:', signOutError);
  }
  toast('Você saiu da conta.', 'info');
  await waitt(700);
  window.location.reload();
}

// LOGOUT OTHERS DEVICES
async function doOthersLogout() {
  if (!userId) return;
  const confirmed = confirm('Isso encerrará a conta em todos os outros dispositivos. Continuar?');
  
  if (!confirmed) return;
  toast('Saindo da conta em outros dispositivos...', 'info');

  const { error: authError } =
    await supabaseClient.auth.signOut({
      scope: 'others'
    });
  if (authError) {
    console.error('Erro no logout dos outros dispositivos:', authError);
    toast('Erro ao sair de outros dispositivos.', 'err');
    return;
  }

  const localSessionId = localStorage.getItem('local_session_id');
  if (localSessionId) {
    const { error: dbError } =
      await supabaseClient
        .from('user_sessions')
        .delete()
        .eq('user_id', userId)
        .neq('id', localSessionId);

    if (dbError) {
      console.error('Erro ao sincronizar user_sessions:', dbError);
      toast('As sessões foram encerradas, mas houve erro ao atualizar a lista.', 'err');
      await fetchSessions();
      return;
    }
  }
  toast('Logout em outros dispositivos realizado com sucesso!', 'ok');
  await fetchSessions();
}

// -----------------------------------------------------------------------------------

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
      z-index: 9000;
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
    
    /* ── DELETE ACCOUNT MODAL ── */
    .modal-delete-input-wrap {
      margin: 0 0 22px 0;
      text-align: left;
    }

    .modal-delete-input-label {
      display: block;
      margin-bottom: 8px;
      color: var(--text);
      font-family: 'Sora', 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
    }

    .modal-delete-input {
      width: 100%;
      box-sizing: border-box;
      padding: 13px 15px;
      border-radius: 14px;
      border: 1px solid var(--border2);
      outline: none;
      background: var(--surface);
      color: var(--input-text);
      font-family: 'Sora', 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      letter-spacing: 1px;
      transition:
        border-color .2s ease,
        box-shadow .2s ease,
        background .2s ease;
    }

    .modal-delete-input::placeholder {
      color: var(--muted);
      letter-spacing: 0;
      font-weight: 400;
    }

    .modal-delete-input:focus {
      border-color: #eb2525;
      box-shadow: 0 0 0 4px rgba(235,37,37,.10);
    }

    .modal-delete-input.valid {
      border-color: #10B981;
      box-shadow: 0 0 0 4px rgba(16,185,129,.10);
    }

    .modal-delete-input.invalid {
      border-color: #eb2525;
      box-shadow: 0 0 0 4px rgba(235,37,37,.10);
    }

    .modal-delete-hint {
      margin-top: 8px;
      min-height: 18px;
      font-size: 12px;
      text-align: center;
      color: var(--muted);
      transition: color .2s ease;
    }

    .modal-delete-hint.valid {
      color: #10B981;
    }

    .modal-delete-hint.invalid {
      color: #eb2525;
    }

    .btn-alert-delete {
      background: #eb2525;
      color: #fff;
      border: none;
      padding: 11px 24px;
      border-radius: 250px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition:
        background .2s ease,
        transform .2s ease,
        opacity .2s ease;
    }

    .btn-alert-delete:hover:not(:disabled) {
      background: #d81d1d;
      transform: scale(1.05);
    }

    .btn-alert-delete:disabled {
      opacity: .45;
      cursor: not-allowed;
      transform: none;
    }
  `;
  document.head.appendChild(style);
}

// ── DELETE ACCOUNT CONFIRM ──
let deleteAccountConfirmOpen = false;
function showDeleteAccountConfirm() {injectModalStyles();
  let deleteModal = document.getElementById('deleteAccountModal');
  if (!deleteModal) {
    deleteModal = document.createElement('div');
    deleteModal.id = 'deleteAccountModal';
    deleteModal.className = 'modal-alert-container';
    deleteModal.innerHTML = `
      <div class="modal-alert-content">
        <div class="modal-alert-icon">
          ⚠️
        </div>
        <h3 id="deleteAccountTitle">
          Excluir conta permanentemente
        </h3>
        <p id="deleteAccountMsg">
          Esta ação é permanente e não poderá ser desfeita.
          Todos os dados vinculados à sua conta poderão ser
          removidos definitivamente.
        </p>
        <div class="modal-delete-input-wrap">
          <label
            class="modal-delete-input-label"
            for="deleteAccountInput"
          >
            Digite "<strong>DELETE</strong>" para confirmar
          </label>
          <input
            id="deleteAccountInput"
            class="modal-delete-input"
            type="text"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            placeholder="DELETE"
            maxlength="6"
          >
          <div id="deleteAccountHint" class="modal-delete-hint">
            A confirmação diferencia maiúsculas e minúsculas.
          </div>
        </div>
        <div class="modal-alert-buttons">
          <button
            class="btn-alert-cancel"
            type="button"
            onclick="closeDeleteAccountConfirm()"
          >
            Cancelar
          </button>
          
          <button
            class="btn-alert-delete"
            id="btnDeleteAccountConfirm"
            type="button"
            disabled
            onclick="confirmDeleteAccountAction()"
          >
            Excluir conta
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(deleteModal);
    const input = document.getElementById('deleteAccountInput');
    if (input) {
      input.addEventListener(
        'input',
        validateDeleteAccountInput
      );
      input.addEventListener('keydown',
        function (event) {
          if (
            event.key === 'Enter' &&
            input.value === 'DELETE'
          ) {
            confirmDeleteAccountAction();
          }
        }
      );
    }
  }

  const input = document.getElementById('deleteAccountInput');
  const btn = document.getElementById('btnDeleteAccountConfirm');
  const hint = document.getElementById('deleteAccountHint');

  if (input) {
    input.value = '';
    input.classList.remove('valid', 'invalid');
  }

  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.45';
  }

  if (hint) {
    hint.textContent = 'A confirmação diferencia maiúsculas e minúsculas.';
    hint.classList.remove('valid', 'invalid');
  }

  deleteAccountConfirmOpen = true;
  deleteModal.offsetHeight;
  deleteModal.classList.add('active');

  setTimeout(() => {
    input?.focus();
  }, 180);
}

// --------------------------------------

function validateDeleteAccountInput() {
  const input = document.getElementById('deleteAccountInput');
  const btn = document.getElementById('btnDeleteAccountConfirm');
  const hint = document.getElementById('deleteAccountHint');

  if (!input || !btn) return;
  const value = input.value;
  const isValid = value === 'DELETE';
  const hasValue = value.length > 0;

  btn.disabled = !isValid;
  btn.style.opacity = isValid ? '1' : '0.45';

  // ── INPUT ──
  input.classList.remove('valid', 'invalid');
  if (isValid) {
    input.classList.add('valid');
    if (hint) {
      hint.textContent = 'Confirmação válida ✓';
      hint.classList.remove('invalid');
      hint.classList.add('valid');
    }
    return;
  }

  if (hasValue) {
    input.classList.add('invalid');
    if (hint) {
      hint.textContent = 'Digite exatamente "DELETE" para continuar.';
      hint.classList.remove('valid');
      hint.classList.add('invalid');
    }
    return;
  }

  if (hint) {
    hint.textContent = 'A confirmação diferencia maiúsculas e minúsculas.';
    hint.classList.remove(
      'valid',
      'invalid'
    );
  }
}

// --------------------------------------

function closeDeleteAccountConfirm() {
  const deleteModal = document.getElementById('deleteAccountModal');
  if (deleteModal) {
    deleteModal.classList.remove('active');
  }
  
  deleteAccountConfirmOpen = false;
  const input = document.getElementById('deleteAccountInput');

  if (input) {
    input.value = '';
    input.classList.remove(
      'valid',
      'invalid'
    );
  }
}

// -----------------------------------------------------------------------------------

async function confirmDeleteAccountAction() {
  const input = document.getElementById('deleteAccountInput');
  if (!input) return;
  if (input.value !== 'DELETE') {
    validateDeleteAccountInput();
    toast('Digite exatamente "DELETE" para continuar.', 'err');
    return;
  }
  closeDeleteAccountConfirm();

  if (
    typeof deleteAccountPermanently === 'function'
  ) {
    await deleteAccountPermanently();
  } else {
    console.error('deleteAccountPermanently() não foi encontrada.');
    toast('A função de exclusão da conta ainda não está configurada.', 'err');
  }
}

// ───────────────────────────────

let deletingAccount = false;
async function deleteAccountPermanently() {
  if (deletingAccount) return;
  deletingAccount = true;

  try {
    const {
      data: { session },
      error: sessionError
    } = await supabaseClient.auth.getSession();
    
    if (sessionError) {
      throw new Error('Não foi possível verificar sua sessão.');
    }
    if (!session) {
      throw new Error('Sua sessão expirou. Faça login novamente.');
    }

    const deleteBtn = document.getElementById('btnDeleteAccountConfirm');
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.textContent = 'Excluindo...';
      deleteBtn.style.opacity = '0.6';
      deleteBtn.style.cursor = 'not-allowed';
    }
    toast('Excluindo sua conta... ', 'info');
    
    const {
      data,
      error
    } = await supabaseClient.functions.invoke(
      'account-action',
      {
        body: {
          action: 'delete'
        }
      }
    );

    if (error) {
      console.error('Erro na Edge Function:', error);
      let serverMessage = error.message || 'Não foi possível excluir sua conta.';

      if (error.context) {
        try {
          const errorBody = await error.context.json();
          console.error('Log da Edge Function:', errorBody);
          serverMessage =
            errorBody?.error ||
            errorBody?.message ||
            errorBody?.msg ||
            serverMessage;
        } catch (readError) {
          console.warn('Não foi possível ler o corpo do erro da Edge Function:', readError);
        }
      }
      throw new Error(serverMessage);
    }

    if (!data?.success) {
      throw new Error(data?.error || 'A exclusão da conta não foi concluída.');
    }

    localStorage.removeItem('local_session_id');
    sessionStorage.removeItem('remote_logout_notice_shown');
    if (typeof stopSessionCheck === 'function') {
      stopSessionCheck();
    }

    if (
      typeof sessionCheckTimer !== 'undefined' &&
      sessionCheckTimer
    ) {
      clearInterval(sessionCheckTimer);
      sessionCheckTimer = null;
    }

    if (
      typeof sessionHeartbeat !== 'undefined' &&
      sessionHeartbeat
    ) {
      clearInterval(sessionHeartbeat);
      sessionHeartbeat = null;
    }

    const {
      error: signOutError
    } = await supabaseClient.auth.signOut({
      scope: 'local'
    });

    if (signOutError) {
      console.warn('Sessão local já deveria estar encerrada:', signOutError);
    }

    toast('Sua conta foi excluída permanentemente.', 'ok');
    await new Promise(
      resolve => setTimeout(resolve, 900)
    );
    
    window.location.replace('/?account_deleted=1');
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    toast(error.message || 'Não foi possível excluir sua conta.', 'err');
    const deleteBtn = document.getElementById('btnDeleteAccountConfirm');
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Excluir conta';
      deleteBtn.style.opacity = '1';
      deleteBtn.style.cursor = 'pointer';
    }
    deletingAccount = false;
  }
}

// -----------------------------------------------------------------------------------

async function pauseAccount() {
  if (!userId) {
    toast('Sua sessão expirou.', 'err');
    return;
  }

  const confirmed = confirm('Pausar sua conta?\n\n' + 'Você será desconectado e não poderá acessar a conta até reativá-la.');
  if (!confirmed) return;
  toast('Pausando sua conta...', 'info');
  
  try {
    const {
      data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
      toast('Sessão expirada.', 'err');
      return;
    }

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/account-action`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':
            `Bearer ${session.access_token}`,
          'apikey':
            SUPABASE_ANON_KEY
        },
        body: JSON.stringify({action: 'pause'})
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Não foi possível pausar a conta.');
    }
    
    localStorage.removeItem('local_session_id');
    await supabaseClient.auth.signOut({scope: 'local'});
    alert('Sua conta foi pausada com sucesso.');
    window.location.href = '/login';
  } catch (error) {
    console.error('Erro ao pausar conta:',error);
    toast(error.message || 'Não foi possível pausar a conta.', 'err');
  }
}

// -----------------------------------------------------------------------------------

async function exportUserData() {
  if (!userId) {
    toast('Sua sessão expirou. Faça login novamente.', 'err');
    return;
  }
  toast('Preparando seus dados...', 'info');
  try {
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Usuário não encontrado.');
    const {
      data: profile,
      error: profileError
    } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) throw profileError;
    const {
      data: addresses,
      error: addressesError
    } = await supabaseClient
      .from('addresses')
      .select('*')
      .eq('user_id', userId);

    if (addressesError) throw addressesError;
    const {
      data: sessions,
      error: sessionsError
    } = await supabaseClient
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false });

    if (sessionsError) throw sessionsError;
    const fullName = profile?.full_name || '';
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ');

    const exportData = {
      informacoes_exportacao: {
        produto: 'site',
        tipo: 'Exportação dos meus dados',
        versao: 1,
        gerado_em: new Date().toISOString()
      },

      conta: {
        id: user.id,
        email: user.email || null,
        criada_em: user.created_at || null,
        ultimo_login: user.last_sign_in_at || null
      },

      perfil: {
        nome: {
          completo: fullName || null,
          primeiro_nome: firstName || null,
          sobrenome: lastName || null
        },
        telefone: profile?.phone || null,
        cpf: profile?.cpf || null,
        data_nascimento: profile?.birth_date || null,
        genero: profile?.gender || null,
        idioma: profile?.language || null,
        biografia: profile?.bio || null,
      },

      preferencias: {
        idioma: profile?.language || null
      },

      enderecos: (addresses || []).map(address => ({
        id: address.id || null,
        tipo: address.type || null,
        destinatario: address.recipient_name || null,
        endereco: {
          rua: address.street || null,
          numero: address.number || null,
          complemento: address.complement || null,
          bairro: address.neighborhood || null,
          cidade: address.city || null,
          estado: address.state || null,
          cep: address.zip_code || null
        },
        principal: Boolean(address.is_default),
        criado_em: address.created_at || null
      })),

      sessoes: (sessions || []).map(session => ({
        id: session.id || null,
        dispositivo: {
          navegador: session.browser || null,
          sistema: session.os || null
        },
        ip: session.ip_address || null,
        criada_em: session.created_at || null,
        ultimo_acesso: session.last_seen_at || null,
        sessao_atual: session.id === localStorage.getItem('local_session_id')
      }))
    };
    const json = JSON.stringify(exportData, null, 4);
    const blob = new Blob([json], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `meus-dados-site_${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Seus dados foram exportados com sucesso! ✓', 'ok');
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    toast('Não foi possível exportar seus dados.', 'err'
    );
  }
}
  
// ── POP-UP LOGOUT ───────────────────────────────────────────────────────
if (typeof confirmRedTimerId !== 'undefined') {
  let confirmRedTimerId = null;
}

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

/* ----------------------------------------------------- */
function openConfirmLogout() {
  closeMenu();
  showConfirmRed('Tem certeza que quer sair? <br>Suas informações não serão perdidas.', 'Sair da Conta', '<i class="fa-solid fa-right-from-bracket"></i>');
}
