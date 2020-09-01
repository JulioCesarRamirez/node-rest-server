const express = require("express");
const fs = require("fs");
const path = require("path");

const { verificaTokenImg } = require("../middlewares/autenticacion");

const app = express();

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
  const tipo = req.params.tipo;
  const img = req.params.img;

  let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${img}`);

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    let noImagePAth = path.resolve(__dirname, "../assets/no-image.jpg");

    res.sendFile(noImagePAth);
  }
});

module.exports = app;
