const express = require('express');
const router = express.Router();
const {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} = require('../controllers/pedidos.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - cliente
 *         - tipoPedido
 *         - productos
 *       properties:
 *         cliente:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             telefono:
 *               type: string
 *             email:
 *               type: string
 *           description: Información del cliente
 *         tipoPedido:
 *           type: string
 *           enum: [grande, pequeño]
 *           description: Tipo de pedido
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *               nombre:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               precioUnitario:
 *                 type: number
 *           description: Lista de productos en el pedido
 *         montoTotal:
 *           type: number
 *           description: Total calculado del pedido
 *         direccionEntrega:
 *           type: string
 *           description: Dirección para delivery o entrega
 *         fechaEntrega:
 *           type: string
 *           format: date
 *           description: Fecha programada de entrega
 *         estado:
 *           type: string
 *           enum: [pendiente, confirmado, enviado, cancelado]
 *           description: Estado actual del pedido
 *         datosEvento:
 *           type: object
 *           properties:
 *             tipoEvento:
 *               type: string
 *             cantidadPersonas:
 *               type: number
 *             observaciones:
 *               type: string
 *           description: Datos adicionales (solo para pedidos grandes)
 */

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtiene todos los pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/', obtenerPedidos);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtiene un pedido por su ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', obtenerPedidoPorId);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido registrado con éxito
 *       400:
 *         description: Faltan datos obligatorios o tipoPedido inválido
 */
router.post('/', crearPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Actualiza el estado o datos de un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado con éxito
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id', actualizarPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Elimina un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del pedido
 *     responses:
 *       200:
 *         description: Pedido eliminado correctamente
 *       404:
 *         description: Pedido no encontrado
 */
router.delete('/:id', eliminarPedido);

module.exports = router;
