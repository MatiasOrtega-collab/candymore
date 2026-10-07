const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CandyMore API',
      version: '1.0.0',
      description: 'API REST para el sistema de pedidos de CandyMore',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo local',
      },
    ],
  },
  // Aquí le decimos a Swagger dónde encontrar los comentarios de documentación
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;