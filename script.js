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

const products = [
  {id:1,name:"Lip Luster Lip Gloss",price:36.99,category:"Beleza",isNew:true,grad:"url(#g1)",description:"Gloss labial de longa duração com acabamento espelhado e fórmula não pegajosa."},
  {id:2,name:"Chinelo Nuvem Fashion Sport",price:49.75,category:"Calçados",isNew:false,grad:"url(#g2)",description:"Conforto tipo nuvem para o dia a dia, leve e antiderrapante."},
  {id:3,name:"Hand Grip Ajustável",price:59.75,category:"Fitness",isNew:true,grad:"url(#g3)",description:"Fortalecimento de mãos e antebraços com resistência ajustável de 10 a 40kg."},
  {id:4,name:"Coconut Slippers Cloud",price:67.50,category:"Calçados",isNew:false,grad:"url(#g1)",description:"Pantufa macia inspirada em coco, ideal para relaxar em casa."},
  {id:5,name:"Water-Resistant Cap",price:109.99,category:"Acessórios",isNew:true,grad:"url(#g2)",description:"Boné resistente à água com aba curva e ajuste traseiro."},
  {id:6,name:"Camisa Masculina Slim",price:91.25,category:"Vestuário",isNew:false,grad:"url(#g3)",description:"Corte slim, tecido leve e respirável para qualquer ocasião."},
];
let cart = [];
const fmt = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

function renderGrid(){
  document.getElementById('grid').innerHTML = products.map(p=>`
    <div class="card fade show" onclick="openModal(${p.id})">
      <div class="thumb" style="--grad:${p.grad}">${p.isNew?'<span class="badge">Novo</span>':''}</div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-price">${fmt(p.price)}</div>
        <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id},1)">Adicionar ao Carrinho</button>
      </div>
    </div>`).join('');
}

function addToCart(id,qty){
  const p = products.find(x=>x.id===id);
  const line = cart.find(x=>x.id===id);
  if(line){ line.qty += qty; } else { cart.push({...p,qty}); }
  updateCart();
  showToast('Produto adicionado ao carrinho');
}
function changeQty(id,delta){
  const line = cart.find(x=>x.id===id);
  if(!line) return;
  line.qty += delta;
  if(line.qty<=0) cart = cart.filter(x=>x.id!==id);
  updateCart();
}
function updateCart(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('drawerItems').innerHTML = cart.length ? cart.map(i=>`
    <div class="ci">
      <div class="sw" style="background:${i.grad.replace('url(#','linear-gradient(135deg,var(--c1),var(--c4)) /*').replace(')','*/')}"></div>
      <div class="ci-info">
        <div class="n">${i.name}</div>
        <div class="p">${fmt(i.price)}</div>
        <div class="qty">
          <button onclick="changeQty(${i.id},-1)" aria-label="Diminuir">−</button>
          <span>${i.qty}</span>
          <button onclick="changeQty(${i.id},1)" aria-label="Aumentar">+</button>
        </div>
      </div>
    </div>`).join('') : '<p style="color:var(--muted);font-size:14px;padding:30px 0;text-align:center">Seu carrinho está vazio.</p>';
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('subtotal').textContent = fmt(subtotal);
  document.getElementById('total').textContent = fmt(subtotal);
}
function openCart(){ document.getElementById('drawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); }
function closeCart(){ document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }
function checkout(){ showToast('Pedido em andamento — fluxo de demonstração'); }

function openModal(id){
  const p = products.find(x=>x.id===id);
  document.getElementById('modalBox').innerHTML = `
    <div class="modal-img" style="background:linear-gradient(135deg,var(--c1),var(--c3),var(--c4))">
      ${p.isNew?'<span class="badge">Novo</span>':''}
    </div>
    <div class="modal-body">
      <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">${p.category}</div>
      <h3 style="font-size:22px;margin:8px 0 10px">${p.name}</h3>
      <div style="color:var(--c2);font-weight:800;font-size:18px">${fmt(p.price)}</div>
      <p style="color:var(--muted);font-size:14px;line-height:1.6;margin-top:14px">${p.description}</p>
      <div class="qsel">
        <button onclick="modalQty(-1)" aria-label="Diminuir">−</button>
        <span id="modalQtyVal">1</span>
        <button onclick="modalQty(1)" aria-label="Aumentar">+</button>
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center" onclick="addFromModal(${p.id})">Adicionar ao Carrinho</button>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
}
let modalQtyN = 1;
function modalQty(d){ modalQtyN = Math.max(1, modalQtyN+d); document.getElementById('modalQtyVal').textContent = modalQtyN; }
function addFromModal(id){ addToCart(id, modalQtyN); modalQtyN=1; closeModal(); }
function closeModal(){ document.getElementById('modalOverlay').classList.remove('open'); modalQtyN=1; }

function toggleMenu(){ document.getElementById('mmenu').classList.toggle('open'); }

let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'),2200);
}

renderGrid();
updateCart();

const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); });
},{threshold:.15});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));
