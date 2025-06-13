// script.js mejorado para ÑAM - Planificador Semanal

(() => {
  // ===== Llaves de localStorage con prefijo =====
  const PREFIX       = 'ÑAM-';
  const LS_KEYS = {
    CATEGORIES: PREFIX + 'categories',
    DISHES:     PREFIX + 'dishes',
    PREFS:      PREFIX + 'preferences',
    HISTORY:    PREFIX + 'history',
    LAST_MENU:  PREFIX + 'lastMenu'
  };

  // ===== Datos en memoria =====
  let categories  = [];
  let dishes      = [];
  let preferences = {};
  let historyMenu = [];

  // ===== Datos preestablecidos =====
  const DEFAULT_CATEGORIES = ['legumbres','pasta','verduras','patatas','arroz'];
  const DEFAULT_DISHES = [
    {name: 'Ensalada de garbanzos', category: 'legumbres'},
    {name: 'Judías con bacalao',   category: 'legumbres'},
    {name: 'Macarrones a la boloñesa', category: 'pasta'},
    {name: 'Espaguetis a la carbonara', category: 'pasta'},
    {name: 'Judías verdes guisadas',    category: 'verduras'},
    {name: 'Patatas con pavo',           category: 'patatas'},
    {name: 'Patatas con cabeza de costilla', category: 'patatas'},
    {name: 'Arroz a la cubana', category: 'arroz'},
    {name: 'Arroz blanco',      category: 'arroz'},
    {name: 'Paella',            category: 'arroz'}
  ];

  const RECETAS_PRE = [
    {
      nombre: "Ensalada de garbanzos",
      ingredientes: ["Garbanzos cocidos","Tomate","Pepino","Cebolla","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Escurre y enjuaga los garbanzos cocidos.",
        "Corta tomate, pepino y cebolla en cubos pequeños.",
        "En un bol grande, mezcla los garbanzos con las verduras.",
        "Añade aceite de oliva, sal y pimienta al gusto, y mezcla bien.",
        "Sirve fría o a temperatura ambiente."
      ]
    },
    {
      nombre: "Judías con bacalao",
      ingredientes: ["Judías blancas","Bacalao desalado","Ajo","Pimentón dulce","Aceite de oliva","Sal"],
      pasos: [
        "Escurre las judías blancas cocidas.",
        "En una sartén, sofríe ajo picado en aceite hasta que esté dorado.",
        "Añade bacalao desmigado y cocínalo un par de minutos.",
        "Espolvorea pimentón dulce y mezcla rápido para que no se queme.",
        "Incorpora las judías blancas y calienta todo junto unos minutos.",
        "Ajusta de sal si es necesario y sirve caliente."
      ]
    },
    {
      nombre: "Macarrones a la boloñesa",
      ingredientes: ["Macarrones","Carne picada","Tomate triturado","Cebolla","Ajo","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Cuece los macarrones en agua con sal según indicaciones del paquete.",
        "En una sartén con aceite, sofríe cebolla y ajo picados hasta que estén dorados.",
        "Añade la carne picada y cocina hasta que cambie de color.",
        "Vierte el tomate triturado, sal y pimienta, y deja cocer a fuego medio 15 minutos.",
        "Escurre los macarrones y mézclalos con la salsa boloñesa.",
        "Sirve caliente y, si quieres, espolvorea queso rallado."
      ]
    },
    {
      nombre: "Espaguetis a la carbonara",
      ingredientes: ["Espaguetis","Bacon","Huevos","Queso parmesano rallado","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Cuece los espaguetis en agua con sal hasta que estén al dente.",
        "En una sartén, dora el bacon cortado en tiras con un poco de aceite.",
        "En un bol, bate los huevos con el queso parmesano y una pizca de pimienta.",
        "Escurre los espaguetis y resérvalos.",
        "Apaga el fuego del bacon, añade los espaguetis a la sartén y mezcla rápido.",
        "Vierte la mezcla de huevo y queso, removiendo fuera del fuego para que no se cuajen demasiado.",
        "Sirve al momento con más queso y pimienta si lo deseas."
      ]
    },
    {
      nombre: "Judías verdes guisadas",
      ingredientes: ["Judías verdes frescas","Ajo","Tomate","Zanahoria","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Lava y corta las judías verdes en trozos de unos 4 cm.",
        "Corta zanahoria en rodajas finas.",
        "Sofríe ajo picado en aceite hasta que esté dorado.",
        "Añade tomate rallado y deja cocinar unos minutos.",
        "Incorpora las judías y la zanahoria, cubre con agua, sal y pimienta.",
        "Cuece a fuego medio 20-25 minutos hasta que las judías estén tiernas.",
        "Sirve caliente."
      ]
    },
    {
      nombre: "Patatas con pavo",
      ingredientes: ["Patatas","Filetes de pavo","Cebolla","Ajo","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Pela y corta las patatas en cubos medianos.",
        "En una sartén, dora ajo y cebolla picados en aceite.",
        "Añade las patatas y sofríe unos minutos.",
        "Agrega agua hasta cubrir y salpimienta. Cuece 15-20 minutos hasta que estén tiernas.",
        "En otra sartén, cocina los filetes de pavo a la plancha con un poco de sal y pimienta.",
        "Sirve las patatas acompañadas del pavo."
      ]
    },
    {
      nombre: "Patatas con cabeza de costilla",
      ingredientes: ["Patatas","Cabeza de costilla (trozos)","Cebolla","Ajo","Pimentón dulce","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Pela y corta las patatas en trozos medianos.",
        "En una olla, sofríe ajo y cebolla picados en aceite.",
        "Añade la cabeza de costilla y dora ligeramente.",
        "Incorpora las patatas, el pimentón y mezcla bien.",
        "Cubre con agua o caldo, sazona y cuece a fuego medio 30 minutos.",
        "Sirve caliente."
      ]
    },
    {
      nombre: "Arroz a la cubana",
      ingredientes: ["Arroz","Plátano","Tomate triturado","Ajo","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "Cuece el arroz en agua con sal y escurre.",
        "Fríe el plátano en rodajas con un poco de aceite hasta que esté dorado.",
        "En otra sartén, sofríe ajo picado en aceite y añade tomate triturado, sal y pimienta. Cocina 10 minutos.",
        "Sirve el arroz con el tomate frito y el plátano por encima."
      ]
    },
    {
      nombre: "Arroz blanco",
      ingredientes: ["Arroz","Agua","Aceite de oliva","Sal"],
      pasos: [
        "Mide una taza de arroz y dos de agua.",
        "En una olla con aceite caliente, sofríe brevemente el arroz.",
        "Añade el agua y sal al gusto. Lleva a ebullición.",
        "Baja el fuego, tapa y cocina 12-15 minutos hasta que el agua se absorba.",
        "Apaga y deja reposar 5 minutos antes de servir."
      ]
    },
    {
      nombre: "Paella",
      ingredientes: ["Arroz bomba","Azafrán","Caldo","Mariscos","Pollo","Pimiento rojo","Ajo","Aceite de oliva","Sal","Pimienta"],
      pasos: [
        "En una paellera con aceite, dora trozos de pollo y reserva.",
        "Sofríe ajo picado y tira de pimiento en tiras.",
        "Añade arroz y remueve para que se impregne de aceite.",
        "Vierte caldo caliente con azafrán, sal y pimienta.",
        "Coloca el pollo, mariscos y pimiento en la superficie.",
        "Cocina sin remover a fuego medio 18-20 minutos hasta que el arroz esté tierno.",
        "Deja reposar 5 minutos antes de servir."
      ]
    }
  ];

  // ===== DOM Elements =====
  const el = {
    formCat: document.getElementById('form-agregar-categoria'),
    inputCat: document.getElementById('input-nueva-categoria'),
    chipsCat: document.getElementById('chips-categorias'),
    formDish: document.getElementById('form-agregar-plato'),
    inputDish: document.getElementById('input-nombre-plato'),
    inputDishCat: document.getElementById('input-tipo-plato'),
    chipsDish: document.getElementById('chips-platos'),
    prefsGrid: document.querySelector('#seccion-preferencias .grid-griddias'),
    btnSavePrefs: document.getElementById('btn-guardar-preferencias'),
    genSection: document.getElementById('seccion-generar'),
    btnGenerate: document.getElementById('btn-generar-menu'),
    recipesContainer: document.getElementById('lista-recetas'),
    historyContainer: document.getElementById('historial-menus'),
    resultSection: document.getElementById('seccion-resultado'),
    menuTable: document.getElementById('tabla-menu').querySelector('tbody')
  };

  // ===== Inicialización =====
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    buildIncludeDinnerCheckbox();
    renderAll();
    attachEventListeners();
  });

  function loadData() {
    categories  = JSON.parse(localStorage.getItem(LS_KEYS.CATEGORIES)) || DEFAULT_CATEGORIES.slice();
    dishes      = JSON.parse(localStorage.getItem(LS_KEYS.DISHES))    || DEFAULT_DISHES.slice();
    preferences = JSON.parse(localStorage.getItem(LS_KEYS.PREFS))     || {};
    historyMenu = JSON.parse(localStorage.getItem(LS_KEYS.HISTORY))   || [];
  }

  function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

  function renderAll() {
    renderCategories(); renderDishes(); renderPreferencesForm(); renderRecipes(); renderHistory(); hide(el.resultSection);
  }

  // ===== Categorías =====
  function renderCategories() { el.chipsCat.innerHTML = ''; categories.forEach(cat => el.chipsCat.appendChild(createChip(cat, () => removeCategory(cat)))); }
  function addCategory(ev) { ev.preventDefault(); const v = el.inputCat.value.trim().toLowerCase(); if(v&&!categories.includes(v)){ categories.push(v); save(LS_KEYS.CATEGORIES,categories); renderCategories(); } el.inputCat.value=''; }
  function removeCategory(cat){ categories=categories.filter(c=>c!==cat); dishes=dishes.filter(d=>d.category!==cat); save(LS_KEYS.CATEGORIES,categories); save(LS_KEYS.DISHES,dishes); renderAll(); }

  // ===== Platos =====
  function renderDishes(){ el.chipsDish.innerHTML=''; dishes.forEach(d=>el.chipsDish.appendChild(createChip(d.name,()=>removeDish(d.name)))); }
  function addDish(ev){ ev.preventDefault(); const name=el.inputDish.value.trim(),cat=el.inputDishCat.value.trim().toLowerCase(); if(name&&cat){ dishes.push({name,category:cat}); save(LS_KEYS.DISHES,dishes); renderDishes(); } el.inputDish.value=''; el.inputDishCat.value=''; }
  function removeDish(n){ dishes=dishes.filter(d=>d.name!==n); save(LS_KEYS.DISHES,dishes); renderDishes(); }

  // ===== Preferencias =====
  function renderPreferencesForm(){ const days=['lunes','martes','miércoles','jueves','viernes','sábado','domingo']; el.prefsGrid.innerHTML=''; days.forEach(day=>{ const b=document.createElement('div'); b.classList.add('bloque-dia'); const l=document.createElement('div'); l.classList.add('dia-label'); l.textContent=capitalize(day); const c=createSelect(day,'comida'); const e=createSelect(day,'cena'); b.append(l,c,e); el.prefsGrid.appendChild(b);} ); }
  function createSelect(day,m){ const s=document.createElement('select'); s.dataset.day=day; s.dataset.meal=m; s.innerHTML=`<option value="">— ${m} —</option>`; categories.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=capitalize(c); if(preferences[day]?.[m]===c)o.selected=true; s.appendChild(o);} ); s.addEventListener('change',()=>{ preferences[day]=preferences[day]||{}; preferences[day][m]=s.value; save(LS_KEYS.PREFS,preferences); }); return s; }
// Dentro de tu script.js…

// ===== Preferencias mejoradas =====
function renderPreferencesForm() {
  const days = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
  el.prefsGrid.innerHTML = '';

  days.forEach(day => {
    const dayBlock = document.createElement('div');
    dayBlock.classList.add('bloque-dia');

    // Cabecera del día (pulsable para desplegar)
    const header = document.createElement('div');
    header.classList.add('dia-label');
    header.textContent = capitalize(day);
    header.addEventListener('click', () => {
      dayBlock.classList.toggle('expandido');
    });

    // Contenedor de selects
    const selectsContainer = document.createElement('div');
    selectsContainer.classList.add('selects-container');

    const comidaSelect = createSelect(day, 'comida');
    const cenaSelect = createSelect(day, 'cena');

    selectsContainer.appendChild(comidaSelect);
    selectsContainer.appendChild(cenaSelect);

    dayBlock.appendChild(header);
    dayBlock.appendChild(selectsContainer);
    el.prefsGrid.appendChild(dayBlock);
  });
}


  // ===== Generar Menú =====
  function buildIncludeDinnerCheckbox(){ const chk=document.createElement('input'); chk.type='checkbox'; chk.id='chk-include-dinner'; chk.checked=true; const lbl=document.createElement('label'); lbl.htmlFor=chk.id; lbl.textContent=' Incluir cenas'; el.genSection.insertBefore(chk,el.btnGenerate); el.genSection.insertBefore(lbl,el.btnGenerate); el.chkIncludeDinner=chk; }
  function generateMenu(ev){ ev.preventDefault(); const includeDinner=el.chkIncludeDinner.checked; const days=['lunes','martes','miércoles','jueves','viernes','sábado','domingo']; const lastUsed=JSON.parse(localStorage.getItem(LS_KEYS.LAST_MENU))||[]; let thisWeek=[]; let menu=[];
    days.forEach(day=>{ const pref=preferences[day]||{}; const row={día:capitalize(day),comida:'',cena:''}; ['comida','cena'].forEach(meal=>{ if(meal==='cena'&&!includeDinner)return; const cat=pref[meal]; if(!cat)return; let opts=dishes.filter(d=>d.category===cat&&!thisWeek.includes(d.name)&&!lastUsed.includes(d.name)); if(!opts.length)opts=dishes.filter(d=>d.category===cat); if(opts.length){ const choice=opts[Math.floor(Math.random()*opts.length)].name; thisWeek.push(choice); row[meal]=choice;} }); menu.push(row);} );
    save(LS_KEYS.LAST_MENU,thisWeek); historyMenu.push({fecha:new Date().toLocaleDateString(),menu}); save(LS_KEYS.HISTORY,historyMenu); renderMenu(menu); renderHistory(); }
  function renderMenu(menu){ el.menuTable.innerHTML=''; menu.forEach(r=>{ const tr=document.createElement('tr'); ['día','comida','cena'].forEach(k=>{ const td=document.createElement('td'); td.textContent=r[k]||'—'; tr.appendChild(td); }); el.menuTable.appendChild(tr);} ); show(el.resultSection); el.resultSection.scrollIntoView({behavior:'smooth'}); }

  // ===== Recetas =====
  function renderRecipes(){ el.recipesContainer.innerHTML=''; const grid=document.createElement('div'); grid.className='grid-recetas'; RECETAS_PRE.forEach(rec=>{ const card=document.createElement('div'); card.className='receta-card'; card.innerHTML=`<h3>${rec.nombre}</h3><button class="btn-detalle">Ver receta</button><div class="detalle-receta oculto"><h4>Ingredientes</h4><ul>${rec.ingredientes.map(i=>`<li>${i}</li>`).join('')}</ul><h4>Pasos</h4><ol>${rec.pasos.map(p=>`<li>${p}</li>`).join('')}</ol></div>`; card.querySelector('.btn-detalle').onclick=()=>card.querySelector('.detalle-receta').classList.toggle('oculto'); grid.appendChild(card);} ); el.recipesContainer.appendChild(grid);}  

  // ===== Historial =====
  function renderHistory(){ el.historyContainer.innerHTML=''; historyMenu.slice().reverse().forEach((entry,idx)=>{ const det=document.createElement('details'); const sum=document.createElement('summary'); sum.textContent=`#${historyMenu.length-idx} - ${entry.fecha}`; det.appendChild(sum); const tbl=document.createElement('table'); const hdr=document.createElement('tr'); ['Día','Comida','Cena'].forEach(h=>{ const th=document.createElement('th'); th.textContent=h; hdr.appendChild(th);} ); tbl.appendChild(hdr); entry.menu.forEach(r=>{ const tr=document.createElement('tr'); ['día','comida','cena'].forEach(k=>{ const td=document.createElement('td'); td.textContent=r[k]||'—'; tr.appendChild(td);} ); tbl.appendChild(tr);} ); det.appendChild(tbl); el.historyContainer.appendChild(det);} ); document.getElementById('seccion-historial').classList.remove('oculto'); }

  // ===== Utilidades =====
  function createChip(text,onRemove){ const span=document.createElement('span'); span.classList.add('chip'); span.textContent=capitalize(text); const btn=document.createElement('button'); btn.textContent='×'; btn.onclick=onRemove; btn.style.marginLeft='.5rem'; btn.style.border='none'; btn.style.background='transparent'; span.appendChild(btn); return span; }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1);}  
  function show(el){ el.classList.remove('oculto'); }  
  function hide(el){ el.classList.add('oculto'); }

  // ===== Eventos =====
  function attachEventListeners(){ el.formCat.addEventListener('submit',addCategory); el.formDish.addEventListener('submit',addDish); el.btnGenerate.addEventListener('click',generateMenu);} 
})();
