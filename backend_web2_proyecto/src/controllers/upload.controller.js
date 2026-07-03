const subirComprobante = (req, res) => {
  try {
    const nombreArchivo = req.body.nombreArchivo;
    if (!nombreArchivo) {
      return res
        .status(400)
        .json({ error: "No se proporcionó nombre de archivo" });
    }

    res.json({
      mensaje: "Comprobante registrado correctamente",
      nombreArchivo,
      ruta: `/uploads/comprobantes/${nombreArchivo}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  subirComprobante
};