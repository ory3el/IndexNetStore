/* ============================================================
   L'Evoo — /login page logic
   Demo-mode auth: loginUser() / registerUser() / forgotPassword()
   are isolated on purpose so they can be swapped for real API
   calls later without touching any other function here.
   ============================================================ */

const redirectTarget = new URLSearchParams(window.location.search).get('redirect') || '/';

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

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

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
