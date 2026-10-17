const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectDB } = require("./config/database");
const productosRoutes = require("./routes/productos.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

// Importar los módulos de Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
// 1. Agregado según la guía de tu clase para procesar formularios
app.use(express.urlencoded({ extended: true })); 

// Servir frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Ruta para la interfaz visual de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API (Backend)
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);

// 2. Ruta raíz agregada exactamente como pide el profesor
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

async function iniciarServidor() {
  try {
    await connectDB();

    // 3. Agregado el "0.0.0.0" vital para que Docker exponga el puerto correctamente
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`Documentación de la API en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

iniciarServidor();