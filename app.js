function buscarProductos() {
    const texto = document.getElementById("buscador")
        .value.toLowerCase().trim();

    const productos = document.querySelectorAll(".producto");
    let encontrados = 0;

    productos.forEach(function(producto) {
        const contenido = producto.innerText.toLowerCase();
        const coincide = contenido.includes(texto);

        producto.style.display = coincide ? "block" : "none";

        if (coincide) encontrados++;
    });

    document.getElementById("mensaje").textContent =
        encontrados > 0
        ? "Encontramos " + encontrados + " producto(s)."
        : "No encontramos productos con ese nombre.";
}

function comprar(nombre) {
    document.getElementById("mensaje").textContent =
        "Te interesa: " + nombre +
        ". Contacta al vendedor para acordar la compra.";
}

document.getElementById("formulario")
    .addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const precio = Number(document.getElementById("precio").value);
        const descripcion =
            document.getElementById("descripcion").value.trim();

        if (!nombre || !descripcion || precio <= 0) {
            alert("Completa los datos correctamente.");
            return;
        }

        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const imagen = document.createElement("div");
        imagen.className = "imagen";
        imagen.textContent = "📦";

        const titulo = document.createElement("h3");
        titulo.textContent = nombre;

        const detalle = document.createElement("p");
        detalle.textContent = descripcion;

        const valor = document.createElement("strong");
        valor.textContent = precio.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });

        const boton = document.createElement("button");
        boton.textContent = "Me interesa";
        boton.addEventListener("click", function() {
            comprar(nombre);
        });

        tarjeta.append(imagen, titulo, detalle, valor, boton);

        document.getElementById("listaProductos")
            .appendChild(tarjeta);

        document.getElementById("formulario").reset();

        document.getElementById("mensaje").textContent =
            "¡Producto publicado correctamente!";
    });
