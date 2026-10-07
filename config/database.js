const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB;

const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
    if (db) return db;

    try {
        await client.connect();
        console.log("MongoDB conectado correctamente");

        db = client.db(DB_NAME);
        console.log(`Base de datos seleccionada: ${db.databaseName}`);

        return db;
    } catch (error) {
        console.error("Error al conectar con MongoDB:");
        console.error(error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("La base de datos no ha sido inicializada. Llama a connectDB primero.");
    }
    return db;
}

module.exports = { connectDB, getDB };