// ========================
// Puerto
//=========================

process.env.PORT = process.env.PORT || 3000;

// ========================
// Entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ========================
// Vencimiento de token
//=========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================
// SEED
//=========================

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

// ========================
// Data base
//=========================

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ========================
// Google clindid
//=========================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "179239282209-350d1dacnd5micqknc22v1ppvb35cv25.apps.googleusercontent.com";
