const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/database");
const productosRoutes = require("./routes/productos.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

// 1. Importar los módulos de Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 2. Ruta para la interfaz visual de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);

// Ruta inicial de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de CandyMore funcionando"
  });
});

async function iniciarServidor() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Documentación de la API en http://localhost:${PORT}/api-docs`);
  });
}

iniciarServidor();