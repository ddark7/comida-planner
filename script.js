// script.js

// ===== 1) Llaves de localStorage =====
const LS_CAT_KEY    = "categorias_platos";
const LS_PLATOS_KEY = "platos";
const LS_PREF_KEY   = "preferencias_semanales";
const LS_HIST_KEY   = "historial_menus";
const LS_REC_KEY    = "recetas";

// ===== 2) Valores preestablecidos =====
const CATEGORIAS_PRE = ["Legumbres","Pasta","Verduras","Patatas","Arroz","Carne","Pescado","Huevos","Sopas"];
const PLATOS_PRE = [
  { nombre: "Ensalada de garbanzos", tipo: "Legumbres" },
  { nombre: "Judías con bacalao", tipo: "Legumbres" },
  { nombre: "Macarrones a la boloñesa", tipo: "Pasta" },
  { nombre: "Espaguetis a la carbonara", tipo: "Pasta" },
  { nombre: "Judías verdes guisadas", tipo: "Verduras" },
  { nombre: "Patatas con pavo", tipo: "Patatas" },
  { nombre: "Patatas con cabeza de costilla", tipo: "Patatas" },
  { nombre: "Arroz a la cubana", tipo: "Arroz" },
  { nombre: "Arroz blanco", tipo: "Arroz" },
  { nombre: "Paella", tipo: "Arroz" },
  { nombre: "Pollo a la plancha", tipo: "Carne" },
  { nombre: "Salmón al horno", tipo: "Pescado" },
  { nombre: "Tortilla de patatas", tipo: "Huevos" },
  { nombre: "Sopa de verduras", tipo: "Sopas" }
];
const RECETAS_PRE = [
  {
    nombre: "Ensalada de garbanzos",
    ingredientes: ["Garbanzos cocidos","Tomate","Pepino","Cebolla","Aceite de oliva","Sal","Pimienta"],
    pasos: [
      "Escurre y enjuaga los garbanzos cocidos.",
      "Corta tomate, pepino y cebolla en cubos pequeños.",
      "En un bol, mezcla garbanzos y verduras.",
      "Añade aceite, sal y pimienta al gusto.",
      "Sirve fría."
    ]
  },
  {
    nombre: "Macarrones a la boloñesa",
    ingredientes: ["Macarrones","Carne picada","Tomate triturado","Cebolla","Aceite","Sal","Pimienta"],
    pasos: [
      "Cuece los macarrones según indicaciones.",
      "Sofríe cebolla y ajo, añade carne hasta dorar.",
      "Incorpora tomate y condimenta, cocina 15 min.",
      "Mezcla con los macarrones y sirve."  
    ]
  }
  // ... añada más recetas si desea
];

// ===== 3) Datos en memoria =====
let categorias = [];
let platos = [];
let preferencias = {};
let historial = [];
let recetas = [];

// ===== 4) Inicio =====
document.addEventListener("DOMContentLoaded", () => {
  initData();
  applyTheme();
  renderAll();

  document.getElementById("form-agregar-categoria").addEventListener("submit", addCategoria);
  document.getElementById("form-agregar-plato").addEventListener("submit", addPlato);
  document.getElementById("btn-guardar-preferencias").addEventListener("click", savePreferencias);
  document.getElementById("btn-generar-menu").addEventListener("click", generateMenu);
  document.getElementById("btn-toggle-tema").addEventListener("click", toggleTheme);
});

// ================================
// Inicialización y guardado
// ================================
function initData() {
  categorias = JSON.parse(localStorage.getItem(LS_CAT_KEY)) || [...CATEGORIAS_PRE];
  platos = JSON.parse(localStorage.getItem(LS_PLATOS_KEY)) || [...PLATOS_PRE];
  preferencias = JSON.parse(localStorage.getItem(LS_PREF_KEY)) || {};
  historial = JSON.parse(localStorage.getItem(LS_HIST_KEY)) || [];
  recetas = JSON.parse(localStorage.getItem(LS_REC_KEY)) || [...RECETAS_PRE];
  saveData();
}

function saveData() {
  localStorage.setItem(LS_CAT_KEY, JSON.stringify(categorias));
  localStorage.setItem(LS_PLATOS_KEY, JSON.stringify(platos));
  localStorage.setItem(LS_PREF_KEY, JSON.stringify(preferencias));
  localStorage.setItem(LS_HIST_KEY, JSON.stringify(historial));
  localStorage.setItem(LS_REC_KEY, JSON.stringify(recetas));
}

// ================================
// Renderizado General
// ================================
function renderAll() {
  renderCategorias();
  renderPlatos();
  renderPreferencias();
  renderRecetas();
  renderHistorial();
  clearMenu();
}

// ================================
// Categorías
// ================================
function renderCategorias() {
  const ul = document.getElementById("lista-categorias"); ul.innerHTML = '';
  const select = document.getElementById("select-categoria-plato"); select.innerHTML = '<option value="">— Elige…</option>';
  categorias.forEach((cat,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${cat}</span> <button aria-label="Eliminar categoría ${cat}">✕</button>`;
    li.querySelector('button').onclick = ()=>{ categorias.splice(i,1); saveData(); renderAll(); };
    ul.appendChild(li);
    const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat;
    select.appendChild(opt);
  });
}
function addCategoria(e) {
  e.preventDefault();
  const val = e.target['input-nueva-categoria'].value.trim();
  if (val && !categorias.includes(val)) {
    categorias.push(val);
    saveData(); renderAll();
  }
  e.target.reset();
}

// ================================
// Platos
// ================================
function renderPlatos() {
  const ul=document.getElementById("lista-platos"); ul.innerHTML='';
  platos.forEach((p,i)=>{
    const li=document.createElement('li');
    li.innerHTML = `<span>${p.nombre} <em>(${p.tipo})</em></span> <button aria-label="Eliminar plato ${p.nombre}">✕</button>`;
    li.querySelector('button').onclick = ()=>{ platos.splice(i,1); saveData(); renderAll(); };
    ul.appendChild(li);
  });
}
function addPlato(e) {
  e.preventDefault();
  const nom = e.target['input-nombre-plato'].value.trim();
  const tip = e.target['select-categoria-plato'].value;
  if (nom && tip) {
    platos.push({ nombre: nom, tipo: tip });
    saveData(); renderAll();
  }
  e.target.reset();
}

// ================================
// Preferencias
// ================================
function renderPreferencias() {
  const f = document.getElementById('form-preferencias'); f.innerHTML = '';
  ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'].forEach(d=>{
    const div = document.createElement('div');
    div.className = 'bloque-dia';
    const lbl = document.createElement('label'); lbl.textContent = capitalize(d);
    const sel = document.createElement('select'); sel.id = `pref-${d}`;
    sel.innerHTML = '<option value="">— Elige categoría —</option>';
    categorias.forEach(c=>{
      const o = document.createElement('option'); o.value=c; o.textContent=c;
      if (preferencias[d]===c) o.selected=true;
      sel.appendChild(o);
    });
    div.append(lbl, sel); f.appendChild(div);
  });
}
function savePreferencias() {
  ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'].forEach(d=>{
    preferencias[d] = document.getElementById(`pref-${d}`).value;
  });
  saveData();
  alert('Preferencias guardadas.');
}

// ================================
// Generar Menú Semanal
// ================================
function generateMenu() {
  const spinner = document.getElementById('spinner'); if (spinner) spinner.classList.remove('oculto');
  const dias = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
  const byTipo = {};
  categorias.forEach(cat=> byTipo[cat] = platos.filter(p=>p.tipo===cat));
  const plan = dias.map(d=>{
    const tipo = preferencias[d];
    const arr = byTipo[tipo] || [];
    return { d: d, t: arr.length ? arr[Math.floor(Math.random()*arr.length)].nombre : '—', cat: tipo };
  });
  historial.push({ fecha: new Date().toLocaleDateString(), plan });
  saveData();
  setTimeout(()=>{ renderMenu(plan); renderHistorial(); if(spinner) spinner.classList.add('oculto'); }, 300);
}
function renderMenu(plan) {
  const sec = document.getElementById('seccion-resultado'); sec.classList.remove('oculto');
  const tb = document.querySelector('#tabla-menu tbody'); tb.innerHTML = '';
  plan.forEach(item=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${capitalize(item.d)}</td>
      <td>${item.t}</td>
      <td><span class="chip ${item.cat.toLowerCase()}">${capitalize(item.cat)}</span></td>
    `;
    tb.appendChild(tr);
  });
}
function clearMenu() {
  document.getElementById('seccion-resultado').classList.add('oculto');
  document.querySelector('#tabla-menu tbody').innerHTML = '';
}

// ================================
// Historial
// ================================
function renderHistorial() {
  const div = document.getElementById('historial-menus'); div.innerHTML = '';
  if (!historial.length) return;
  historial.slice().reverse().forEach(h=>{
    const det = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = h.fecha;
    const ul = document.createElement('ul');
    h.plan.forEach(x=>{
      const li = document.createElement('li'); li.textContent = `${capitalize(x.d)}: ${x.t}`;
      ul.appendChild(li);
    });
    det.append(summary, ul);
    div.appendChild(det);
  });
  document.getElementById('seccion-historial').classList.remove('oculto');
}

// ================================
// Recetas
// ================================
function renderRecetas() {
  const div = document.getElementById('lista-recetas'); div.innerHTML='';
  recetas.forEach(r=>{
    const c = document.createElement('div'); c.className='rec-card';
    c.innerHTML = `
      <h3>${r.nombre}</h3>
      <h4>Ingredientes:</h4><ul>${r.ingredientes.map(i=>`<li>${i}</li>`).join('')}</ul>
      <h4>Pasos:</h4><ol>${r.pasos.map(p=>`<li>${p}</li>`).join('')}</ol>
    `;
    div.appendChild(c);
  });
}

// ================================
// Helpers
// ================================
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function toggleTheme() {
  const link = document.getElementById('theme-style');
  const next = link.href.includes('dark') ? 'styles.css' : 'styles-dark.css';
  link.href = next;
  localStorage.setItem('tema', next);
}
function applyTheme() {
  const tema = localStorage.getItem('tema');
  if (tema) document.getElementById('theme-style').href = tema;
}
