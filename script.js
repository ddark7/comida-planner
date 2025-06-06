// script.js

// ===== 1) Llaves de localStorage =====
const LS_CAT_KEY    = "categorias_platos";
const LS_PLATOS_KEY = "platos";
const LS_PREF_KEY   = "preferencias_semanales";
const LS_HIST_KEY   = "historial_menus";  // para guardar el historial

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

// Recetas con ingredientes y pasos
const RECETAS_PRE = [
  {
    nombre: "Ensalada de garbanzos",
    ingredientes: ["Garbanzos cocidos", "Tomate", "Pepino", "Cebolla", "Aceite de oliva", "Sal", "Pimienta"],
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
    ingredientes: ["Judías blancas", "Bacalao desalado", "Ajo", "Pimentón dulce", "Aceite de oliva", "Sal"],
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
    ingredientes: ["Macarrones", "Carne picada", "Tomate triturado", "Cebolla", "Ajo", "Aceite de oliva", "Sal", "Pimienta"],
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
    ingredientes: ["Espaguetis", "Bacon", "Huevos", "Queso parmesano rallado", "Aceite de oliva", "Sal", "Pimienta"],
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
    ingredientes: ["Judías verdes frescas", "Ajo", "Tomate", "Zanahoria", "Aceite de oliva", "Sal", "Pimienta"],
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
    ingredientes: ["Patatas", "Filetes de pavo", "Cebolla", "Ajo", "Aceite de oliva", "Sal", "Pimienta"],
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
    ingredientes: ["Patatas", "Cabeza de costilla (trozos)", "Cebolla", "Ajo", "Pimentón dulce", "Aceite de oliva", "Sal", "Pimienta"],
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
    ingredientes: ["Arroz", "Plátano", "Tomate triturado", "Ajo", "Aceite de oliva", "Sal", "Pimienta"],
    pasos: [
      "Cuece el arroz en agua con sal y escurre.",
      "Fríe el plátano en rodajas con un poco de aceite hasta que esté dorado.",
      "En otra sartén, sofríe ajo picado en aceite y añade tomate triturado, sal y pimienta. Cocina 10 minutos.",
      "Sirve el arroz con el tomate frito y el plátano por encima."
    ]
  },
  {
    nombre: "Arroz blanco",
    ingredientes: ["Arroz", "Agua", "Aceite de oliva", "Sal"],
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
    ingredientes: ["Arroz bomba", "Azafrán", "Caldo", "Mariscos", "Pollo", "Pimiento rojo", "Ajo", "Aceite de oliva", "Sal", "Pimienta"],
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

// ===== 3) Datos en memoria =====
let categorias = [];
let platos = [];
let preferencias = {};
let historial = [];

// ===== 4) Al cargar la página =====
document.addEventListener("DOMContentLoaded", () => {
  inicializarDatos();
  configurarModo();

  renderizarCategorias();
  renderizarListaPlatos();
  renderizarFormularioPreferencias();
  renderizarRecetas();
  renderizarHistorial();

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

  document
    .getElementById("btn-toggle-tema")
    .addEventListener("click", toggleModoOscuro);
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

  // Historial de menús
  const dataHist = localStorage.getItem(LS_HIST_KEY);
  historial = dataHist ? JSON.parse(dataHist) : [];
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

  // Leemos las preferencias en tiempo real
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

  // Agrupar platos por tipo y barajar
  const platosPorTipo = {};
  categorias.forEach(cat => {
    platosPorTipo[cat] = platos.filter(p => p.tipo === cat);
    shuffleArray(platosPorTipo[cat]);
  });

  // Obtenemos el último menú para comparar
  const ultimoHist = historial.length > 0 ? historial[historial.length - 1] : null;

  let planSemana;
  // Intentamos generar hasta 10 veces un menú diferente al anterior (minimizando repeticiones)
  for (let intento = 0; intento < 10; intento++) {
    planSemana = [];
    const usados = new Set();

    for (let i = 0; i < 7; i++) {
      const nombreDia = diasSemana[i];
      const tipoDeseado = prefsEnTiempoReal[nombreDia];
      let platoAsignado = "—";
      const arrTipo = platosPorTipo[tipoDeseado] || [];

      // Buscamos un plato que no se usó esta semana ni la anterior en el mismo día
      for (let j = 0; j < arrTipo.length; j++) {
        const candidato = arrTipo[j].nombre;
        const repetidoEnSemanaPasada = ultimoHist
          ? ultimoHist[i].plato === candidato
          : false;
        if (!usados.has(candidato) && !repetidoEnSemanaPasada) {
          platoAsignado = candidato;
          usados.add(candidato);
          break;
        }
      }

      // Si no encontramos ninguno diferente, tomamos el primero disponible
      if (platoAsignado === "—" && arrTipo.length > 0) {
        platoAsignado = arrTipo[0].nombre;
        usados.add(platoAsignado);
      }

      planSemana.push({ diaNombre: nombreDia, plato: platoAsignado });
    }

    // Si no había historial o si el nuevo menú difiere del anterior, salimos del bucle
    if (!ultimoHist || !menusIguales(planSemana, ultimoHist)) {
      break;
    }
  }

  // Guardamos en historial
  historial.push(planSemana);
  localStorage.setItem(LS_HIST_KEY, JSON.stringify(historial));

  // Renderizamos el nuevo menú y el historial actualizado
  setTimeout(() => {
    renderizarTablaMenu(planSemana);
    renderizarHistorial();
    if (spinner) spinner.classList.add("oculto");
  }, 300);
}

function menusIguales(menuA, menuB) {
  // Compara dos arrays [{diaNombre, plato}, ...] y devuelve true si todos los platos coinciden en el mismo índice
  if (!menuA || !menuB || menuA.length !== menuB.length) return false;
  for (let i = 0; i < menuA.length; i++) {
    if (menuA[i].plato !== menuB[i].plato) return false;
  }
  return true;
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
//  FUNCIONES DE RECETAS
// ================================
function renderizarRecetas() {
  const cont = document.getElementById("lista-recetas");
  cont.innerHTML = "";

  // Creamos selector de recetas
  const selectRec = document.createElement("select");
  selectRec.id = "select-receta";
  selectRec.innerHTML = `<option value="">— Selecciona receta —</option>`;
  RECETAS_PRE.forEach((rec, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = rec.nombre;
    selectRec.appendChild(option);
  });
  cont.appendChild(selectRec);

  // Contenedor para detalles
  const detalles = document.createElement("div");
  detalles.id = "detalle-receta";
  detalles.style.marginTop = "1rem";
  cont.appendChild(detalles);

  // Listener para mostrar detalles al cambiar
  selectRec.addEventListener("change", () => {
    const idx = selectRec.value;
    if (idx === "") {
      detalles.innerHTML = "";
      return;
    }
    const receta = RECETAS_PRE[idx];
    let html = `<h3>${receta.nombre}</h3><h4>Ingredientes:</h4><ul>`;
    receta.ingredientes.forEach(ing => {
      html += `<li>${ing}</li>`;
    });
    html += `</ul><h4>Pasos:</h4><ol>`;
    receta.pasos.forEach(paso => {
      html += `<li>${paso}</li>`;
    });
    html += `</ol>`;
    detalles.innerHTML = html;
    detalles.scrollIntoView({ behavior: "smooth" });
  });
}

// ================================
//  FUNCIONES DE HISTORIAL
// ================================
function renderizarHistorial() {
  const cont = document.getElementById("historial-menus");
  cont.innerHTML = "";

  if (historial.length === 0) {
    cont.innerHTML = "<p class=\"texto-muted\">Aún no hay menús generados.</p>";
    return;
  }

  // Recorremos el historial (del más reciente al más antiguo)
  historial.slice().reverse().forEach((menuSemana, idxRev) => {
    // idxRev = 0 es el más reciente; índice real en el array es historial.length-1 - idxRev
    const indexReal = historial.length - 1 - idxRev;
    const fecha = new Date().toLocaleDateString(); // Podrías guardar fechas explícitas si quisieras

    const divCard = document.createElement("div");
    divCard.classList.add("receta-card");

    let html = `<h3>Menú #${indexReal + 1} (generado)</h3><table>`;
    html += "<thead><tr><th>Día</th><th>Plato</th></tr></thead><tbody>";
    menuSemana.forEach(item => {
      html += `<tr><td>${capitalize(item.diaNombre)}</td><td>${item.plato}</td></tr>`;
    });
    html += "</tbody></table>";

    divCard.innerHTML = html;
    cont.appendChild(divCard);
  });

  document.getElementById("seccion-historial").classList.remove("oculto");
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

// ================================
//    MODO OSCURO / CLARO
// ================================
function toggleModoOscuro() {
  const link = document.getElementById("theme-style");
  const temaActual = link.getAttribute("href");
  const nuevoTema = temaActual === "styles.css" ? "styles-light.css" : "styles.css";
  link.setAttribute("href", nuevoTema);
  localStorage.setItem("tema", nuevoTema);
}

function configurarModo() {
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado) {
    const link = document.getElementById("theme-style");
    link.setAttribute("href", temaGuardado);
  }
}
