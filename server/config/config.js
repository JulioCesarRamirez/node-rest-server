// ========================
// Puerto
//=========================

process.env.PORT = process.env.PORT || 3000;

// ========================
// Entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ========================
// Data base
//=========================

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB =
    "mongodb+srv://cafe-user:tsyDWSup79f3Tr85@cluster0.cogxe.mongodb.net/cafe?retryWrites=true&w=majority";
}

process.env.URLDB = urlDB;
