window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectParam = urlParams.get('redirect');
  
  if (redirectParam) {
    localStorage.setItem('page_redirect_url', redirectParam);
  }
});

// ── NAV ──
function buttonLink(url) {
  window.location.href = url;
}

// ── GOOGLE SIGN-IN ───────────────────────────────────────────

const GOOGLE_CLIENT_ID = '920873776103-cob19kmeoj7m43q7uve98j5vmbgqais5.apps.googleusercontent.com';
let googleCredentialPending = null;
let googleAccountPending = null;
let googleModalResolver = null;

// -------------------------------

let currentNonce = '';
function generateNonce() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, c => c.toString(16).padStart(2, '0')).join('');
}

// -------------------------------

let googleReady = false;
let isInitializingGoogle = false;

async function initGoogleIdentity() {
  if (
    typeof google === 'undefined' ||
    !google.accounts ||
    !google.accounts.id
  ) {
    return false;
  }
  if (googleReady) return true;
  if (isInitializingGoogle) return false;
  
  isInitializingGoogle = true;

  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
      use_fedcm_for_prompt: true
    });
    
    googleReady = true;
    return true;
  } finally {
    isInitializingGoogle = false;
  }
}

// -------------------------------

const selectWait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function startGoogleLogin() {
  const ready = await initGoogleIdentity();
  showLoadingModal('Um Momento...', 'Carregando Login com o Google');
  if (!ready) {
    toast('O login do Google ainda está carregando.', 'err');
    return;
  }

  google.accounts.id.prompt(notification => {
    console.log('Google Prompt Notification:', notification);
    const credentialPickerContainer = document.getElementById('credential_picker_container');
    credentialPickerContainer.style.setProperty("z-index", "850000", "important");
    
    if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
      const reason = notification.getNotDisplayedReason?.() || notification.getSkippedReason?.();
      console.warn('One Tap não exibido pelo motivo:', reason);
      triggerGooglePopupFallback();
    }
  });
  await selectWait(5000);
  hideLoadingModal();
  showLoadingModal('Selecione uma Conta', 'Selecione uma conta Google para continuar');
}

// ---------------------------------------

function triggerGooglePopupFallback() {
  supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname + window.location.search,
      queryParams: {
        prompt: 'select_account'
      }
    }
  });
}

// -------------------------------

function waitForGoogleIdentity() {
  return new Promise(resolve => {
    if (
      typeof google !== 'undefined' &&
      google.accounts?.id
    ) {
      resolve(initGoogleIdentity());
      return;
    }
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (
        typeof google !== 'undefined' &&
        google.accounts?.id
      ) {
        clearInterval(timer);
        resolve(initGoogleIdentity());
        return;
      }
      if (tries >= 100) {
        clearInterval(timer);
        resolve(false);
      }
    }, 100);
  });
}

// ------------------------------------------------

async function handleGoogleCredential(response) {
  if (!response?.credential) {
    toast('Não foi possível obter a conta do Google.', 'err');
    return;
  }
  try {
    hideLoadingModal();
    showLoadingModal('Verificando conta...', 'Estamos verificando sua conta do Google');
    const result = await verifyGoogleAccount(response.credential);
    hideLoadingModal();
    if (!result) return;
    if (result.exists) {
      await loginExistingGoogleAccount(
        response.credential
      );
      return;
    }

    googleCredentialPending = response.credential;
    googleAccountPending = result.account;
    await showGoogleAccountConfirmation(
      result.account
    );

  } catch (error) {
    console.error('Erro no Google Login:', error);
    hideLoadingModal();
    toast(error.message || 'Não foi possível verificar a conta do Google.', 'err');
  }
}

// ------------------------------------------------

async function verifyGoogleAccount(credential) {
  const {
    data,
    error
  } = await supabaseClient.functions.invoke('google-account-check',
    {
      body: {
        credential
      }
    }
  );

  if (error) {
    console.error('Erro ao verificar Google:', error);
    let message = error.message;
    if (error.context) {
      try {
        const body = await error.context.json();
        console.error('Resposta da Edge Function:', body
        );
        message = body?.error || body?.message || message;
      } catch {}

    }
    throw new Error(message);
  }
  if (!data?.success) {
    throw new Error(data?.error || 'Não foi possível verificar a conta.');
  }
  return data;
}

// ----------------------------------------------

function showGoogleAccountConfirmation(account) {
  createGoogleConfirmModal();
  const overlay = document.getElementById('googleConfirmOverlay');
  const avatar = document.getElementById('googleConfirmAvatar');
  const name = document.getElementById('googleConfirmName');
  const surname = document.getElementById('googleConfirmSurname');
  const email = document.getElementById('googleConfirmEmail');
  const phone = document.getElementById('googleConfirmPhone');
  const birth = document.getElementById('googleConfirmBirth');
  const gender = document.getElementById('googleConfirmGender');
  avatar.src = account.picture || '/images/icons/full/user.webp';
  name.value = account.given_name || '';
  surname.value = account.family_name || '';
  email.value = account.email || '';
  phone.value = account.phone_number || '';
  birth.value = '';
  gender.value = '';
  overlay.classList.add('active');
  return new Promise(resolve => {
    googleModalResolver = resolve;
  });
}

// ------------------------------------------------

function createGoogleConfirmModal() {
  if (document.getElementById('googleConfirmOverlay')
  ) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'googleConfirmOverlay';
  overlay.className = 'google-confirm-overlay';
  overlay.innerHTML = `
    <div class="google-confirm-modal">
      <div class="google-confirm-head">
        <div class="google-confirm-avatar">
          <img
            id="googleConfirmAvatar"
            src="/images/icons/full/user.webp"
            alt="Foto da conta Google"
          >
        </div>
        <h3>
          Confirme sua conta
        </h3>
        <p>
          Verifique os dados da conta Google
          antes de criar sua conta na Ecomme.
        </p>
      </div>
      <div class="google-confirm-grid">
        <div class="google-confirm-field">
          <label>
            Nome
            <span class="google-confirm-required">*</span>
          </label>
          <input
            id="googleConfirmName"
            class="google-confirm-input"
            type="text"
            maxlength="100"
            autocomplete="given-name"
          >
        </div>
        <div class="google-confirm-field">
          <label>
            Sobrenome
          </label>
          <input
            id="googleConfirmSurname"
            class="google-confirm-input"
            type="text"
            maxlength="100"
            autocomplete="family-name"
          >
        </div>
        <div class="google-confirm-field full">
          <label>
            E-mail
          </label>
          <input
            id="googleConfirmEmail"
            class="google-confirm-input"
            type="email"
            readonly
            tabindex="-1"
          >
        </div>
        <div class="google-confirm-field full">
          <label>
            Telefone
          </label>
          <input
            id="googleConfirmPhone"
            class="google-confirm-input"
            type="tel"
            placeholder="(00) 00000-0000"
            maxlength="15"
            oninput="maskPhone(this)"
          >
        </div>
        <div class="google-confirm-field">
          <label>
            Data de nascimento
          </label>
          <input
            id="googleConfirmBirth"
            class="google-confirm-input"
            type="date"
          >

        </div>
        <div class="google-confirm-field">
          <label>
            Gênero
          </label>
          <select
            id="googleConfirmGender"
            class="google-confirm-input"
          >
            <option value="">
              Prefiro não informar
            </option>
            <option value="Masculino">
              Masculino
            </option>
            <option value="Feminino">
              Feminino
            </option>
            <option value="Outro">
              Outro
            </option>
          </select>
        </div>
      </div>
      <div class="google-confirm-actions">
        <button
          type="button"
          class="google-confirm-btn google-confirm-cancel"
          onclick="cancelGoogleAccountCreation()"
        >
          Cancelar
        </button>
        
        <button
          type="button"
          id="googleConfirmContinue"
          class="google-confirm-btn google-confirm-continue"
          onclick="confirmGoogleAccountCreation()"
        >
          Continuar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// --------------------------------------

function cancelGoogleAccountCreation() {
  googleCredentialPending = null;
  googleAccountPending = null;
  const overlay = document.getElementById('googleConfirmOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  if (googleModalResolver) {
    googleModalResolver(false);
    googleModalResolver = null;
  }
}

// -----------------------------------------------

async function confirmGoogleAccountCreation() {
  if (!googleCredentialPending) {
    toast('A sessão do Google expirou. Tente novamente.', 'err'
    );
    return;
  }
  const nameInput = document.getElementById('googleConfirmName');
  const surnameInput = document.getElementById('googleConfirmSurname');
  const phoneInput = document.getElementById('googleConfirmPhone');
  const birthInput = document.getElementById('googleConfirmBirth');
  const genderInput = document.getElementById('googleConfirmGender');
  const btn = document.getElementById('googleConfirmContinue');
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const phone = phoneInput.value.replace(/\D/g, '');
  const birthDate = birthInput.value || null;
  const gender = genderInput.value || null;
  if (!name) {
    nameInput.focus();
    toast('Digite seu nome para continuar.', 'err');
    return;
  }

  btn.classList.add('loading');
  btn.textContent = 'Criando conta...';

  try {
    const { data, error } = await supabaseClient.auth.signInWithIdToken({
      provider: 'google', 
      token: googleCredentialPending
    });
    
    if (error) {
      throw error;
    }
    if (!data?.user) {
      throw new Error('Não foi possível criar sua conta.');
    }
    const fullName = `${name} ${surname}`.trim();

    console.log('Dados que serão salvos no perfil:', {
      userId: data.user.id,
      full_name: fullName,
      phone: phone || null,
      birth_date: birthDate,
      gender: gender
    });
    
    const { error: profileError } =
      await supabaseClient
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
          birth_date: birthDate,
          gender: gender
        })
        .eq('id', data.user.id);

    if (profileError) {
      console.error('Erro real ao salvar profiles:', profileError);
      throw new Error(`A conta foi criada, mas os dados não foram salvos: ${profileError.message}`);
    }
    
    googleCredentialPending = null;
    googleAccountPending = null;

    const overlay = document.getElementById('googleConfirmOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }

    if (googleModalResolver) {
      googleModalResolver(true);
      googleModalResolver = null;
    }
    
    sessionStorage.removeItem('remote_logout_notice_shown');
    toast('Conta criada com sucesso! 🎉');
    setTimeout(() => {
      window.location.href = getTargetUrl();
    }, 1000);
  } catch (error) {
    console.error('Erro ao criar conta Google:', error);
    toast(error.message || 'Não foi possível criar a conta.', 'err');
    btn.classList.remove('loading');
    btn.textContent = 'Continuar';
  }
}

// ---------------------------------------

async function loginExistingGoogleAccount(credential, account) {
  hideLoadingModal();
  showLoadingModal('Entrando...', 'Verificando sua conta');
  try {
    const { data, error } = await supabaseClient.auth.signInWithIdToken({
      provider: 'google', 
      token: credential
    });
    
    if (!error && data?.session) return;
    console.error('Erro no signInWithIdToken:', error);
    if (
      error &&
      (
        error.code === 'user_already_exists' ||
        error.code === 'email_exists' ||
        error.message ?.toLowerCase().includes('already exists')
      )
    ) {
      hideLoadingModal();
      const {data: oauthData, error: oauthError} =
        await supabaseClient.auth
          .signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + window.location.pathname + window.location.search,
              queryParams: {login_hint: account?.email || ''}
            }
          });

      if (oauthError) throw oauthError;
      return;
    }
    throw error;
  } catch (error) {
    hideLoadingModal();
    console.error('Erro no login Google:', error);

    let message = error?.message || 'Não foi possível entrar com o Google.';
    if (error?.code === 'identity_already_exists') {
      message = 'Essa conta Google já está vinculada a outro usuário na TheBay.';
    }
    else if (error?.code === 'email_not_confirmed') {
      message = 'O e-mail dessa conta ainda não foi confirmado.';
    }
    else if (error?.code === 'user_already_exists') {
      message = 'Já existe uma conta na TheBay com esse e-mail.';
    }
    toast(message, 'err');
  }
}

// ── SOCIAL LOGIN (GOOGLE & FACEBOOK - SUPABASE) ──────────
async function socialLogin(provider) {
  //toast(`Redirecionando para o ${provider}...`);
  showLoadingModal('Redirecionando...', `Carregando o login com o ${provider}`);
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: window.location.origin + window.location.pathname + window.location.search 
    }
  });
  if (error) {
    console.error(error);
    requestAnimationFrame(() => {setTimeout(() => {hideLoadingModal();}, 180);});
    toast(`Erro ao conectar com ${provider}.`, 'err');
  }
}

// ── PAUSED ACCOUNT ─────────────────────────────────────────────
let pausedAccountModalOpen = false;
let pausedAccountChecking = false;

function createPausedAccountModal() {
  if (document.getElementById('pausedAccountOverlay')) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'pausedAccountOverlay';
  overlay.className = 'paused-account-overlay';
  overlay.innerHTML = `
    <div class="paused-account-modal">
      <div class="paused-account-icon">
        <i class="fa-solid fa-pause"></i>
      </div>
      <h3>Conta pausada</h3>
      <p>
        Sua conta atualmente está desativada.
        Deseja reativá-la agora para continuar
        acessando sua conta?
      </p>
      <div class="paused-account-actions">

        <button
          type="button"
          class="paused-account-btn secondary"
          id="btnKeepPaused"
          onclick="keepAccountPaused()"
        >
          Manter desativada
        </button>

        <button
          type="button"
          class="paused-account-btn primary"
          id="btnReactivateAccount"
          onclick="reactivateAccount()"
        >
          Reativar conta
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function showPausedAccountModal() {
  createPausedAccountModal();
  const overlay = document.getElementById('pausedAccountOverlay');
  if (!overlay) {
    return Promise.resolve(false);
  }
  pausedAccountModalOpen = true;
  overlay.classList.add('active');
  return new Promise(resolve => {
    overlay._resolveDecision = resolve;
  });
}

function closePausedAccountModal() {
  const overlay = document.getElementById('pausedAccountOverlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  pausedAccountModalOpen = false;
}

async function keepAccountPaused() {
  const overlay = document.getElementById('pausedAccountOverlay');
  const resolve = overlay?._resolveDecision;
  closePausedAccountModal();
  if (resolve) {
    overlay._resolveDecision = null;
    resolve(false);
  }
}

async function reactivateAccount() {
  if (pausedAccountChecking) return;
  pausedAccountChecking = true;
  const btn = document.getElementById('btnReactivateAccount');
  const otherBtn = document.getElementById('btnKeepPaused');

  if (btn) {
    btn.classList.add('loading');
    btn.textContent = 'Reativando...';
  }
  if (otherBtn) {
    otherBtn.disabled = true;
  }

  try {
    const {
      data: { session },
      error: sessionError
    } = await supabaseClient.auth.getSession();
    if (sessionError || !session?.user?.id) {
      throw new Error( 'Sua sessão expirou. Faça login novamente.');
    }

    const { error } =
      await supabaseClient
        .from('profiles')
        .update({
          account_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

    if (error) {
      console.error('Erro ao reativar conta:', error
      );
      throw new Error('Não foi possível reativar sua conta.'
      );
    }

    const overlay = document.getElementById('pausedAccountOverlay');
    const resolve = overlay?._resolveDecision;
    closePausedAccountModal();
    if (resolve) {
      overlay._resolveDecision = null;
      resolve(true);
    }
  } catch (error) {
    console.error('Erro ao reativar conta:', error);
    toast(error.message || 'Não foi possível reativar sua conta.', 'err');

    if (btn) {
      btn.classList.remove('loading');
      btn.textContent = 'Reativar conta';
    }
    if (otherBtn) {
      otherBtn.disabled = false;
    }
    pausedAccountChecking = false;
    return false;
  }
}


async function checkPausedAccount(user) {
  if (!user?.id) {
    return false;
  }
  try {
    const {
      data: profile,
      error
    } = await supabaseClient
      .from('profiles')
      .select('account_status')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar status da conta:', error);
      return true;
    }
    const status = profile?.account_status || 'active';
    if (status !== 'paused') {
      return true;
    }

    const shouldReactivate = await showPausedAccountModal();
    if (!shouldReactivate) {
      await supabaseClient.auth.signOut({
        scope: 'local'
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao verificar conta pausada:', error);
    toast('Não foi possível verificar o status da sua conta.', 'err');
    return false;
  }
}

// ── LOCK VARIABLE ──
let redirectionInProgress = false;

// ── DEVICE REGISTER ──────────────────────
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

async function registerNewSession(userId) {
  if (!userId) return;

  let localSessionId = localStorage.getItem('local_session_id');
  if (localSessionId) {
    const { data: existingSession, error } =
      await supabaseClient
        .from('user_sessions')
        .select('id')
        .eq('id', localSessionId)
        .eq('user_id', userId)
        .maybeSingle();
    
    if (!existingSession || error) {
      localStorage.removeItem('local_session_id');
      localSessionId = null;
    }
  }
  const { browser, os } = getDeviceInfo();
  let ip = "Desconhecido";
  try {
    const res = await fetch(
      'https://api.ipify.org?format=json'
    );
    if (res.ok) {
      const data = await res.json();
      ip = data.ip || "Desconhecido";
    }
  } catch (e) {
    console.warn(
      "Não foi possível capturar o IP."
    );
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
      console.error(
        'Erro ao atualizar sessão:',
        error
      );
    }
    return;
  }
  const { data, error } =
    await supabaseClient
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
    console.error(
      '🚨 ERRO AO SALVAR SESSÃO:',
      error.message
    );
    return;
  }
  if (data?.id) {
    localStorage.setItem(
      'local_session_id',
      data.id
    );
  }
}

// ── ACTIVE SESSION & URL CLEAR ────────────
supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (!session || redirectionInProgress) {
      return;
    }
    redirectionInProgress = true;
    try {
      const canContinue = await checkPausedAccount(session.user);
      if (!canContinue) {
        redirectionInProgress = false;
        return;
      }
      sessionStorage.removeItem('remote_logout_notice_shown');
      await registerNewSession(session.user.id);
      const finalDestination = getTargetUrl();
      if (
        window.location.search || window.location.hash
      ) {
        window.history.replaceState(
          {},
          document.title, window.location.pathname
        );
      }

      localStorage.removeItem('page_redirect_url');
      if (
        document.getElementById('formLogin')
      ) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            hideLoadingModal();
          }, 180);
        });
        toast('Sessão ativa! Redirecionando... 🎉');
        setTimeout(() => {
          window.location.href = finalDestination;
        }, 1200);
      }
    } catch (error) {
      console.error('Erro após autenticação:', error);
      redirectionInProgress = false;
      toast('Não foi possível concluir o login.', 'err');
    }
  }
);

// ── REDIRECT FUNCTION ──
function getTargetUrl() {
  const storedRedirect = localStorage.getItem('page_redirect_url');
  if (storedRedirect) {
    return storedRedirect;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const urlRedirect = urlParams.get('redirect');
  if (urlRedirect) {
    return urlRedirect;
  }
  return '/';
}

/* ---------- API stubs (replace body with real fetch() calls) ---------- */
function loginUser({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.toLowerCase() === 'erro@levoo.com') {
        reject({ field: 'loginPassword', message: 'Senha incorreta.' });
      } else {
        resolve({ user: { email } });
      }
    }, 900);
  });
}
function registerUser({ name, email, password, phone }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.toLowerCase() === 'ja-existe@levoo.com') {
        reject({ field: 'regEmail', message: 'Este e-mail já está cadastrado.' });
      } else {
        resolve({ user: { name, email, phone } });
      }
    }, 1000);
  });
}
function forgotPassword({ email }) {
  return new Promise((resolve) => { setTimeout(() => resolve({ sent: true }), 900); });
}

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2200);
}*/

// ── TOAST ──────────────────────────────────────────────────
function toast(msg, type='ok'){
  const t  = document.getElementById('toast1');
  const ic = document.getElementById('toastIco');
  const tx = document.getElementById('toastMsg');
  if(!t || !ic || !tx) return;
  tx.textContent = msg;
  ic.className = 'toast-ico ' + type;
  ic.textContent = type === 'ok' ? '✓' : '!';
  t.classList.add('on');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('on'), 10000);
}

function showToast(msg) {
  toast(msg, type='ok');
}

// --------------------------------------------------

function setFieldError(inputId, errId, message) {
  const input = $(inputId), err = $(errId);
  if (message) {
    input.classList.add('err');
    err.textContent = message;
    err.classList.add('show');
  } else {
    input.classList.remove('err');
    err.classList.remove('show');
  }
}

function togglePw(inputId, btn) {
  const input = $(inputId);
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  btn.innerHTML = show
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3l18 18M10.6 10.7a3 3 0 004.1 4.1M6.1 6.4C3.7 8 2 12 2 12s4 7 11 7c1.8 0 3.4-.4 4.8-1.1M17.9 17.9C20.4 16.2 22 12 22 12s-1.4-2.6-3.8-4.5"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
}

/* ---------- tabs / mode switching ---------- */
function setMode(mode) {
  ['Login', 'Register', 'Forgot'].forEach((m) => $('panel' + m).classList.remove('active'));
  $('panel' + mode[0].toUpperCase() + mode.slice(1)).classList.add('active');

  const isTabbed = mode === 'login' || mode === 'register';
  document.querySelector('.auth-tabs').style.display = isTabbed ? 'flex' : 'none';
  $('tabLogin').classList.toggle('active', mode === 'login');
  $('tabRegister').classList.toggle('active', mode === 'register');
  $('tabLogin').setAttribute('aria-selected', mode === 'login');
  $('tabRegister').setAttribute('aria-selected', mode === 'register');
}

/* ---------- password strength ---------- */
function onPwInput() {
  const pw = $('regPassword').value;
  const reqs = { reqLen: pw.length >= 8, reqUpper: /[A-Z]/.test(pw), reqNum: /[0-9]/.test(pw) };
  let score = 0;
  Object.entries(reqs).forEach(([id, ok]) => {
    $(id).classList.toggle('ok', ok);
    if (ok) score++;
  });
  const bar = $('pwMeterBar');
  const widths = [0, 34, 67, 100];
  const colors = ['#E5E7EB', '#F3C969', '#8FD39A', '#4E8F5B'];
  bar.style.width = widths[score] + '%';
  bar.style.background = colors[score];
  return score;
}

/* ---------- validation ---------- */
function validateLogin() {
  let ok = true;
  const email = $('loginEmail').value.trim();
  const pw = $('loginPassword').value;
  if (!email) { setFieldError('loginEmail', 'loginEmailErr', 'Este campo é obrigatório.'); ok = false; }
  else if (!emailRe.test(email)) { setFieldError('loginEmail', 'loginEmailErr', 'Digite um e-mail válido.'); ok = false; }
  else setFieldError('loginEmail', 'loginEmailErr', '');
  if (!pw) { setFieldError('loginPassword', 'loginPasswordErr', 'Este campo é obrigatório.'); ok = false; }
  else setFieldError('loginPassword', 'loginPasswordErr', '');
  return ok;
}

function validateRegister() {
  let ok = true;
  const name = $('regName').value.trim();
  const email = $('regEmail').value.trim();
  const pw = $('regPassword').value;
  const confirm = $('regConfirm').value;

  if (!name) { setFieldError('regName', 'regNameErr', 'Este campo é obrigatório.'); ok = false; }
  else setFieldError('regName', 'regNameErr', '');

  if (!email) { setFieldError('regEmail', 'regEmailErr', 'Este campo é obrigatório.'); ok = false; }
  else if (!emailRe.test(email)) { setFieldError('regEmail', 'regEmailErr', 'Digite um e-mail válido.'); ok = false; }
  else setFieldError('regEmail', 'regEmailErr', '');

  const score = onPwInput();
  if (score < 3) { setFieldError('regPassword', 'regPasswordErr', 'A senha não atende aos requisitos mínimos.'); ok = false; }
  else setFieldError('regPassword', 'regPasswordErr', '');

  if (confirm !== pw || !confirm) { setFieldError('regConfirm', 'regConfirmErr', 'As senhas não coincidem.'); ok = false; }
  else setFieldError('regConfirm', 'regConfirmErr', '');

  const termsErr = $('regTermsErr');
  if (!$('regTerms').checked) { termsErr.classList.add('show'); ok = false; }
  else termsErr.classList.remove('show');

  return ok;
}

function validateForgot() {
  const email = $('forgotEmail').value.trim();
  if (!email) { setFieldError('forgotEmail', 'forgotEmailErr', 'Este campo é obrigatório.'); return false; }
  if (!emailRe.test(email)) { setFieldError('forgotEmail', 'forgotEmailErr', 'Digite um e-mail válido.'); return false; }
  setFieldError('forgotEmail', 'forgotEmailErr', '');
  return true;
}

/* ---------- submit handlers ---------- */
function setLoading(btnId, loading) {
  const btn = $(btnId);
  btn.disabled = loading;
  btn.classList.toggle('loading', loading);
}

$('formLogin').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateLogin()) return;
  setLoading('btnLogin', true);
  $('btnLogin').querySelector('.lbl').textContent = 'Entrando...';
  loginUser({ email: $('loginEmail').value.trim(), password: $('loginPassword').value })
    .then(() => {
      if ($('remember').checked) localStorage.setItem('levoo_remember_email', $('loginEmail').value.trim());
      else localStorage.removeItem('levoo_remember_email');
      $('loginSuccess').classList.add('show');
      setTimeout(() => { window.location.href = redirectTarget; }, 900);
    })
    .catch((err) => {
      setLoading('btnLogin', false);
      $('btnLogin').querySelector('.lbl').textContent = 'Entrar';
      setFieldError(err.field, err.field + 'Err', err.message);
      showToast(err.message);
    });
});

$('formRegister').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateRegister()) return;
  setLoading('btnRegister', true);
  $('btnRegister').querySelector('.lbl').textContent = 'Criando conta...';
  registerUser({
    name: $('regName').value.trim(),
    email: $('regEmail').value.trim(),
    password: $('regPassword').value,
    phone: $('regPhone').value.trim(),
  })
    .then(() => {
      $('registerSuccess').classList.add('show');
      setTimeout(() => { window.location.href = redirectTarget; }, 900);
    })
    .catch((err) => {
      setLoading('btnRegister', false);
      $('btnRegister').querySelector('.lbl').textContent = 'Criar conta';
      setFieldError(err.field, err.field + 'Err', err.message);
      showToast(err.message);
    });
});

$('formForgot').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForgot()) return;
  setLoading('btnForgot', true);
  $('btnForgot').querySelector('.lbl').textContent = 'Enviando...';
  forgotPassword({ email: $('forgotEmail').value.trim() }).then(() => {
    setLoading('btnForgot', false);
    $('btnForgot').querySelector('.lbl').textContent = 'Enviar instruções';
    $('forgotSuccess').classList.add('show');
    showToast('Instruções enviadas para o seu e-mail');
  });
});

/* ---------- init ---------- */
(function init() {
  const remembered = localStorage.getItem('levoo_remember_email');
  if (remembered) { $('loginEmail').value = remembered; $('remember').checked = true; }
})();

// ── STYLES INJECTOR ──
function injectModalStyles() {
  if (document.getElementById('modal-loading-styles')) return;

  const style = document.createElement('style');
  style.id = 'modal-loading-styles';
  style.textContent = `
.loading-modal-container {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 25000;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.loading-modal-container.active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.loading-modal-content {
  background: var(--sidebar-bg);
  /*backdrop-filter: blur(18px);*/
  /*-webkit-backdrop-filter: blur(18px);*/
  width: min(90%, 380px);
  padding: 30px 28px;
  border-radius: 36px;
  text-align: center;
  box-shadow: var(--box-shdw);
  transform: scale(0.82);
  transition: transform .35s cubic-bezier(.22,1,.36,1);}
  
.loading-modal-container.active
.loading-modal-content {transform: scale(1);}

.loading-modal-spinner {
  width: 44px;
  height: 44px;
  margin: 0 auto 18px;
  border-radius: 50%;
  border: 4px solid var(--black);
  border-top-color: #2563EB;
  animation: loadingSpin .8s linear infinite;
}

.loading-modal-title {
  margin: 0;
  font-family: 'Sora', 'Poppins', sans-serif;
  color: var(--text);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
}

.loading-modal-message {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
}
@keyframes loadingSpin {to {transform:rotate(360deg);}}
@media (prefers-reduced-motion: reduce) {
  .loading-modal-content {transition: none;}
  .loading-modal-spinner {animation: none;}
  }
  `;
  document.head.appendChild(style);
}

// ── LOADING MODAL ──
function showLoadingModal(title, message) {
  injectModalStyles();
  
  let modal = document.getElementById('loadingModal');
  if (!modal) {modal = document.createElement('div');
    modal.id = 'loadingModal';
    modal.className = 'loading-modal-container';
    modal.innerHTML = `<div class="loading-modal-content">
        <div class="loading-modal-spinner" aria-hidden="true"></div>
        <h3 class="loading-modal-title" id="loadingModalTitle">
          ${title}
        </h3>
        <p class="loading-modal-message" id="loadingModalMessage">
          ${message}
        </p>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    document.getElementById('loadingModalTitle').textContent = title;
    document.getElementById('loadingModalMessage').textContent = message;}

  modal.offsetHeight;
  modal.classList.add('active');
  document.body.classList.add('nobodyscroll');
}

// ============================================================
function hideLoadingModal() {
  const modal = document.getElementById('loadingModal');
  if (!modal) {return;}
  modal.classList.remove('active');
  document.body.classList.remove('nobodyscroll');
}
