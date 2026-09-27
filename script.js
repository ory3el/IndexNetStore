// ============================================================

/*const products = [
  {id:1,name:"Lip Luster Lip Gloss",price:36.99,category:"Beleza",isNew:true,grad:"url(#g1)",description:"Gloss labial de longa duração com acabamento espelhado e fórmula não pegajosa."},
  {id:2,name:"Chinelo Nuvem Fashion Sport",price:49.75,category:"Calçados",isNew:false,grad:"url(#g2)",description:"Conforto tipo nuvem para o dia a dia, leve e antiderrapante."},
  {id:3,name:"Hand Grip Ajustável",price:59.75,category:"Fitness",isNew:true,grad:"url(#g3)",description:"Fortalecimento de mãos e antebraços com resistência ajustável de 10 a 40kg."},
  {id:4,name:"Coconut Slippers Cloud",price:67.50,category:"Calçados",isNew:false,grad:"url(#g1)",description:"Pantufa macia inspirada em coco, ideal para relaxar em casa."},
  {id:5,name:"Water-Resistant Cap",price:109.99,category:"Acessórios",isNew:true,grad:"url(#g2)",description:"Boné resistente à água com aba curva e ajuste traseiro."},
  {id:6,name:"Camisa Masculina Slim",price:91.25,category:"Vestuário",isNew:false,grad:"url(#g3)",description:"Corte slim, tecido leve e respirável para qualquer ocasião."},
];
let cart = [];
const fmt = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});*/

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
renderGrid();

const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); });
},{threshold:.15});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));
