const jwt = require("jsonwebtoken");

// ====================
// Verificar token
// ====================

const verificarToken = (req, res, next) => {
  const token = req.get("token");
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido",
        },
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

// ====================
// Verifica AdminRole
// ====================
const verificaAdminRole = (req, res, next) => {
  if (req.usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: "Role no válido",
      },
    });
  }
};

// ====================
// Verifica para imagen
// ====================

const verificaTokenImg = (req, res, next) => {
  let token = req.query.token;
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido",
        },
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  verificarToken,
  verificaAdminRole,
  verificaTokenImg,
};
