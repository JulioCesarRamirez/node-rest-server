const express = require("express");
let {
  verificarToken,
  verificaAdminRole,
} = require("../middlewares/autenticacion");

const app = express();

const Categoria = require("../models/categoria");

app.get("/categoria", verificarToken, (req, res) => {
  Categoria.find({})
  .sort("descripcion")
  .populate("usuario", "nombre email")
  .exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categorias,
    });
  });
});

app.get("/categoria/:id", verificarToken, (req, res) => {
  const id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe",
        },
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

app.post("/categoria", verificarToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});
app.put("/categoria/:id", verificarToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const descCategoria = {
    descripcion: body.descripcion,
  };
  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});
app.delete(
  "/categoria/:id",
  [verificarToken, verificaAdminRole],
  (req, res) => {
    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id no existe",
          },
        });
      }
      res.json({
        ok: true,
        message: "categoria borrada",
      });
    });
  }
);

module.exports = app;
