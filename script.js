// script.js – Planificador Semanal ÑAM con Primero/Segundo y Combos

(() => {
  // ——— Llaves de localStorage ———
  const LS_PLATOS        = 'ÑAM-platos';
  const LS_COMBOS        = 'ÑAM-combos';
  const LS_PREFERENCIAS  = 'ÑAM-preferencias';
  const LS_HISTORY       = 'ÑAM-history';
  const LS_INCLUDE_CENA  = 'ÑAM-includeCena';

  // ——— Datos en memoria ———
  let categorias    = [];
  let platos        = []; // { nombre, tipo: 'primero'|'segundo', categoria }
  let combos        = []; // { primero, segundo }
  let preferencias  = {}; // { lunes: { comida: 'legumbres', cena: 'arroz' }, ... }
  let historyMenu   = [];
  let includeCena   = true;

  // ——— Elementos del DOM ———
  const el = {
    // Categorías
    formCat:   document.getElementById('form-agregar-categoria'),
    inputCat:  document.getElementById('input-nueva-categoria'),
    chipsCat:  document.getElementById('chips-categorias'),
    // Platos
    formDish:    document.getElementById('form-agregar-plato'),
    inputDish:   document.getElementById('input-nombre-plato'),
    selectType:  document.getElementById('select-tipo-plato'),
    inputCatPlt: document.getElementById('input-categoria-plato'),
    listaPlatos: document.getElementById('lista-platos'),
    // Combos
    comboP:      document.getElementById('comboPrimero'),
    comboS:      document.getElementById('comboSegundo'),
    btnCombo:    document.getElementById('btn-agregar-combo'),
    listaCombos: document.getElementById('lista-combos'),
    // Preferencias
    prefsGrid:   document.querySelector('#seccion-preferencias .grid-griddias'),
    btnSavePref: document.getElementById('btn-guardar-preferencias'),
    // Generar
    chkCena:     document.getElementById('incluyeCena'),
    btnGen:      document.getElementById('btn-generar-menu'),
    // Resultado
    tblBody:     document.querySelector('#tabla-menu tbody'),
    resultSec:   document.getElementById('seccion-resultado'),
    // Recetas
    recetasGrid: document.getElementById('recetasContainer'),
    // Historial
    historyDiv:  document.getElementById('historial-menus')
  };

  // ——— Inicialización ———
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    fillCategoryDatalists();
    renderAll();
    attachEvents();
  });

  // ——— Carga y guarda en localStorage ———
  function loadData() {
    categorias   = JSON.parse(localStorage.getItem(LS_PLATOS))?.map(p=>p.categoria).filter((v,i,a)=>a.indexOf(v)===i) || ['legumbres','pasta','verduras','patatas','arroz'];
    platos       = JSON.parse(localStorage.getItem(LS_PLATOS)) || [];
    combos       = JSON.parse(localStorage.getItem(LS_COMBOS)) || [];
    preferencias = JSON.parse(localStorage.getItem(LS_PREFERENCIAS)) || {};
    historyMenu  = JSON.parse(localStorage.getItem(LS_HISTORY)) || [];
    includeCena  = JSON.parse(localStorage.getItem(LS_INCLUDE_CENA)) ?? true;
    el.chkCena.checked = includeCena;
  }

  function saveData() {
    localStorage.setItem(LS_PLATOS, JSON.stringify(platos));
    localStorage.setItem(LS_COMBOS, JSON.stringify(combos));
    localStorage.setItem(LS_PREFERENCIAS, JSON.stringify(preferencias));
    localStorage.setItem(LS_HISTORY, JSON.stringify(historyMenu));
    localStorage.setItem(LS_INCLUDE_CENA, JSON.stringify(includeCena));
  }

  // — Utilidades —
function capitalize(s) {
  return String(s).charAt(0).toUpperCase() + s.slice(1);
}

  // ——— Rellena los datalists y selects de categoría ———
function fillCategoryDatalists() {
  // 1) datalist para el input de categoría de plato
  const dl = document.getElementById('categorias-base');
  dl.innerHTML = '';
  // 2) selects de combo primero/segundo
  const selP = el.comboP, selS = el.comboS;
  selP.innerHTML = '<option value="">— Primero —</option>';
  selS.innerHTML = '<option value="">— Segundo —</option>';

  categorias.forEach(cat => {
    // datalist option
    const optDl = document.createElement('option');
    optDl.value = cat;
    dl.appendChild(optDl);

    // comboPrimero option
    const optP = document.createElement('option');
    optP.value = cat;
    optP.textContent = capitalize(cat);
    selP.appendChild(optP);

    // comboSegundo option (clone)
    const optS = optP.cloneNode(true);
    selS.appendChild(optS);
  });
}

  // ——— Renders básicos ———
  function renderAll() {
    renderCategories();
    renderPlatos();
    renderCombos();
    renderPreferencesForm();
    renderRecetas();
    renderHistory();
    hide(el.resultSec);
  }

  // — Categorías —  
  function renderCategories() {
    el.chipsCat.innerHTML = '';
    categorias.forEach(cat => {
      const chip = createChip(cat, () => {
        categorias = categorias.filter(c=>c!==cat);
        platos = platos.filter(p=>p.categoria!==cat);
        saveData(); renderAll();
      });
      el.chipsCat.appendChild(chip);
    });
  }
  function addCategory(ev) {
    ev.preventDefault();
    const v = el.inputCat.value.trim().toLowerCase();
    if (v && !categorias.includes(v)) {
      categorias.push(v);
      saveData();
      renderCategories();
      fillCategoryDatalists();
    }
    el.inputCat.value = '';
  }

  // — Platos —  
  function renderPlatos() {
    el.listaPlatos.innerHTML = '';
    platos.forEach((p,i) => {
      const li = document.createElement('li');
      li.textContent = `${p.nombre} [${p.tipo}, ${p.categoria}]`;
      const btn = document.createElement('button');
      btn.textContent = '×';
      btn.onclick = () => { platos.splice(i,1); saveData(); renderPlatos(); };
      li.appendChild(btn);
      el.listaPlatos.appendChild(li);
    });
  }
  function addPlato(ev) {
    ev.preventDefault();
    const nombre = el.inputDish.value.trim();
    const tipo   = el.selectType.value;
    const cat    = el.inputCatPlt.value.trim().toLowerCase();
    if (nombre && tipo && cat) {
      platos.push({ nombre, tipo, categoria: cat });
      if (!categorias.includes(cat)) categorias.push(cat);
      saveData();
      renderPlatos();
      renderCategories();
      fillCategoryDatalists();
    }
    el.inputDish.value = '';
    el.selectType.value = '';
    el.inputCatPlt.value = '';
  }

  // — Combos —  
  function renderCombos() {
    el.listaCombos.innerHTML = '';
    combos.forEach((c,i) => {
      const li = document.createElement('li');
      li.textContent = `${c.primero} → ${c.segundo}`;
      const btn = document.createElement('button');
      btn.textContent = '×';
      btn.onclick = () => { combos.splice(i,1); saveData(); renderCombos(); };
      li.appendChild(btn);
      el.listaCombos.appendChild(li);
    });
  }
  function addCombo(ev) {
    ev.preventDefault();
    const p = el.comboP.value, s = el.comboS.value;
    if (p && s) {
      combos.push({ primero: p, segundo: s });
      saveData();
      renderCombos();
    }
  }

  // — Preferences —  
  function renderPreferencesForm() {
    const days = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
    el.prefsGrid.innerHTML = '';
    days.forEach(day => {
      const block = document.createElement('div');
      block.className = 'bloque-dia';
      const header = document.createElement('div');
      header.className = 'dia-label';
      header.textContent = day;
      header.onclick = () => block.classList.toggle('expandido');
      const selC = createSelect(day,'comida');
      const selS = createSelect(day,'cena');
      const cont = document.createElement('div');
      cont.className = 'selects-container';
      cont.append(selC, selS);
      block.append(header, cont);
      el.prefsGrid.append(block);
    });
  }
  function createSelect(day, meal) {
    const sel = document.createElement('select');
    sel.dataset.day  = day;
    sel.dataset.meal = meal;
    sel.innerHTML = `<option value="">— ${meal} —</option>`;
    categorias.forEach(cat => {
      const o = document.createElement('option');
      o.value = cat; o.textContent = cat;
      if (preferencias[day]?.[meal] === cat) o.selected = true;
      sel.append(o);
    });
    sel.onchange = () => {
      preferencias[day] = preferencias[day]||{};
      preferencias[day][meal] = sel.value;
      saveData();
    };
    return sel;
  }

  // — Recetas —  
  function renderRecetas() {
    // Usa const RECETAS_PRE definido arriba
    window.RECETAS_PRE.forEach; // ya está presente, no lo repetimos
    const grid = document.createElement('div');
    grid.className = 'recetas-grid';
    RECETAS_PRE.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'receta-card';
      card.innerHTML = `
        <h3>${rec.nombre}</h3>
        <button class="btn-detalle">Ver receta</button>
        <div class="detalle-receta oculto">
          <h4>Ingredientes</h4>
          <ul>${rec.ingredientes.map(i=>`<li>${i}</li>`).join('')}</ul>
          <h4>Pasos</h4>
          <ol>${rec.pasos.map(p=>`<li>${p}</li>`).join('')}</ol>
        </div>`;
      card.querySelector('.btn-detalle')
          .onclick = () => card.querySelector('.detalle-receta')
                             .classList.toggle('oculto');
      grid.append(card);
    });
    el.recetasGrid.innerHTML = '';
    el.recetasGrid.append(grid);
  }

  // — Historial —  
  function renderHistory() {
    el.historyDiv.innerHTML = '';
    historyMenu.slice().reverse().forEach((entry,i) => {
      const det = document.createElement('details');
      const sum = document.createElement('summary');
      sum.textContent = `#${historyMenu.length-i} – ${entry.fecha}`;
      det.append(sum);
      const tbl = document.createElement('table');
      tbl.innerHTML = `
        <tr><th>Día</th><th>1er plato</th><th>2º plato</th>
          ${includeCena?'<th>1er cena</th><th>2º cena</th>':''}
        </tr>`;
      entry.menu.forEach(r => {
        const tr = document.createElement('tr');
        ['día','primero','segundo','primeroCena','segundoCena']
          .filter((k,idx)=> idx<2 || (includeCena && idx>=2))
          .forEach(key => {
            const td = document.createElement('td');
            td.textContent = r[key]||'—';
            tr.append(td);
          });
        tbl.append(tr);
      });
      det.append(tbl);
      el.historyDiv.append(det);
    });
  }

  // — Generar Menú —  
  function shuffle(a) {
    for (let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
  }
  function isComboValid(cat1,cat2) {
    if (!combos.length) return true;
    return combos.some(c=>c.primero===cat1 && c.segundo===cat2);
  }
  function generateMenu(ev) {
    ev.preventDefault();
    includeCena = el.chkCena.checked;
    saveData();

    // días de la semana
    const days = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
    // copias de platos
    let prims = platos.filter(p=>p.tipo==='primero').slice();
    let secs  = platos.filter(p=>p.tipo==='segundo').slice();
    shuffle(prims); shuffle(secs);

    const menu = [];
    days.forEach(day => {
      const pref = preferencias[day]||{};
      const row = { día: day };
      // comida
      let p = prims.find(x=>x.categoria===pref.comida) || prims.shift();
      if (p) prims = prims.filter(x=>x!==p);
      row.primero       = p?.nombre||'';
      let sIdx = secs.findIndex(x=>isComboValid(p?.categoria,p?.categoria));
      let s    = (sIdx>=0?secs.splice(sIdx,1)[0]:secs.shift());
      row.segundo       = s?.nombre||'';
      // cena
      if (includeCena) {
        let p2 = prims.shift();
        if (p2) row.primeroCena = p2.nombre;
        else      row.primeroCena = '';
        let s2 = secs.shift();
        if (s2) row.segundoCena = s2.nombre;
        else     row.segundoCena = '';
      }
      menu.push(row);
    });

    // guardar historial
    historyMenu.push({ fecha: new Date().toLocaleDateString(), menu });
    saveData();
    renderHistory();

    // mostrar tabla resultado
    el.tblBody.innerHTML = menu.map(r =>
      `<tr>
        <td>${r.día}</td>
        <td>${r.primero}</td>
        <td>${r.segundo}</td>
        ${includeCena?`<td>${r.primeroCena}</td><td>${r.segundoCena}</td>`:''}
      </tr>`
    ).join('');
    show(el.resultSec);
    el.resultSec.scrollIntoView({ behavior: 'smooth' });
  }

  // — Utilidades DOM —  
  function createChip(text, onRemove) {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = text;
    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.onclick = onRemove;
    span.append(btn);
    return span;
  }
  function hide(e){ e.classList.add('oculto'); }
  function show(e){ e.classList.remove('oculto'); }

  // Inicializa toggle-groups ya presentes en el DOM
function initToggles() {
  document.querySelectorAll('.toggle-group').forEach(group => {
    const hidden = group.querySelector('input[type=hidden]');
    // Si es grupo de tipo-plato, tenemos hidden#select-tipo-plato
    // Para las prefs, gestionaremos en createSelect
    group.querySelectorAll('.toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        // quitar active de todos
        group.querySelectorAll('.toggle').forEach(b => b.classList.remove('active'));
        // activar éste
        btn.classList.add('active');
        // guardar valor en hidden, si existe
        if (hidden) hidden.value = btn.dataset.value;
      });
    });
    // fijar valor inicial si hidden ya tiene uno
    if (hidden && hidden.value) {
      const match = group.querySelector(`.toggle[data-value="${hidden.value}"]`);
      if (match) {
        group.querySelectorAll('.toggle').forEach(b => b.classList.remove('active'));
        match.classList.add('active');
      }
    }
  });
}


  // — Eventos globales —  
  function attachEvents() {
    el.formCat .addEventListener('submit', addCategory);
    el.formDish.addEventListener('submit', addPlato);
    el.btnCombo.addEventListener('click', addCombo);
    el.btnSavePref.addEventListener('click', e=>{ e.preventDefault(); saveData(); });
    el.btnGen .addEventListener('click', generateMenu);
  }
})();

