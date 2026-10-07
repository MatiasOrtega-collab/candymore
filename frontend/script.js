// URL base de nuestro Backend API
const API_URL = "http://localhost:5000/api";

// Estado local del Carrito y Productos
let carrito = [];
let listaProductosGlobal = [];

// Elementos del DOM
const contadorElemento = document.getElementById('cart-count');
const botonCarrito = document.getElementById('cart-btn');
const cabecera = document.querySelector('header');
const listaCarritoUI = document.getElementById('items-carrito');
const totalCarritoUI = document.getElementById('total-carrito');
const mensajeVacioUI = document.getElementById('mensaje-vacio');

const formPedidoPequeno = document.getElementById('form-pedido-pequeno');
const formPedidoGrande = document.getElementById('form-pedido-grande');

// 1. CARGAR PRODUCTOS DESDE MONGODB AL INICIAR
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeAPI();

    // Evento de búsqueda en vivo
    const inputBusqueda = document.getElementById('input-busqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase().trim();
            const filtrados = listaProductosGlobal.filter(p => 
                p.nombre.toLowerCase().includes(termino) || 
                (p.descripcion && p.descripcion.toLowerCase().includes(termino))
            );
            renderizarProductos(filtrados);
        });
    }

    // Inicializar estado del carrito
    actualizarCarritoUI();
});

// Obtener catálogo desde el backend
async function cargarProductosDesdeAPI() {
    const contenedor = document.getElementById('contenedor-productos');
    
    try {
        const respuesta = await fetch(`${API_URL}/productos`);
        const productos = await respuesta.json();

        if (!respuesta.ok || productos.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; width: 100%;">No hay productos disponibles por el momento.</p>';
            return;
        }

        listaProductosGlobal = productos;
        renderizarProductos(listaProductosGlobal);

    } catch (error) {
        console.error("Error al cargar productos:", error);
        contenedor.innerHTML = '<p style="text-align:center; width: 100%;">Error de conexión con el catálogo.</p>';
    }
}

// Pintar tarjetas de productos en el HTML
function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; width: 100%;">No se encontraron dulces con ese nombre.</p>';
        return;
    }

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${producto.imagen || 'image/Macarons Franceses.jpg'}" alt="${producto.nombre}">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion || ''}</p>
                <span class="price">$${Number(producto.precio).toFixed(2)}</span>
                <button class="add-to-cart-btn" 
                        data-name="${producto.nombre}" 
                        data-price="${producto.precio}">
                    Agregar al Carrito
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });

    activarBotonesCarrito();
}

// 2. ACTIVAR EVENTOS EN BOTONES DE AGREGAR AL CARRITO
function activarBotonesCarrito() {
    document.querySelectorAll('.add-to-cart-btn').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const nombre = btn.getAttribute('data-name');
            const precio = parseFloat(btn.getAttribute('data-price'));

            // Buscar si el producto ya está en el carrito
            const itemExistente = carrito.find(item => item.nombre === nombre);

            if (itemExistente) {
                itemExistente.cantidad += 1;
            } else {
                carrito.push({
                    nombre: nombre,
                    cantidad: 1,
                    precioUnitario: precio
                });
            }

            actualizarCarritoUI();

            // Efecto visual en el botón del carrito
            if (botonCarrito) {
                botonCarrito.classList.add('cart-pop');
                setTimeout(() => botonCarrito.classList.remove('cart-pop'), 400);
            }
        });
    });
}

// Dibujar y actualizar los productos del carrito
function actualizarCarritoUI() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (contadorElemento) contadorElemento.textContent = totalItems;

    const btnComprar = document.getElementById('btn-comprar');

    if (carrito.length === 0) {
        if (mensajeVacioUI) mensajeVacioUI.style.display = 'block';
        if (listaCarritoUI) listaCarritoUI.innerHTML = '';
        if (totalCarritoUI) totalCarritoUI.textContent = '0.00';

        if (btnComprar) {
            btnComprar.disabled = true;
            btnComprar.style.opacity = '0.5';
            btnComprar.style.cursor = 'not-allowed';
        }
        return;
    }

    if (btnComprar) {
        btnComprar.disabled = false;
        btnComprar.style.opacity = '1';
        btnComprar.style.cursor = 'pointer';
    }

    if (mensajeVacioUI) mensajeVacioUI.style.display = 'none';
    if (listaCarritoUI) listaCarritoUI.innerHTML = '';

    let totalPrecio = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precioUnitario * item.cantidad;
        totalPrecio += subtotal;

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.padding = '8px 0';
        li.style.borderBottom = '1px solid #eee';

        li.innerHTML = `
            <div style="flex: 1;">
                <strong style="font-size: 14px;">${item.nombre}</strong>
                <br>
                <small style="color: #666;">$${item.precioUnitario.toFixed(2)} c/u</small>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
                <button onclick="cambiarCantidad(${index}, -1)" style="padding: 2px 8px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                <span style="font-size: 14px; font-weight: bold;">${item.cantidad}</span>
                <button onclick="cambiarCantidad(${index}, 1)" style="padding: 2px 8px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                <span style="font-weight: bold; margin-left: 10px; font-size: 14px;">$${subtotal.toFixed(2)}</span>
                <button onclick="eliminarDelCarrito(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; margin-left: 8px; font-size: 16px;">&times;</button>
            </div>
        `;
        if (listaCarritoUI) listaCarritoUI.appendChild(li);
    });

    if (totalCarritoUI) totalCarritoUI.textContent = totalPrecio.toFixed(2);
}

// Modificar la cantidad de un item existente
function cambiarCantidad(index, cambio) {
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        actualizarCarritoUI();
    }
}

// Eliminar un producto completo del carrito
function eliminarDelCarrito(index) {
    if (carrito[index]) {
        carrito.splice(index, 1);
        actualizarCarritoUI();
    }
}

// 3. ENVIAR PEDIDO PEQUEÑO (DELIVERY) A MONGODB
if (formPedidoPequeno) {
    formPedidoPequeno.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega al menos un dulce.');
            return;
        }

        const btnComprar = document.getElementById('btn-comprar');
        const textoOriginal = btnComprar ? btnComprar.textContent : 'Confirmar Pedido';

        if (btnComprar) {
            btnComprar.disabled = true;
            btnComprar.textContent = "Procesando pedido...";
        }

        const nuevoPedido = {
            cliente: {
                nombre: document.getElementById('cliente-nombre').value,
                email: document.getElementById('cliente-email').value,
                telefono: document.getElementById('cliente-telefono').value
            },
            tipoPedido: "pequeño",
            productos: carrito,
            direccionEntrega: document.getElementById('cliente-direccion').value
        };

        try {
            const respuesta = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoPedido)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(`¡Pedido registrado con éxito en MongoDB! ID: ${resultado.id}`);
                carrito = [];
                actualizarCarritoUI();
                formPedidoPequeno.reset();
            } else {
                alert(`Error: ${resultado.mensaje}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el backend en http://localhost:3000");
        } finally {
            if (btnComprar) {
                btnComprar.disabled = false;
                btnComprar.textContent = textoOriginal;
            }
        }
    });
}

// 4. ENVIAR PEDIDO GRANDE (EVENTOS) A MONGODB
if (formPedidoGrande) {
    formPedidoGrande.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoPedidoGrande = {
            cliente: {
                nombre: document.getElementById('evento-nombre').value,
                email: document.getElementById('evento-email').value,
                telefono: document.getElementById('evento-telefono').value
            },
            tipoPedido: "grande",
            productos: [
                {
                    nombre: "Cotización de Evento",
                    cantidad: 1,
                    precioUnitario: 0
                }
            ],
            fechaEntrega: document.getElementById('evento-fecha').value,
            datosEvento: {
                tipoEvento: document.getElementById('evento-tipo').value,
                cantidadPersonas: Number(document.getElementById('evento-personas').value),
                observaciones: document.getElementById('evento-observaciones').value
            }
        };

        try {
            const respuesta = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoPedidoGrande)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(`¡Solicitud de evento guardada en MongoDB! ID: ${resultado.id}`);
                formPedidoGrande.reset();
            } else {
                alert(`Error: ${resultado.mensaje}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el backend.");
        }
    });
}

// Efecto de sombreado en la cabecera al hacer scroll
window.addEventListener('scroll', () => {
    if (cabecera) {
        if (window.scrollY > 50) {
            cabecera.classList.add('scrolled');
        } else {
            cabecera.classList.remove('scrolled');
        }
    }
});