// Base de datos inicial por defecto
const productosIniciales = [
    {
        id: 1,
        nombre: "Zapatos deportivos Nike",
        precio: 65000,
        categoria: "Moda",
        descripcion: "Talla 40, en excelente estado, casi nuevos.",
        icono: "👟",
        propietario: "Sistema"
    },
    {
        id: 2,
        nombre: "Control PS4 Inalámbrico",
        precio: 50000,
        categoria: "Juegos",
        descripcion: "Original, funcionando perfecto con cable.",
        icono: "🎮",
        propietario: "Sistema"
    },
    {
        id: 3,
        nombre: "Camiseta Casual Algodón",
        precio: 20000,
        categoria: "Moda",
        descripcion: "Talla M, color verde oliva en muy buen estado.",
        icono: "👕",
        propietario: "Sistema"
    },
    {
        id: 4,
        nombre: "Mochila Escolar / Laptop",
        precio: 35000,
        categoria: "Hogar",
        descripcion: "Múltiples compartimentos impermeables.",
        icono: "🎒",
        propietario: "Sistema"
    }
];

// Estado global de la app
let productos = [];
let productoSeleccionado = null;
let categoriaActual = "Todos";

// Inicialización de la App
document.addEventListener("DOMContentLoaded", () => {
    cargarProductosLocalStorage();
    renderizarTodo();
});

// Cargar o inicializar almacenamiento local
function cargarProductosLocalStorage() {
    const localData = localStorage.getItem("garaje_online_productos");
    if (localData) {
        productos = JSON.parse(localData);
    } else {
        productos = [...productosIniciales];
        guardarLocalStorage();
    }
}

function guardarLocalStorage() {
    localStorage.setItem("garaje_online_productos", JSON.stringify(productos));
}

// Formatear Moneda Pesos Colombianos (COP)
function formatearCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(valor);
}

// Navegación entre Pestañas
function cambiarPestana(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    
    // Desactivar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'text-indigo-600');
        btn.classList.add('text-slate-500');
    });

    // Mostrar pestaña elegida
    const tabActiva = document.getElementById(`tab-${tabId}`);
    if (tabActiva) tabActiva.classList.remove('hidden');

    // Activar botón navegación
    const navBtn = document.getElementById(`nav-${tabId}`);
    if (navBtn) {
        navBtn.classList.add('active', 'text-indigo-600');
        navBtn.classList.remove('text-slate-500');
    }
}

// Renderizar Todos los Contenidos
function renderizarTodo() {
    renderizarDestacados();
    renderizarCatalogo();
    renderizarMisPublicaciones();
}

// Crear Tarjeta de Producto (HTML Reutilizable)
function crearTarjetaProducto(p) {
    return `
        <div class="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
                <div class="bg-indigo-50/60 rounded-xl py-4 flex items-center justify-center text-4xl mb-2">
                    ${p.icono || '📦'}
                </div>
                <span class="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">${p.categoria}</span>
                <h4 class="font-semibold text-slate-800 text-xs mt-1 line-clamp-1">${p.nombre}</h4>
                <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${p.descripcion}</p>
            </div>
            <div class="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                <span class="font-extrabold text-indigo-600 text-xs">${formatearCOP(p.precio)}</span>
                <button onclick="abrirModal(${p.id})" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-2.5 py-1 rounded-full text-[10px] active:scale-95 transition">
                    Me interesa
                </button>
            </div>
        </div>
    `;
}

// Renderizar Destacados en Inicio
function renderizarDestacados() {
    const container = document.getElementById('destacados-container');
    const destacados = productos.slice(-2); // Últimos 2 agregados
    container.innerHTML = destacados.map(p => crearTarjetaProducto(p)).join('');
}

// Renderizar Catálogo de Productos Completo
function renderizarCatalogo() {
    const container = document.getElementById('lista-productos');
    const busqueda = document.getElementById('buscador-input')?.value.toLowerCase().trim() || '';

    const filtrados = productos.filter(p => {
        const coincideCategoria = categoriaActual === 'Todos' || p.categoria === categoriaActual;
        const coincideTexto = p.nombre.toLowerCase().includes(busqueda) || p.descripcion.toLowerCase().includes(busqueda);
        return coincideCategoria && coincideTexto;
    });

    const contador = document.getElementById('contador-productos');
    if (contador) contador.textContent = `Mostrando ${filtrados.length} producto(s)`;

    if (filtrados.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-8 space-y-2">
                <span class="text-4xl">🔍</span>
                <p class="text-xs text-slate-500 font-medium">No se encontraron productos coincidentes.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtrados.map(p => crearTarjetaProducto(p)).join('');
}

// Filtrar por Categoría
function filtrarPorCategoria(cat) {
    categoriaActual = cat;
    
    // Actualizar estilo visual de los chips
    document.querySelectorAll('.chip-filtro').forEach(chip => {
        if (chip.textContent.trim() === cat) {
            chip.classList.add('bg-indigo-600', 'text-white');
            chip.classList.remove('bg-white', 'text-slate-600');
        } else {
            chip.classList.remove('bg-indigo-600', 'text-white');
            chip.classList.add('bg-white', 'text-slate-600');
        }
    });

    renderizarCatalogo();
}

// Filtrar por Buscador Dinámico
function filtrarProductos() {
    const input = document.getElementById('buscador-input');
    const btnLimpiar = document.getElementById('limpiar-buscador');

    if (input.value.trim() !== '') {
        btnLimpiar.classList.remove('hidden');
    } else {
        btnLimpiar.classList.add('hidden');
    }

    renderizarCatalogo();
}

function limpiarBuscador() {
    const input = document.getElementById('buscador-input');
    input.value = '';
    filtrarProductos();
}

// Publicar un Nuevo Producto desde el Formulario
function publicarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById('pub-nombre').value.trim();
    const precio = Number(document.getElementById('pub-precio').value);
    const categoria = document.getElementById('pub-categoria').value;
    const icono = document.getElementById('pub-icono').value;
    const descripcion = document.getElementById('pub-descripcion').value.trim();

    if (!nombre || !descripcion || precio <= 0) {
        mostrarToast('Completa todos los campos adecuadamente', 'exclamation-circle');
        return;
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre,
        precio,
        categoria,
        icono,
        descripcion,
        propietario: "Usuario"
    };

    productos.unshift(nuevoProducto);
    guardarLocalStorage();
    renderizarTodo();

    document.getElementById('form-publicar').reset();
    mostrarToast('¡Producto publicado con éxito!', 'check-circle');
    cambiarPestana('productos');
}

// Renderizar Publicaciones en la pestaña Perfil
function renderizarMisPublicaciones() {
    const container = document.getElementById('mis-publicaciones-container');
    const misProds = productos.filter(p => p.propietario === "Usuario");

    document.getElementById('stat-publicados').textContent = misProds.length;

    if (misProds.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 bg-white rounded-2xl border border-slate-100">
                <p class="text-xs text-slate-400">Aún no has publicado productos.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = misProds.map(p => `
        <div class="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <span class="text-2xl">${p.icono}</span>
                <div>
                    <h4 class="font-semibold text-xs text-slate-800">${p.nombre}</h4>
                    <span class="text-[11px] font-bold text-indigo-600">${formatearCOP(p.precio)}</span>
                </div>
            </div>
            <button onclick="eliminarProducto(${p.id})" class="text-red-500 hover:text-red-700 text-xs p-2">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
}

// Eliminar Producto
function eliminarProducto(id) {
    productos = productos.filter(p => p.id !== id);
    guardarLocalStorage();
    renderizarTodo();
    mostrarToast('Producto eliminado', 'info-circle');
}

// Modales y Contacto
function abrirModal(id) {
    productoSeleccionado = productos.find(p => p.id === id);
    if (!productoSeleccionado) return;

    document.getElementById('modal-icono').textContent = productoSeleccionado.icono;
    document.getElementById('modal-titulo').textContent = productoSeleccionado.nombre;
    document.getElementById('modal-precio').textContent = formatearCOP(productoSeleccionado.precio);
    document.getElementById('modal-desc').textContent = productoSeleccionado.descripcion;

    document.getElementById('modal-contacto').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modal-contacto').classList.add('hidden');
    productoSeleccionado = null;
}

function enviarMensajeWhatsApp() {
    if (!productoSeleccionado) return;
    const mensaje = `Hola! Me interesa tu producto "${productoSeleccionado.nombre}" publicado en Garaje Online por ${formatearCOP(productoSeleccionado.precio)}.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    cerrarModal();
}

// Mostrar Toast de Notificación
function mostrarToast(mensaje, icono = 'check-circle') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.textContent = mensaje;
    toastIcon.className = `fas fa-${icono} text-green-400`;

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
