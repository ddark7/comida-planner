// script.js

// ===== 1) Llaves de localStorage =====
const LS_CAT_KEY = "categorias_platos";
const LS_PLATOS_KEY = "platos";
const LS_PREF_KEY = "preferencias_semanales";

// ===== 2) Valores preestablecidos =====
const CATEGORIAS_PRE = ["legumbres", "pasta", "verduras", "patatas", "arroz"];
const PLATOS_PRE = [
  { nombre: "Ensalada de garbanzos", tipo: "legumbres" },
  { nombre: "Judías con bacalao", tipo: "legumbres" },
  { nombre: "Macarrones a la boloñesa", tipo: "pasta" },
  { nombre: "Espaguetis a la carbonara", tipo: "pasta" },
  { nombre: "Judías verdes guisadas", tipo: "verduras" },
  { nombre: "Patatas con pavo", tipo: "patatas" },
  { nombre: "Patatas con cabeza de costilla", tipo: "patatas" },
  { nombre: "Arroz a la cubana", tipo: "arroz" },
  { nombre: "Arroz blanco", tipo: "arroz" },
  { nombre: "Paella", tipo: "arroz" }
];

// Recetas con ingredientes
const RECETAS_PRE = [
  {
    nombre: "Ensalada de garbanzos",
    ingredientes: ["Garbanzos", "Tomate", "Pepino", "Cebolla", "Aceite", "Sal"]
  },
  {
    nombre: "Judías con bacalao",
    ingredientes: ["Judías blancas", "Bacalao", "Ajo", "Pimentón", "Aceite", "Sal"]
  },
  {
    nombre: "Macarrones a la boloñesa",
    ingredientes: ["Macarrones", "Carne picada", "Tomate triturado", "Cebolla", "Ajo", "Aceite"]
  },
  {
    nombre: "Espaguetis a la carbonara",
    ingredientes: ["Espaguetis", "Bacon", "Huevos", "Queso rallado", "Aceite", "Sal"]
  },
  {
    nombre: "Judías verdes guisadas",
    ingredientes: ["Judías verdes", "Ajo", "Tomate", "Zanahoria", "Aceite", "Sal"]
  },
  {
    nombre: "Patatas con pavo",
    ingredientes: ["Patatas", "Pavo", "Cebolla", "Ajo", "Aceite", "Sal"]
  },
  {
    nombre: "Patatas con cabeza de costilla",
    ingredientes: ["Patatas", "Cabeza de costilla", "Cebolla", "Ajo", "Pimentón", "Aceite", "Sal"]
  },
  {
    nombre: "Arroz a la cubana",
    ingredientes: ["Arroz", "Plátano", "Tomate triturado", "Ajo", "Aceite", "Sal"]
  },
  {
    nombre: "Arroz blanco",
    ingredientes: ["Arroz", "Agua", "Aceite", "Sal"]
  },
  {
    nombre: "Paella",
    ingredientes: ["Arroz bomba", "Azafrán", "Caldo", "Mariscos", "Pollo", "Pimiento", "Aceite", "Sal"]
  }
];

// ===== 3) Datos en memoria =====
let categorias = [];
let platos = [];
let preferencias = {};

// ===== 4) Al cargar la página =====
document.addEventListener("DOMContentLoaded", () => {
  inicializarDatos();
  configurarModo();

  renderizarCategorias();
  renderizarListaPlatos();
  renderizarFormularioPreferencias();
  renderizarRecetas();

  document
    .getElementById("form-agregar-categoria")
    .addEventListener("submit", manejarAgregarCategoria);

  document
    .getElementById("form-agregar-plato")
    .addEventListener("submit", manejarAgregarPlato);

  document
    .getElementById("btn-guardar-preferencias")
    .addEventListener("click", manejarGuardarPreferencias);

  document
    .getElementById("btn-generar-menu")
    .addEventListener("click", manejarGenerarMenu);
});

// ================================
//  FUNCIONES DE INICIALIZACIÓN
// ================================
function inicializarDatos() {
  // Categorías
  const dataCat = localStorage.getItem(LS_CAT_KEY);
  if (dataCat) {
    categorias = JSON.parse(dataCat);
  } else {
    categorias = [...CATEGORIAS_PRE];
    localStorage.setItem(LS_CAT_KEY, JSON.stringify(categorias));
  }

  // Platos
  const dataPl = localStorage.getItem(LS_PLATOS_KEY);
  if (dataPl) {
    platos = JSON.parse(dataPl);
  } else {
    platos = [...PLATOS_PRE];
    localStorage.setItem(LS_PLATOS_KEY, JSON.stringify(platos));
  }

  // Preferencias
  const dataPref = localStorage.getItem(LS_PREF_KEY);
  preferencias = dataPref
    ? JSON.parse(dataPref)
    : {
        lunes: "",
        martes: "",
        miércoles: "",
        jueves: "",
        viernes: "",
        sábado: "",
        domingo: ""
      };
}

// ================================
//   FUNCIONES DE CATEGORÍAS
// ================================
function guardarCategorias() {
  localStorage.setItem(LS_CAT_KEY, JSON.stringify(categorias));
}

function renderizarCategorias() {
  const ul = document.getElementById("lista-categorias");
  ul.innerHTML = "";

  const selectCatPlato = document.getElementById("select-categoria-plato");
  selectCatPlato.innerHTML = `<option value="">— Elige categoría —</option>`;

  categorias.forEach((cat, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${capitalize(cat)}</span>
      <button class="btn-eliminar-cat" data-index="${idx}">❌</button>
    `;
    ul.appendChild(li);
  });

  document.querySelectorAll(".btn-eliminar-cat").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.getAttribute("data-index"));
      const nombreAEliminar = categorias[index];
      categorias.splice(index, 1);
      guardarCategorias();
      platos = platos.filter((p) => p.tipo !== nombreAEliminar);
      guardarPlatos();
      renderizarCategorias();
      renderizarListaPlatos();
    });
  });

  categorias.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = capitalize(cat);
    selectCatPlato.appendChild(option);
  });
}

function manejarAgregarCategoria(e) {
  e.preventDefault();
  const input = document.getElementById("input-nueva-categoria");
  const nombreCat = input.value.trim().toLowerCase();
  if (!nombreCat) return;
  if (categorias.includes(nombreCat)) {
    alert("Esa categoría ya existe.");
    return;
  }
  categorias.push(nombreCat);
  guardarCategorias();
  renderizarCategorias();
  input.value = "";
}

// ================================
//     FUNCIONES DE PLATOS
// ================================
function guardarPlatos() {
  localStorage.setItem(LS_PLATOS_KEY, JSON.stringify(platos));
}

function manejarAgregarPlato(e) {
  e.preventDefault();
  const nombreInput = document.getElementById("input-nombre-plato");
  const tipoSelect = document.getElementById("select-categoria-plato");
  const nombre = nombreInput.value.trim();
  const tipo = tipoSelect.value;

  if (!nombre || !tipo) {
    alert("Rellena el nombre y elige categoría.");
    return;
  }

  platos.push({ nombre, tipo });
  guardarPlatos();

  nombreInput.value = "";
  tipoSelect.selectedIndex = 0;
  renderizarListaPlatos();
}

function renderizarListaPlatos() {
  const ul = document.getElementById("lista-platos");
  ul.innerHTML = "";

  if (platos.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay platos guardados.";
    li.classList.add("texto-muted");
    ul.appendChild(li);
    return;
  }

  platos.forEach((p, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${capitalize(p.nombre)} (<em>${capitalize(p.tipo)}</em>)</span>
      <button class="btn-eliminar-plato" data-index="${idx}">❌</button>
    `;
    ul.appendChild(li);
  });

  document.querySelectorAll(".btn-eliminar-plato").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.getAttribute("data-index"));
      platos.splice(index, 1);
      guardarPlatos();
      renderizarListaPlatos();
    });
  });
}

// ================================
//  FUNCIONES DE PREFERENCIAS SEMANALES
// ================================
function guardarPreferencias() {
  localStorage.setItem(LS_PREF_KEY, JSON.stringify(preferencias));
  alert("Preferencias semanales guardadas.");
}

function renderizarFormularioPreferencias() {
  const form = document.getElementById("form-preferencias");
  form.innerHTML = "";
  const diasSemana = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];

  diasSemana.forEach(dia => {
    const div = document.createElement("div");
    div.classList.add("bloque-dia");
    const label = document.createElement("label");
    label.setAttribute("for", `select-${dia}`);
    label.textContent = capitalize(dia);

    const select = document.createElement("select");
    select.id = `select-${dia}`;
    select.name = dia;
    select.innerHTML = `<option value="">— Elige categoría —</option>`;

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = capitalize(cat);
      if (preferencias[dia] === cat) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    div.appendChild(label);
    div.appendChild(select);
    form.appendChild(div);
  });
}

function manejarGuardarPreferencias(e) {
  e.preventDefault();
  const diasSemana = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
  for (const dia of diasSemana) {
    const sel = document.getElementById(`select-${dia}`);
    preferencias[dia] = sel.value;
  }
  guardarPreferencias();
}

// ================================
//   FUNCIONES PARA GENERAR MENÚ
// ================================
function manejarGenerarMenu(e) {
  e.preventDefault();
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.classList.remove("oculto");

  const diasSemana = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];

  const prefsEnTiempoReal = {};
  for (const dia of diasSemana) {
    const select = document.getElementById(`select-${dia}`);
    prefsEnTiempoReal[dia] = select.value;
    if (!prefsEnTiempoReal[dia]) {
      alert(`Asigna una categoría para el día: ${capitalize(dia)}.`);
      if (spinner) spinner.classList.add("oculto");
      return;
    }
  }

  const platosPorTipo = {};
  categorias.forEach(cat => {
    platosPorTipo[cat] = platos.filter(p => p.tipo === cat);
    shuffleArray(platosPorTipo[cat]);
  });

  const usados = new Set();
  const planSemana = [];

  for (let i = 0; i < 7; i++) {
    const nombreDia = diasSemana[i];
    const tipoDeseado = prefsEnTiempoReal[nombreDia];
    let platoAsignado = "—";
    const arrTipo = platosPorTipo[tipoDeseado] || [];

    for (let j = 0; j < arrTipo.length; j++) {
      if (!usados.has(arrTipo[j].nombre)) {
        platoAsignado = arrTipo[j].nombre;
        usados.add(platoAsignado);
        break;
      }
    }

    if (platoAsignado === "—" && arrTipo.length > 0) {
      platoAsignado = arrTipo[0].nombre;
      usados.add(platoAsignado);
    }

    planSemana.push({ diaNombre: nombreDia, plato: platoAsignado });
  }

  setTimeout(() => {
    renderizarTablaMenu(planSemana);
    if (spinner) spinner.classList.add("oculto");
  }, 300);
}

function renderizarTablaMenu(planSemana) {
  const seccion = document.getElementById("seccion-resultado");
  const tbody = document.querySelector("#tabla-menu tbody");
  tbody.innerHTML = "";

  planSemana.forEach(item => {
    const tr = document.createElement("tr");
    const tdDia = document.createElement("td");
    tdDia.setAttribute("data-label", "Día");
    tdDia.textContent = capitalize(item.diaNombre);

    const tdPlato = document.createElement("td");
    tdPlato.setAttribute("data-label", "Plato");
    tdPlato.textContent = item.plato;

    tr.appendChild(tdDia);
    tr.appendChild(tdPlato);
    tbody.appendChild(tr);
  });

  seccion.classList.remove("oculto");
  seccion.scrollIntoView({ behavior: "smooth" });
}

// ================================
//   FUNCIONES DE RECETAS
// ================================
function renderizarRecetas() {
  const cont = document.getElementById("lista-recetas");
  cont.innerHTML = "";
  RECETAS_PRE.forEach(rec => {
    const div = document.createElement("div");
    div.classList.add("receta-card");
    let inner = `<h3>${rec.nombre}</h3><ul>`;
    rec.ingredientes.forEach(ing => {
      inner += `<li>${ing}</li>`;
    });
    inner += "</ul>";
    div.innerHTML = inner;
    cont.appendChild(div);
  });
}

// ================================
//      FUNCIONES AUXILIARES
// ================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleModoOscuro() {
  const link = document.getElementById('theme-style');
  const temaActual = link.getAttribute('href');
  const nuevoTema = temaActual === 'styles.css' ? 'styles-light.css' : 'styles.css';
  link.setAttribute('href', nuevoTema);
  localStorage.setItem('tema', nuevoTema);
}

document.addEventListener('DOMContentLoaded', () => {
  const temaGuardado = localStorage.getItem('tema');
  if (temaGuardado) {
    const link = document.getElementById('theme-style');
    link.setAttribute('href', temaGuardado);
  }

  const btnToggle = document.getElementById('btn-toggle-tema');
  if (btnToggle) {
    btnToggle.addEventListener('click', toggleModoOscuro);
  }
});
