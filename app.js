// Base de datos inicial completa y organizada por categorías con fotos reales
const productosIniciales = [
    // --- TECNOLOGÍA ---
    {
        id: 1,
        nombre: "Audífonos Inalámbricos Bluetooth",
        precio: 55000,
        categoria: "Tecnología",
        descripcion: "Cancelación de ruido, estuche de carga incluido.",
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    {
        id: 2,
        nombre: "Smartwatch Deportivo Negro",
        precio: 85000,
        categoria: "Tecnología",
        descripcion: "Monitor de ritmo cardíaco y notificaciones móviles.",
        imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    // --- MODA ---
    {
        id: 3,
        nombre: "Zapatos deportivos Nike",
        precio: 65000,
        categoria: "Moda",
        descripcion: "Talla 40, en excelente estado, casi nuevos.",
        imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    {
        id: 4,
        nombre: "Camiseta Casual Algodón",
        precio: 20000,
        categoria: "Moda",
        descripcion: "Talla M, color verde oliva en muy buen estado.",
        imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    // --- JUEGOS ---
    {
        id: 5,
        nombre: "Control Inalámbrico Consola",
        precio: 50000,
        categoria: "Juegos",
        descripcion: "Ergonómico, compatible con múltiples plataformas.",
        imagen: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    {
        id: 6,
        nombre: "Cascos Gamer con Micrófono",
        precio: 75000,
        categoria: "Juegos",
        descripcion: "Luces LED integradas, sonido envolvente estéreo.",
        imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    // --- HOGAR ---
    {
        id: 7,
        nombre: "Lámpara de Mesa Minimalista",
        precio: 40000,
        categoria: "Hogar",
        descripcion: "Luz cálida ajustable, ideal para estudio o dormitorio.",
        imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80",
        propietario: "Sistema"
    },
    {
        id: 8,
        nombre: "Mochila Escolar Impermeable",
        precio: 35000,
        categoria: "Hogar",
        descripcion: "Múltiples compartimentos seguros para portátil.",
        imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
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
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'text-indigo-600');
        btn.classList.add('text-slate-500');
    });

    const tabActiva = document.getElementById(`tab-${tabId}`);
    if (tabActiva) tabActiva.classList.remove('hidden');

    const navBtn = document.getElementById(`nav-${tabId}`);
    if (navBtn) {
        navBtn.classList.add('active', 'text-indigo-600');
        navBtn.classList.remove('text-slate-500');
    }
}

// Renderizar Todo
function renderizarTodo() {
    renderizarCarruselDestacados();
    renderizarCatalogo();
    renderizarMisPublicaciones();
}

// Crear Tarjeta de Producto con Imagen Real
function crearTarjetaProducto(p) {
    return `
        <div class="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
                <div class="w-full h-32 rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img src="${p.imagen || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'}" alt="${p.nombre}" class="w-full h-full object-cover">
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

// Renderizar Carrusel Horizontal de Destacados en Inicio
function renderizarCarruselDestacados() {
    const container = document.getElementById('carrusel-destacados');
    // Tomamos los primeros 5 productos para el banner deslizante
    const destacados = productos.slice(0, 5);
    
    container.innerHTML = destacados.map(p => `
        <div class="min-w-[160px] max-w-[160px] bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex flex-col justify-between snap-start flex-shrink-0">
            <div>
                <div class="w-full h-28 rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover">
                </div>
                <span class="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">${p.categoria}</span>
                <h4 class="font-semibold text-slate-800 text-xs mt-1 line-clamp-1">${p.nombre}</h4>
            </div>
            <div class="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                <span class="font-extrabold text-indigo-600 text-xs">${formatearCOP(p.precio)}</span>
                <button onclick="abrirModal(${p.id})" class="bg-amber-400 text-slate-900 font-bold px-2 py-1 rounded-full text-[9px]">Ver</button>
            </div>
        </div>
    `).join('');
}

// Renderizar Catálogo Completo
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

// Publicar Nuevo Producto
function publicarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById('pub-nombre').value.trim();
    const precio = Number(document.getElementById('pub-precio').value);
    const categoria = document.getElementById('pub-categoria').value;
    const imagenInput = document.getElementById('pub-imagen').value.trim();
    const descripcion = document.getElementById('pub-descripcion').value.trim();

    if (!nombre || !descripcion || precio <= 0) {
        mostrarToast('Completa todos los campos adecuadamente', 'exclamation-circle');
        return;
    }

    // Imagen por defecto según categoría si no se introduce URL
    let imagenPorDefecto = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80";
    if (categoria === 'Hogar') imagenPorDefecto = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80";
    if (categoria === 'Moda') imagenPorDefecto = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80";
    if (categoria === 'Juegos') imagenPorDefecto = "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=500&q=80";

    const nuevoProducto = {
        id: Date.now(),
        nombre,
        precio,
        categoria,
        imagen: imagenInput !== '' ? imagenInput : imagenPorDefecto,
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

// Renderizar Perfil
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
                <img src="${p.imagen}" class="w-10 h-10 rounded-xl object-cover">
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

function eliminarProducto(id) {
    productos = productos.filter(p => p.id !== id);
    guardarLocalStorage();
    renderizarTodo();
    mostrarToast('Producto eliminado', 'info-circle');
}

// Modales y WhatsApp
function abrirModal(id) {
    productoSeleccionado = productos.find(p => p.id === id);
    if (!productoSeleccionado) return;

    document.getElementById('modal-imagen').src = productoSeleccionado.imagen;
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
