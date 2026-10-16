const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productos.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del producto
 *         descripcion:
 *           type: string
 *           description: La descripción del producto
 *         categoria:
 *           type: string
 *           description: Categoría del producto (ej. dulces, chocolates)
 *         precio:
 *           type: number
 *           description: El precio del producto
 *         stock:
 *           type: number
 *           description: Cantidad disponible
 *         imagen:
 *           type: string
 *           description: URL de la imagen
 *         disponible:
 *           type: boolean
 *           description: Estado de disponibilidad
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get('/', obtenerProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', obtenerProductoPorId);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *       400:
 *         description: Faltan datos obligatorios
 */
router.post('/', crearProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', actualizarProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', eliminarProducto);

module.exports = router;