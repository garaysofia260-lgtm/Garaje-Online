// Base de Datos Inicial de Ejemplo
const productosIniciales = [
    {
        id: 1,
        nombre: "Audífonos Inalámbricos Pro",
        precio: 65000,
        categoria: "Tecnología",
        descripcion: "Cancelación de ruido activa, estuche de carga USB-C.",
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        propietarioEmail: "demo@garaje.com",
        propietarioNombre: "Carlos Mendoza"
    },
    {
        id: 2,
        nombre: "Tenis Deportivos Red",
        precio: 80000,
        categoria: "Moda",
        descripcion: "Talla 40, suela liviana antideslizante, excelente estado.",
        imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        propietarioEmail: "demo@garaje.com",
        propietarioNombre: "Carlos Mendoza"
    },
    {
        id: 3,
        nombre: "Mando para Consola Inalámbrico",
        precio: 55000,
        categoria: "Juegos",
        descripcion: "Soporta vibración doble, ergonómico y compatible con PC.",
        imagen: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80",
        propietarioEmail: "demo2@garaje.com",
        propietarioNombre: "Ana María Gómez"
    },
    {
        id: 4,
        nombre: "Lámpara Minimalista de Mesa",
        precio: 45000,
        categoria: "Hogar",
        descripcion: "Luz cálida LED regulable, ideal para dormitorio u oficina.",
        imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
        propietarioEmail: "demo2@garaje.com",
        propietarioNombre: "Ana María Gómez"
    }
];

// Cuentas Iniciales
const usuariosIniciales = [
    {
        nombre: "Carlos Mendoza",
        email: "demo@garaje.com",
        pass: "123456"
    },
    {
        nombre: "Ana María Gómez",
        email: "demo2@garaje.com",
        pass: "123456"
    }
];

// Reseñas Iniciales
const resenasIniciales = [
    {
        vendedorEmail: "demo@garaje.com",
        autor: "María P.",
        puntuacion: 5,
        comentario: "Excelente vendedor, el producto llegó rápido y tal como se describió."
    },
    {
        vendedorEmail: "demo@garaje.com",
        autor: "Juan K.",
        puntuacion: 5,
        comentario: "Muy buena comunicación y excelente precio."
    }
];

// Estado Global
let usuarios = [];
let usuarioActual = null;
let productos = [];
let resenas = [];
let productoSeleccionado = null;
let categoriaActual = "Todos";
let estrellaSeleccionadaModal = 5;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosStorage();
    renderizarTodo();
});

// Carga y Persistencia en localStorage
function cargarDatosStorage() {
    // Usuarios
    const localUsers = localStorage.getItem("garaje_usuarios_v1");
    usuarios = localUsers ? JSON.parse(localUsers) : [...usuariosIniciales];

    // Usuario Activo
    const localSession = localStorage.getItem("garaje_sesion_v1");
    usuarioActual = localSession ? JSON.parse(localSession) : null;

    // Productos
    const localProds = localStorage.getItem("garaje_productos_v1");
    productos = localProds ? JSON.parse(localProds) : [...productosIniciales];

    // Reseñas
    const localRes = localStorage.getItem("garaje_resenas_v1");
    resenas = localRes ? JSON.parse(localRes) : [...resenasIniciales];

    guardarStorage();
}

function guardarStorage() {
    localStorage.setItem("garaje_usuarios_v1", JSON.stringify(usuarios));
    localStorage.setItem("garaje_sesion_v1", JSON.stringify(usuarioActual));
    localStorage.setItem("garaje_productos_v1", JSON.stringify(productos));
    localStorage.setItem("garaje_resenas_v1", JSON.stringify(resenas));
}

// Formatear Precio COP
function formatearCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(valor);
}

// Cambiar Pestaña
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

// Renderizar Todos los Componentes
function renderizarTodo() {
    renderizarEstadoUsuario();
    renderizarCarruselDestacados();
    renderizarCatalogo();
    renderizarMisPublicaciones();
    renderizarResenasPerfil();
}

// Control Vista de Perfil y Botonera
function renderizarEstadoUsuario() {
    const guestView = document.getElementById('perfil-guest-view');
    const loggedView = document.getElementById('perfil-logged-view');
    const userDot = document.getElementById('user-dot');

    if (usuarioActual) {
        guestView.classList.add('hidden');
        loggedView.classList.remove('hidden');
        if (userDot) userDot.classList.remove('hidden');

        document.getElementById('perfil-nombre').textContent = usuarioActual.nombre;
        document.getElementById('perfil-email').textContent = usuarioActual.email;
        document.getElementById('perfil-avatar').textContent = usuarioActual.nombre.charAt(0).toUpperCase();

        // Calcular Promedio de Reseñas
        const misResenas = resenas.filter(r => r.vendedorEmail === usuarioActual.email);
        const total = misResenas.length;
        const suma = misResenas.reduce((acc, curr) => acc + curr.puntuacion, 0);
        const promedio = total > 0 ? (suma / total).toFixed(1) : "5.0";

        document.getElementById('perfil-promedio-estrellas').textContent = promedio;
        document.getElementById('perfil-total-reseñas').textContent = `(${total} reseñas)`;
        document.getElementById('stat-reseñas').textContent = total;
    } else {
        guestView.classList.remove('hidden');
        loggedView.classList.add('hidden');
        if (userDot) userDot.classList.add('hidden');
    }
}

// Iniciar Sesión
function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;

    const coincidencia = usuarios.find(u => u.email === email && u.pass === pass);

    if (coincidencia) {
        usuarioActual = coincidencia;
        guardarStorage();
        renderizarTodo();
        mostrarToast(`¡Bienvenido de nuevo, ${usuarioActual.nombre}!`, 'check-circle');
    } else {
        mostrarToast('Correo o contraseña incorrectos', 'exclamation-circle');
    }
}

// Registrar Usuario
function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;

    if (usuarios.some(u => u.email === email)) {
        mostrarToast('Este correo ya está registrado', 'exclamation-circle');
        return;
    }

    const nuevoUsuario = { nombre, email, pass };
    usuarios.push(nuevoUsuario);
    usuarioActual = nuevoUsuario;

    guardarStorage();
    renderizarTodo();
    mostrarToast('¡Cuenta creada correctamente!', 'check-circle');
}

// Cerrar Sesión
function cerrarSesion() {
    usuarioActual = null;
    guardarStorage();
    renderizarTodo();
    mostrarToast('Has cerrado sesión', 'info-circle');
}

// Alternar entre Login y Registro
function toggleAuthForm(tipo) {
    const loginBox = document.getElementById('form-login-container');
    const regBox = document.getElementById('form-register-container');

    if (tipo === 'register') {
        loginBox.classList.add('hidden');
        regBox.classList.remove('hidden');
    } else {
        regBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    }
}

// Cambiar Nombre de Usuario
function abrirModalEditarNombre() {
    if (!usuarioActual) return;
    document.getElementById('input-nuevo-nombre').value = usuarioActual.nombre;
    document.getElementById('modal-editar-nombre').classList.remove('hidden');
}

function cerrarModalEditarNombre() {
    document.getElementById('modal-editar-nombre').classList.add('hidden');
}

function guardarNuevoNombre() {
    const nuevoNombre = document.getElementById('input-nuevo-nombre').value.trim();
    if (!nuevoNombre) return;

    usuarioActual.nombre = nuevoNombre;

    // Actualizar también en el array global
    const idx = usuarios.findIndex(u => u.email === usuarioActual.email);
    if (idx !== -1) usuarios[idx].nombre = nuevoNombre;

    // Actualizar nombre de propietario en sus productos
    productos.forEach(p => {
        if (p.propietarioEmail === usuarioActual.email) {
            p.propietarioNombre = nuevoNombre;
        }
    });

    guardarStorage();
    renderizarTodo();
    cerrarModalEditarNombre();
    mostrarToast('Nombre actualizado con éxito', 'check-circle');
}

// Plantilla de Tarjetas
function crearTarjetaProducto(p) {
    return `
        <div class="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
                <div class="w-full h-32 rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover">
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

// Carrusel de Destacados
function renderizarCarruselDestacados() {
    const container = document.getElementById('carrusel-destacados');
    const destacados = productos.slice(0, 6);
    
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

// Renderizar Catálogo
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

// Filtrar Categorías
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
    cambiarPestana('productos');
}

// Buscador
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

// Publicar Producto
function publicarProducto(event) {
    event.preventDefault();

    if (!usuarioActual) {
        mostrarToast('Debes iniciar sesión para publicar', 'exclamation-circle');
        cambiarPestana('perfil');
        return;
    }

    const nombre = document.getElementById('pub-nombre').value.trim();
    const precio = Number(document.getElementById('pub-precio').value);
    const categoria = document.getElementById('pub-categoria').value;
    const imagenInput = document.getElementById('pub-imagen').value.trim();
    const descripcion = document.getElementById('pub-descripcion').value.trim();

    if (!nombre || !descripcion || precio <= 0) {
        mostrarToast('Completa todos los campos adecuadamente', 'exclamation-circle');
        return;
    }

    let imagenPorDefecto = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
    if (categoria === 'Hogar') imagenPorDefecto = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80";
    if (categoria === 'Moda') imagenPorDefecto = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
    if (categoria === 'Juegos') imagenPorDefecto = "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80";

    const nuevoProducto = {
        id: Date.now(),
        nombre,
        precio,
        categoria,
        imagen: imagenInput !== '' ? imagenInput : imagenPorDefecto,
        descripcion,
        propietarioEmail: usuarioActual.email,
        propietarioNombre: usuarioActual.nombre
    };

    productos.unshift(nuevoProducto);
    guardarStorage();
    renderizarTodo();

    document.getElementById('form-publicar').reset();
    mostrarToast('¡Producto publicado con éxito!', 'check-circle');
    cambiarPestana('productos');
}

// Mis Publicaciones
function renderizarMisPublicaciones() {
    if (!usuarioActual) return;
    const container = document.getElementById('mis-publicaciones-container');
    const misProds = productos.filter(p => p.propietarioEmail === usuarioActual.email);

    document.getElementById('stat-publicados').textContent = misProds.length;

    if (misProds.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 bg-white rounded-2xl border border-slate-100">
                <p class="text-xs text-slate-400">Aún no has publicado artículos.</p>
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
    guardarStorage();
    renderizarTodo();
    mostrarToast('Producto eliminado', 'info-circle');
}

// Reseñas del Perfil
function renderizarResenasPerfil() {
    if (!usuarioActual) return;
    const container = document.getElementById('lista-reseñas-container');
    const misResenas = resenas.filter(r => r.vendedorEmail === usuarioActual.email);

    if (misResenas.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 bg-white rounded-2xl border border-slate-100">
                <p class="text-xs text-slate-400">Aún no tienes reseñas recibidas.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = misResenas.map(r => `
        <div class="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">${r.autor}</span>
                <div class="text-amber-400 text-xs">
                    ${'★'.repeat(r.puntuacion)}${'☆'.repeat(5 - r.puntuacion)}
                </div>
            </div>
            <p class="text-xs text-slate-500">${r.comentario}</p>
        </div>
    `).join('');
}

// Modal de Detalle
function abrirModal(id) {
    productoSeleccionado = productos.find(p => p.id === id);
    if (!productoSeleccionado) return;

    document.getElementById('modal-imagen').src = productoSeleccionado.imagen;
    document.getElementById('modal-titulo').textContent = productoSeleccionado.nombre;
    document.getElementById('modal-precio').textContent = formatearCOP(productoSeleccionado.precio);
    document.getElementById('modal-desc').textContent = productoSeleccionado.descripcion;
    document.getElementById('modal-vendedor-badge').textContent = `Vendedor: ${productoSeleccionado.propietarioNombre}`;

    seleccionarEstrella(5);
    document.getElementById('modal-resena-texto').value = '';

    document.getElementById('modal-contacto').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modal-contacto').classList.add('hidden');
    productoSeleccionado = null;
}

// Selección de Estrellas en Modal
function seleccionarEstrella(num) {
    estrellaSeleccionadaModal = num;
    const estrellas = document.querySelectorAll('#modal-star-rating i');
    estrellas.forEach((star, index) => {
        if (index < num) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Guardar Reseña enviada
function guardarResenaModal() {
    if (!productoSeleccionado) return;
    const texto = document.getElementById('modal-resena-texto').value.trim();

    if (!texto) {
        mostrarToast('Escribe un comentario breve', 'exclamation-circle');
        return;
    }

    const autorNombre = usuarioActual ? usuarioActual.nombre : "Comprador Anónimo";

    resenas.unshift({
        vendedorEmail: productoSeleccionado.propietarioEmail,
        autor: autorNombre,
        puntuacion: estrellaSeleccionadaModal,
        comentario: texto
    });

    guardarStorage();
    renderizarTodo();
    mostrarToast('¡Reseña guardada con éxito!', 'check-circle');
    document.getElementById('modal-resena-texto').value = '';
}

// Contacto WhatsApp
function enviarMensajeWhatsApp() {
    if (!productoSeleccionado) return;
    const mensaje = `Hola ${productoSeleccionado.propietarioNombre}! Me interesa tu producto "${productoSeleccionado.nombre}" en Garaje Online por ${formatearCOP(productoSeleccionado.precio)}.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    cerrarModal();
}

// Mensaje Toast
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
