const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosAdmin();
});

async function cargarPedidosAdmin() {
    const tablaBody = document.getElementById('tabla-pedidos-body');

    try {
        const respuesta = await fetch(`${API_URL}/pedidos`);
        const pedidos = await respuesta.json();

        if (!respuesta.ok || pedidos.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No hay pedidos registrados en la base de datos.</td>
                </tr>`;
            return;
        }

        tablaBody.innerHTML = '';

        pedidos.forEach(pedido => {
            const tr = document.createElement('tr');

            // Formatear la lista de productos comprados
            const resumenProductos = pedido.productos.map(p => 
                `${p.cantidad}x ${p.nombre} ($${(p.precioUnitario * p.cantidad).toFixed(2)})`
            ).join('<br>');

            // Formatear fecha si existe
            const fecha = pedido.fechaCreacion 
                ? new Date(pedido.fechaCreacion).toLocaleString('es-ES') 
                : 'Reciente';

            // Badge de tipo de pedido
            const badgeClass = pedido.tipoPedido === 'pequeño' ? 'badge-pequeno' : 'badge-grande';
            const tipoEtiqueta = pedido.tipoPedido === 'pequeño' ? 'Delivery' : 'Evento';

            // Datos adicionales según el tipo
            let infoAdicional = '-';
            if (pedido.tipoPedido === 'pequeño') {
                infoAdicional = `<strong>Dirección:</strong> ${pedido.direccionEntrega || 'No especificada'}`;
            } else if (pedido.tipoPedido === 'grande') {
                infoAdicional = `
                    <strong>Fecha Evento:</strong> ${pedido.fechaEntrega || 'N/A'}<br>
                    <strong>Tipo:</strong> ${pedido.datosEvento?.tipoEvento || 'N/A'}<br>
                    <strong>Personas:</strong> ${pedido.datosEvento?.cantidadPersonas || 'N/A'}
                `;
            }

            tr.innerHTML = `
                <td>
                    <small style="color: #888;">${pedido._id}</small><br>
                    <small>${fecha}</small>
                </td>
                <td>
                    <strong>${pedido.cliente.nombre}</strong><br>
                    <small>📧 ${pedido.cliente.email}</small><br>
                    <small>📞 ${pedido.cliente.telefono}</small>
                </td>
                <td><span class="badge ${badgeClass}">${tipoEtiqueta}</span></td>
                <td>${resumenProductos}</td>
                <td><small>${infoAdicional}</small></td>
            `;

            tablaBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error al cargar pedidos en admin:", error);
        tablaBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: red;">Error al conectar con el servidor backend.</td>
            </tr>`;
    }
}