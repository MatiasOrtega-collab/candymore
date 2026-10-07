const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

// Obtener la colección 'productos'
const getColeccionProductos = () => getDB().collection('productos');

// GET: Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await getColeccionProductos().find().toArray();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

// GET: Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    const producto = await getColeccionProductos().findOne({ _id: new ObjectId(id) });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar el producto", error: error.message });
  }
};

// POST: Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, stock, imagen, disponible } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({ mensaje: "El nombre y el precio son obligatorios" });
    }

    const nuevoProducto = {
      nombre,
      descripcion: descripcion || "",
      categoria: categoria || "general",
      precio: Number(precio),
      stock: Number(stock) || 0,
      imagen: imagen || "",
      disponible: disponible !== undefined ? disponible : true,
      fechaCreacion: new Date()
    };

    const resultado = await getColeccionProductos().insertOne(nuevoProducto);
    res.status(201).json({
      mensaje: "Producto creado con éxito",
      id: resultado.insertedId,
      producto: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

// PUT: Actualizar un producto existente
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    const datosActualizar = req.body;
    const resultado = await getColeccionProductos().updateOne(
      { _id: new ObjectId(id) },
      { $set: datosActualizar }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
  }
};

// DELETE: Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    const resultado = await getColeccionProductos().deleteOne({ _id: new ObjectId(id) });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};