document.addEventListener('DOMContentLoaded', function () {
    const productosPorPagina = 3; // Número de productos por página
    let paginaActual = 1;

    const botonesCategorias = document.querySelectorAll('.categoria-btn');
    const productos = document.querySelectorAll('.producto');
    const paginaActualElemento = document.getElementById('pagina-actual');
    const botonAnterior = document.getElementById('anterior');
    const botonSiguiente = document.getElementById('siguiente');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const botonWhatsApp = document.getElementById('enviar-whatsapp');

    let carrito = [];

    // Función para mostrar productos según la categoría y la página
    function mostrarProductos(categoria, pagina) {
        const inicio = (pagina - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;

        let productosFiltrados = [];

        if (categoria === 'todos') {
            productosFiltrados = Array.from(productos);
        } else {
            productosFiltrados = Array.from(productos).filter(producto => producto.getAttribute('data-categoria') === categoria);
        }

        productos.forEach(producto => producto.style.display = 'none');

        productosFiltrados.slice(inicio, fin).forEach(producto => producto.style.display = 'block');

        paginaActualElemento.textContent = pagina;

        // Habilitar o deshabilitar botones de paginación
        botonAnterior.disabled = pagina === 1;
        botonSiguiente.disabled = fin >= productosFiltrados.length;
    }

    // Eventos para los botones de categorías
    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', function () {
            botonesCategorias.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const categoria = this.getAttribute('data-categoria');
            paginaActual = 1;
            mostrarProductos(categoria, paginaActual);
        });
    });

    // Eventos para los botones de paginación
    botonAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            const categoriaActiva = document.querySelector('.categoria-btn.active').getAttribute('data-categoria');
            mostrarProductos(categoriaActiva, paginaActual);
        }
    });

    botonSiguiente.addEventListener('click', () => {
        const categoriaActiva = document.querySelector('.categoria-btn.active').getAttribute('data-categoria');
        const productosFiltrados = categoriaActiva === 'todos' ? productos : Array.from(productos).filter(producto => producto.getAttribute('data-categoria') === categoriaActiva);
        if (paginaActual < Math.ceil(productosFiltrados.length / productosPorPagina)) {
            paginaActual++;
            mostrarProductos(categoriaActiva, paginaActual);
        }
    });

    // Función para agregar productos al carrito
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', function () {
            const nombre = this.getAttribute('data-nombre');
            const precio = parseInt(this.getAttribute('data-precio'));

            carrito.push({ nombre, precio });
            actualizarCarrito();
        });
    });

    // Función para actualizar el carrito
    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach(producto => {
            const li = document.createElement('li');
            li.textContent = `${producto.nombre} - $${producto.precio.toLocaleString()}`;
            listaCarrito.appendChild(li);
            total += producto.precio;
        });

        totalCarrito.textContent = total.toLocaleString();
    }

    // Función para enviar el pedido por WhatsApp
botonWhatsApp.addEventListener('click', () => {
    const mensaje = carrito.map(producto => `${producto.nombre} - $${producto.precio.toLocaleString()}`).join('%0A');
    const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
    
    // Usa tu enlace personalizado de WhatsApp
    const url = `https://w.app/eyvubh?text=Hola, quiero hacer este pedido:%0A${mensaje}%0ATotal: $${total.toLocaleString()}`;

    window.open(url, '_blank');
});

    // Mostrar todos los productos en la primera página al cargar
    mostrarProductos('todos', paginaActual);
});