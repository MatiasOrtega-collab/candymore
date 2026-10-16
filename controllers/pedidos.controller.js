const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

// Obtener la colección 'pedidos'
const getColeccionPedidos = () => getDB().collection('pedidos');

// GET: Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await getColeccionPedidos().find().toArray();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pedidos", error: error.message });
  }
};

// GET: Obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    const pedido = await getColeccionPedidos().findOne({ _id: new ObjectId(id) });
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar el pedido", error: error.message });
  }
  
};

// POST: Crear un nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { cliente, tipoPedido, productos, direccionEntrega, fechaEntrega, datosEvento } = req.body;

    // Validación básica de campos requeridos
    if (!cliente || !tipoPedido || !productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios (cliente, tipoPedido, productos)" });
    }

    if (tipoPedido !== "grande" && tipoPedido !== "pequeño") {
      return res.status(400).json({ mensaje: "El tipoPedido debe ser 'grande' o 'pequeño'" });
    }

    // Calcular el monto total del pedido
    const montoTotal = productos.reduce((sum, item) => sum + (Number(item.precioUnitario || 0) * Number(item.cantidad || 1)), 0);

    const nuevoPedido = {
      cliente,
      tipoPedido,
      productos,
      montoTotal,
      direccionEntrega: direccionEntrega || "",
      fechaEntrega: fechaEntrega || null,
      estado: "pendiente",
      ...(tipoPedido === "grande" && { datosEvento: datosEvento || {} }),
      fechaPedido: new Date()
    };

    const resultado = await getColeccionPedidos().insertOne(nuevoPedido);
    res.status(201).json({
      mensaje: "Pedido registrado con éxito",
      id: resultado.insertedId,
      pedido: nuevoPedido
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar pedido", error: error.message });
  }
};

// PUT: Actualizar el estado o datos de un pedido
const actualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    const datosActualizar = req.body;
    const resultado = await getColeccionPedidos().updateOne(
      { _id: new ObjectId(id) },
      { $set: datosActualizar }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json({ mensaje: "Pedido actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el pedido", error: error.message });
  }
};

// DELETE: Eliminar un pedido
const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    const resultado = await getColeccionPedidos().deleteOne({ _id: new ObjectId(id) });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json({ mensaje: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el pedido", error: error.message });
  }
};

module.exports = {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido
};