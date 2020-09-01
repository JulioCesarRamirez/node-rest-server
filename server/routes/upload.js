const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

// default options
app.use(fileUpload());

const Usuario = require("../models/usuario");
const Prodcuto = require("../models/producto");
const fs = require("fs");
const path = require("path");

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha selecionado ningún archivo",
      },
    });
  }

  //Validar tipo

  let tiposValidos = ["productos", "usuarios"];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Tipo: ${tipo} no es permitido, los permitidos son: ${tiposValidos.join(
          ", "
        )}`,
      },
    });
  }

  let archivo = req.files.archivo;
  let [nombre, extension] = archivo.name.split(".");

  //Estensiones permitidas

  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (!extensionesValidas.includes(extension)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Extension: ${extension} no es valida , las permitidas son: 
          ${extensionesValidas.join(", ")}`,
      },
    });
  }

  //Cambiar nombre al archivo

  let nomrbeArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`upload/${tipo}/${nomrbeArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (tipo === "usuarios") {
      imagenUsuario(id, res, nomrbeArchivo);
    } else {
      imagenProducto(id, res, nomrbeArchivo);
    }
  });
});
function imagenUsuario(id, res, nomrbeArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nomrbeArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!usuarioDB) {
      borraArchivo(nomrbeArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }
    borraArchivo(usuarioDB.img, "usuarios");
    usuarioDB.img = nomrbeArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nomrbeArchivo,
      });
    });
  });
}
function imagenProducto(id, res, nomrbeArchivo) {
  Prodcuto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nomrbeArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      borraArchivo(nomrbeArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }
    borraArchivo(productoDB.img, "productos");
    productoDB.img = nomrbeArchivo;

    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nomrbeArchivo,
      });
    });
  });
}

function borraArchivo(nombreImg, tipo) {
  let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${nombreImg}`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}
module.exports = app;
