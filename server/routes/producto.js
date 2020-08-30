const express = require("express");

const { verificarToken } = require("../middlewares/autenticacion");

const app = express();
const Producto = require("../models/producto");

app.get("/productos", verificarToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});

app.get("/producto/:id", verificarToken, (req, res) => {
  const id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre, email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El producto no exite",
          },
        });
      }
      res.json({
        ok: true,
        productoDB,
      });
    });
});

app.get("/producto/buscar/:termino", verificarToken, (req, res) => {
  const termino = req.params.termino;

  let regex = new RegExp(termino, "i");
  Producto.find({ nombre: regex, disponible: true })
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});

app.post("/producto", verificarToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  });
  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.put("/producto/:id", verificarToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "El producto no exite",
        },
      });
    }
    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoGuardado,
      });
    });
  });
});

app.delete("/producto/:id", verificarToken, (req, res) => {
  const id = req.params.id;
  Producto.findById(id)
    .populate("usuario", "nombre, email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El producto no exite",
          },
        });
      }
      productoDB.disponible = false;
      productoDB.save((err, productoBorrado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          producto: productoBorrado,
          message: "Producto borrado",
        });
      });
    });
});

module.exports = app;
